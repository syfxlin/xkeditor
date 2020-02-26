import intersect from "./path-intersect";

window.paints = [];

function rect2path(x, y, width, height, rx, ry) {
  x = parseFloat(x);
  y = parseFloat(y);
  width = parseFloat(width);
  height = parseFloat(height);
  rx = parseFloat(rx);
  ry = parseFloat(ry);
  rx = rx || ry || 0;
  ry = ry || rx || 0;
  if (isNaN(x - y + width - height + rx - ry)) return;
  rx = rx > width / 2 ? width / 2 : rx;
  ry = ry > height / 2 ? height / 2 : ry;
  var path = "";
  if (0 == rx || 0 == ry) {
    path = `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
  } else {
    path =
      `M ${x} ${y + ry} ` +
      `a ${rx} ${ry} 0 0 1 ${rx} ${-ry} ` +
      `h ${width - 2 * rx} ` +
      `a ${rx} ${ry} 0 0 1 ${rx} ${ry} ` +
      `v ${height - 2 * ry} ` +
      `a ${rx} ${ry} 0 0 1 ${-rx} ${ry} ` +
      `h ${2 * rx - width} ` +
      `a ${rx} ${ry} 0 0 1 ${-rx} ${-ry} ` +
      `Z`;
  }
  return path;
}

function ellipse2path(cx, cy, rx, ry) {
  cx = parseFloat(cx);
  cy = parseFloat(cy);
  rx = parseFloat(rx);
  ry = parseFloat(ry);
  if (isNaN(cx - cy + rx - ry)) return;
  return (
    `M ${cx - rx} ${cy} ` +
    `a ${rx} ${ry} 0 1 0 ${2 * rx} 0` +
    `a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 ` +
    `Z`
  );
}

function polygon2path(points) {
  let pointsList = points.split(/(,|, )/g);
  return `M ${pointsList[0]} L ${pointsList.splice(1).join(" ")} Z`;
}

export default function initPaint(svgId, conf = null) {
  if (window.paints[svgId]) {
    return;
  } else {
    window.paints.push(svgId);
  }
  var svgns = "http://www.w3.org/2000/svg";
  var svg = document.getElementById(svgId);

  var config = {
    color: "#6190e8",
    fillColor: "none",
    lineWidth: 2,
    eraserSize: 10,
    fontFamily: "inherit",
    fontSize: 14,
    type: "pen",
    ...conf
  };

  document.querySelector(`[data-type="${config.type}"`).classList.add("active");
  document.querySelector("#select-color").value = "custom";
  document.querySelector("#custom-color").value = config.color;
  document.querySelector("#select-size").value = "custom";
  document.querySelector("#custom-size").value = config.lineWidth;
  document.querySelector("#select-fill-color").value =
    config.fillColor === "none" ? "none" : "custom";
  document.querySelector("#custom-fill-color").value =
    config.fillColor === "none" ? "black" : config.fillColor;
  document.querySelector("#text-size").value = config.fontSize;

  var drawMoveOpen = false;
  var selectHasMove = false;
  var resizeOpen = false;
  var svgCurrEle = null;
  var eraserPath = "";
  var tempPoint = null;
  var drawLimited = false;
  var resizeBtn = false;
  var resizeIndex = null;
  var resizeEle = null;
  let resizeType = null;
  var resizePoints = {};

  var undoList = [];
  var redoList = [];
  var boxSizeList = [];
  var redoBoxSizeList = [];

  // Init
  for (const item of svg.children) {
    undoList.push(item);
    boxSizeList.push(item.getBBox());
  }

  var getPoint = (x, y) => {
    var svgOffset = svg.getBoundingClientRect();
    if (drawLimited) {
      return {
        x: Math.round((x - svgOffset.x) / 20) * 20,
        y: Math.round((y - svgOffset.y) / 20) * 20
      };
    } else {
      return {
        x: Math.round((x - svgOffset.x) * 100) / 100,
        y: Math.round((y - svgOffset.y) * 100) / 100
      };
    }
  };

  var drawDown = e => {
    drawMoveOpen = true;
    let { x, y } = getPoint(e.clientX, e.clientY);
    if (e.target.getAttributeNS(null, "data-resize")) {
      resizeOpen = true;
      resizeBtn = e.target;
      tempPoint = { x, y };
      resizeIndex = parseInt(
        resizeBtn.parentElement.getAttributeNS(null, "data-index")
      );
      resizeEle = undoList[resizeIndex];
      resizeType = resizeEle.nodeName;
      if (resizeType === "path") {
        resizePoints = {
          x: boxSizeList[resizeIndex].x,
          y: boxSizeList[resizeIndex].y,
          width: boxSizeList[resizeIndex].width,
          height: boxSizeList[resizeIndex].height,
          points: resizeEle
            .getAttributeNS(null, "d")
            .split(/M |L /g)
            .map(item => {
              return {
                x: parseFloat(item.split(",")[0]),
                y: parseFloat(item.split(",")[1])
              };
            })
        };
      }
      if (resizeType === "line") {
        resizePoints = {
          x1: parseFloat(resizeEle.getAttributeNS(null, "x1")),
          y1: parseFloat(resizeEle.getAttributeNS(null, "y1")),
          x2: parseFloat(resizeEle.getAttributeNS(null, "x2")),
          y2: parseFloat(resizeEle.getAttributeNS(null, "y2"))
        };
      }
      if (resizeType === "rect") {
        resizePoints = {
          x: parseFloat(resizeEle.getAttributeNS(null, "x")),
          y: parseFloat(resizeEle.getAttributeNS(null, "y")),
          width: parseFloat(resizeEle.getAttributeNS(null, "width")),
          height: parseFloat(resizeEle.getAttributeNS(null, "height"))
        };
      }
      if (resizeType === "circle" || resizeType === "ellipse") {
        resizePoints = {
          cx: parseFloat(resizeEle.getAttributeNS(null, "cx")),
          cy: parseFloat(resizeEle.getAttributeNS(null, "cy")),
          rx: parseFloat(
            resizeEle.getAttributeNS(null, resizeType === "circle" ? "r" : "rx")
          ),
          ry: parseFloat(
            resizeEle.getAttributeNS(null, resizeType === "circle" ? "r" : "ry")
          )
        };
      }
      if (resizeType === "polygon") {
        resizePoints = {
          x: boxSizeList[resizeIndex].x,
          y: boxSizeList[resizeIndex].y,
          width: boxSizeList[resizeIndex].width,
          height: boxSizeList[resizeIndex].height,
          points: resizeEle
            .getAttributeNS(null, "points")
            .split(", ")
            .map(item => {
              return {
                x: parseFloat(item.split(" ")[0]),
                y: parseFloat(item.split(" ")[1])
              };
            })
        };
      }
      return;
    } else if (svg.querySelector("#selects")) {
      svg.querySelector("#selects").remove();
    }

    redoList = [];
    if (config.type === "pen") {
      svgCurrEle = document.createElementNS(svgns, "path");
      svgCurrEle.setAttributeNS(null, "d", `M ${x},${y}`);
    }
    if (config.type === "line") {
      svgCurrEle = document.createElementNS(svgns, "line");
      svgCurrEle.setAttributeNS(null, "x1", x);
      svgCurrEle.setAttributeNS(null, "y1", y);
      svgCurrEle.setAttributeNS(null, "x2", x);
      svgCurrEle.setAttributeNS(null, "y2", y);
      tempPoint = { x, y };
    }
    if (config.type === "rect" || config.type === "round-rect") {
      svgCurrEle = document.createElementNS(svgns, "rect");
      svgCurrEle.setAttributeNS(null, "x", x);
      svgCurrEle.setAttributeNS(null, "y", y);
      tempPoint = { x, y };
    }
    if (config.type === "circle") {
      svgCurrEle = document.createElementNS(svgns, "circle");
      svgCurrEle.setAttributeNS(null, "cx", x);
      svgCurrEle.setAttributeNS(null, "cy", y);
      tempPoint = { x, y };
    }
    if (config.type === "ellipse") {
      svgCurrEle = document.createElementNS(svgns, "ellipse");
      svgCurrEle.setAttributeNS(null, "cx", x);
      svgCurrEle.setAttributeNS(null, "cy", y);
      tempPoint = { x, y };
    }
    if (config.type === "polygon") {
      if (tempPoint === null) {
        svgCurrEle = document.createElementNS(svgns, "polygon");
        svgCurrEle.setAttributeNS(null, "points", `${x} ${y}`);
        tempPoint = `${x} ${y}, `;
      } else {
        tempPoint += `${x} ${y}, `;
      }
    }
    if (config.type === "diamond") {
      svgCurrEle = document.createElementNS(svgns, "polygon");
      svgCurrEle.setAttributeNS(null, "points", `${x} ${y}`);
      tempPoint = { x, y };
    }
    if (config.type === "eraser") {
      eraserPath = `M ${x} ${y}`;
    } else if (config.type === "text") {
      drawMoveOpen = false;
      svgCurrEle = document.createElementNS(svgns, "text");
      svgCurrEle.setAttributeNS(null, "font-family", config.fontFamily);
      svgCurrEle.setAttributeNS(null, "font-size", config.fontSize);
      svgCurrEle.setAttributeNS(null, "fill", config.color);
      svgCurrEle.setAttributeNS(null, "x", x);
      svgCurrEle.setAttributeNS(null, "y", y);
      let input = document.createElement("input");
      input.style.fontFamily = config.fontFamily;
      input.style.fontSize = config.fontSize + "px";
      input.style.color = config.color;
      input.type = "text";
      input.style.position = "fixed";
      input.style.top = e.clientY - config.fontSize + "px";
      input.style.left = e.clientX + "px";
      document.body.append(input);
      setTimeout(() => input.focus(), 0);
      input.addEventListener("blur", e => {
        input.remove();
      });
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          svgCurrEle.textContent = input.value;
          svg.append(svgCurrEle);
          input.remove();
        }
      });
    } else if (config.type === "select") {
      svgCurrEle = document.createElementNS(svgns, "rect");
      svgCurrEle.setAttributeNS(null, "x", x);
      svgCurrEle.setAttributeNS(null, "y", y);
      svgCurrEle.setAttributeNS(null, "fill", "rgba(240, 240,240, 0.4)");
      svgCurrEle.setAttributeNS(null, "stroke", "#BBB");
      svgCurrEle.setAttributeNS(null, "stroke-width", 1);
      svg.append(svgCurrEle);
      tempPoint = { x, y };
      selectHasMove = false;
    } else {
      if (config.type !== "pen" && config.type !== "line") {
        svgCurrEle.setAttributeNS(null, "fill", config.fillColor);
      } else {
        svgCurrEle.setAttributeNS(null, "fill", "none");
      }
      svgCurrEle.setAttributeNS(null, "stroke", config.color);
      svgCurrEle.setAttributeNS(null, "stroke-width", config.lineWidth);
      svg.append(svgCurrEle);
    }
  };

  var drawMove = e => {
    if (!drawMoveOpen) {
      return;
    }
    let { x, y } = getPoint(e.clientX, e.clientY);
    if (resizeOpen) {
      let selectBox = resizeBtn.parentElement;
      switch (resizeBtn.getAttributeNS(null, "data-resize")) {
        case "mv":
          if (resizeType === "line") {
            resizeEle.setAttributeNS(
              null,
              "x1",
              resizePoints.x1 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "x2",
              resizePoints.x2 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y1",
              resizePoints.y1 + y - tempPoint.y
            );
            resizeEle.setAttributeNS(
              null,
              "y2",
              resizePoints.y2 + y - tempPoint.y
            );
          }
          if (resizeType === "rect") {
            resizeEle.setAttributeNS(
              null,
              "x",
              resizePoints.x + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y",
              resizePoints.y + y - tempPoint.y
            );
          }
          if (resizeType === "circle" || resizeType === "ellipse") {
            resizeEle.setAttributeNS(
              null,
              "cx",
              resizePoints.cx + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "cy",
              resizePoints.cy + y - tempPoint.y
            );
          }
          if (resizeType === "polygon") {
            let points = resizePoints.points
              .map(
                item =>
                  `${item.x + x - tempPoint.x} ${item.y + y - tempPoint.y}`
              )
              .join(", ");
            resizeEle.setAttributeNS(null, "points", points);
          }
          if (resizeType === "path") {
            let points = resizePoints.points
              .map(item => {
                if (isNaN(item.x) || isNaN(item.y)) {
                  return "";
                } else {
                  return `${item.x + x - tempPoint.x},${item.y +
                    y -
                    tempPoint.y}`;
                }
              })
              .join(" L ");
            resizeEle.setAttributeNS(null, "d", `M${points.substring(2)}`);
          }
          break;
        case "tl":
          if (resizeType === "line") {
            resizeEle.setAttributeNS(
              null,
              "x1",
              resizePoints.x1 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y1",
              resizePoints.y1 + y - tempPoint.y
            );
          }
          if (resizeType === "rect") {
            resizeEle.setAttributeNS(
              null,
              "x",
              resizePoints.x + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y",
              resizePoints.y + y - tempPoint.y
            );
            resizeEle.setAttributeNS(
              null,
              "width",
              resizePoints.width - x + tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "height",
              resizePoints.height - y + tempPoint.y
            );
          }
          if (resizeType === "circle") {
            let len = Math.min((x - tempPoint.x) / 2, (y - tempPoint.y) / 2);
            resizeEle.setAttributeNS(null, "cx", resizePoints.cx + len);
            resizeEle.setAttributeNS(null, "cy", resizePoints.cy + len);
            resizeEle.setAttributeNS(null, "r", resizePoints.rx - len);
          }
          if (resizeType === "ellipse") {
            resizeEle.setAttributeNS(
              null,
              "cx",
              resizePoints.cx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "cy",
              resizePoints.cy + (y - tempPoint.y) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "rx",
              resizePoints.rx - (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "ry",
              resizePoints.ry - (y - tempPoint.y) / 2
            );
          }
          if (resizeType === "polygon") {
            let s = {
              x: 1 - (x - tempPoint.x) / resizePoints.width,
              y: 1 - (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(
                item =>
                  `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x +
                    x -
                    tempPoint.x} ${(item.y - resizePoints.y) * s.y +
                    resizePoints.y +
                    y -
                    tempPoint.y}`
              )
              .join(", ");
            resizeEle.setAttributeNS(null, "points", points);
          }
          if (resizeType === "path") {
            let s = {
              x: 1 - (x - tempPoint.x) / resizePoints.width,
              y: 1 - (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(item => {
                if (isNaN(item.x) || isNaN(item.y)) {
                  return "";
                } else {
                  return `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x +
                    x -
                    tempPoint.x},${(item.y - resizePoints.y) * s.y +
                    resizePoints.y +
                    y -
                    tempPoint.y}`;
                }
              })
              .join(" L ");
            resizeEle.setAttributeNS(null, "d", `M${points.substring(2)}`);
          }
          break;
        case "bl":
          if (resizeType === "line") {
            resizeEle.setAttributeNS(
              null,
              "x1",
              resizePoints.x1 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y2",
              resizePoints.y2 + y - tempPoint.y
            );
          }
          if (resizeType === "rect") {
            resizeEle.setAttributeNS(
              null,
              "x",
              resizePoints.x + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "width",
              resizePoints.width - x + tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "height",
              resizePoints.height + y - tempPoint.y
            );
          }
          if (resizeType === "circle") {
            let len = Math.min((x - tempPoint.x) / 2, -(y - tempPoint.y) / 2);
            resizeEle.setAttributeNS(null, "cx", resizePoints.cx + len);
            resizeEle.setAttributeNS(null, "cy", resizePoints.cy - len);
            resizeEle.setAttributeNS(null, "r", resizePoints.rx - len);
          }
          if (resizeType === "ellipse") {
            resizeEle.setAttributeNS(
              null,
              "cx",
              resizePoints.cx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "cy",
              resizePoints.cy + (y - tempPoint.y) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "rx",
              resizePoints.rx - (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "ry",
              resizePoints.ry + (y - tempPoint.y) / 2
            );
          }
          if (resizeType === "polygon") {
            let s = {
              x: 1 - (x - tempPoint.x) / resizePoints.width,
              y: 1 + (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(
                item =>
                  `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x +
                    x -
                    tempPoint.x} ${(item.y - resizePoints.y) * s.y +
                    resizePoints.y}`
              )
              .join(", ");
            resizeEle.setAttributeNS(null, "points", points);
          }
          if (resizeType === "path") {
            let s = {
              x: 1 - (x - tempPoint.x) / resizePoints.width,
              y: 1 + (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(item => {
                if (isNaN(item.x) || isNaN(item.y)) {
                  return "";
                } else {
                  return `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x +
                    x -
                    tempPoint.x},${(item.y - resizePoints.y) * s.y +
                    resizePoints.y}`;
                }
              })
              .join(" L ");
            resizeEle.setAttributeNS(null, "d", `M${points.substring(2)}`);
          }
          break;
        case "tr":
          if (resizeType === "line") {
            resizeEle.setAttributeNS(
              null,
              "x2",
              resizePoints.x2 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y1",
              resizePoints.y1 + y - tempPoint.y
            );
          }
          if (resizeType === "rect") {
            resizeEle.setAttributeNS(
              null,
              "y",
              resizePoints.y + y - tempPoint.y
            );
            resizeEle.setAttributeNS(
              null,
              "width",
              resizePoints.width + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "height",
              resizePoints.height - y + tempPoint.y
            );
          }
          if (resizeType === "circle") {
            let len = Math.min((x - tempPoint.x) / 2, -(y - tempPoint.y) / 2);
            resizeEle.setAttributeNS(null, "cx", resizePoints.cx + len);
            resizeEle.setAttributeNS(null, "cy", resizePoints.cy - len);
            resizeEle.setAttributeNS(null, "r", resizePoints.rx + len);
          }
          if (resizeType === "ellipse") {
            resizeEle.setAttributeNS(
              null,
              "cx",
              resizePoints.cx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "cy",
              resizePoints.cy + (y - tempPoint.y) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "rx",
              resizePoints.rx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "ry",
              resizePoints.ry - (y - tempPoint.y) / 2
            );
          }
          if (resizeType === "polygon") {
            let s = {
              x: 1 + (x - tempPoint.x) / resizePoints.width,
              y: 1 - (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(
                item =>
                  `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x} ${(item.y - resizePoints.y) * s.y +
                    resizePoints.y +
                    y -
                    tempPoint.y}`
              )
              .join(", ");
            resizeEle.setAttributeNS(null, "points", points);
          }
          if (resizeType === "path") {
            let s = {
              x: 1 + (x - tempPoint.x) / resizePoints.width,
              y: 1 - (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(item => {
                if (isNaN(item.x) || isNaN(item.y)) {
                  return "";
                } else {
                  return `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x},${(item.y - resizePoints.y) * s.y +
                    resizePoints.y +
                    y -
                    tempPoint.y}`;
                }
              })
              .join(" L ");
            resizeEle.setAttributeNS(null, "d", `M${points.substring(2)}`);
          }
          break;
        case "br":
          if (resizeType === "line") {
            resizeEle.setAttributeNS(
              null,
              "x2",
              resizePoints.x2 + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "y2",
              resizePoints.y2 + y - tempPoint.y
            );
          }
          if (resizeType === "rect") {
            resizeEle.setAttributeNS(
              null,
              "width",
              resizePoints.width + x - tempPoint.x
            );
            resizeEle.setAttributeNS(
              null,
              "height",
              resizePoints.height + y - tempPoint.y
            );
          }
          if (resizeType === "circle") {
            let len = Math.min((x - tempPoint.x) / 2, (y - tempPoint.y) / 2);
            resizeEle.setAttributeNS(null, "cx", resizePoints.cx + len);
            resizeEle.setAttributeNS(null, "cy", resizePoints.cy + len);
            resizeEle.setAttributeNS(null, "r", resizePoints.rx + len);
          }
          if (resizeType === "ellipse") {
            resizeEle.setAttributeNS(
              null,
              "cx",
              resizePoints.cx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "cy",
              resizePoints.cy + (y - tempPoint.y) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "rx",
              resizePoints.rx + (x - tempPoint.x) / 2
            );
            resizeEle.setAttributeNS(
              null,
              "ry",
              resizePoints.ry + (y - tempPoint.y) / 2
            );
          }
          if (resizeType === "polygon") {
            let s = {
              x: 1 + (x - tempPoint.x) / resizePoints.width,
              y: 1 + (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(
                item =>
                  `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x} ${(item.y - resizePoints.y) * s.y +
                    resizePoints.y}`
              )
              .join(", ");
            resizeEle.setAttributeNS(null, "points", points);
          }
          if (resizeType === "path") {
            let s = {
              x: 1 + (x - tempPoint.x) / resizePoints.width,
              y: 1 + (y - tempPoint.y) / resizePoints.height
            };
            let points = resizePoints.points
              .map(item => {
                if (isNaN(item.x) || isNaN(item.y)) {
                  return "";
                } else {
                  return `${(item.x - resizePoints.x) * s.x +
                    resizePoints.x},${(item.y - resizePoints.y) * s.y +
                    resizePoints.y}`;
                }
              })
              .join(" L ");
            resizeEle.setAttributeNS(null, "d", `M${points.substring(2)}`);
          }
          break;
      }
      let boxSize = resizeEle.getBBox();
      boxSizeList[resizeIndex] = boxSize;
      selectBox.children[0].setAttributeNS(null, "x", boxSize.x - 5);
      selectBox.children[0].setAttributeNS(null, "y", boxSize.y - 5);
      selectBox.children[0].setAttributeNS(null, "width", boxSize.width + 10);
      selectBox.children[0].setAttributeNS(null, "height", boxSize.height + 10);
      selectBox.children[1].setAttributeNS(null, "x", boxSize.x - 8);
      selectBox.children[1].setAttributeNS(null, "y", boxSize.y - 8);
      selectBox.children[2].setAttributeNS(
        null,
        "x",
        boxSize.x + boxSize.width
      );
      selectBox.children[2].setAttributeNS(null, "y", boxSize.y - 8);
      selectBox.children[3].setAttributeNS(
        null,
        "x",
        boxSize.x + boxSize.width
      );
      selectBox.children[3].setAttributeNS(
        null,
        "y",
        boxSize.y + boxSize.height
      );
      selectBox.children[4].setAttributeNS(null, "x", boxSize.x - 8);
      selectBox.children[4].setAttributeNS(
        null,
        "y",
        boxSize.y + boxSize.height
      );
      return;
    }
    if (config.type === "pen") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        `${svgCurrEle.getAttributeNS(null, "d")} L ${x},${y}`
      );
    }
    if (config.type === "eraser") {
      eraserPath += `L ${x} ${y}`;
      let index = undoList.findIndex(
        item => intersect(eraserPath, item.getAttributeNS(null, "d")).length > 0
      );
      if (index !== -1) {
        undoList[index].remove();
        undoList.splice(index, 1);
        boxSizeList.splice(index, 1);
      }
    }
    if (config.type === "line") {
      svgCurrEle.setAttributeNS(null, "x2", x);
      svgCurrEle.setAttributeNS(null, "y2", y);
    }
    if (config.type === "rect" || config.type === "round-rect") {
      if (x - tempPoint.x < 0) {
        svgCurrEle.setAttributeNS(null, "x", x);
        svgCurrEle.setAttributeNS(null, "y", y);
      }
      svgCurrEle.setAttributeNS(null, "width", Math.abs(x - tempPoint.x));
      svgCurrEle.setAttributeNS(null, "height", Math.abs(y - tempPoint.y));
      if (config.type === "round-rect") {
        svgCurrEle.setAttributeNS(null, "rx", 10);
        svgCurrEle.setAttributeNS(null, "ry", 10);
      }
    }
    if (config.type === "circle") {
      svgCurrEle.setAttributeNS(
        null,
        "r",
        Math.sqrt(Math.pow(x - tempPoint.x, 2) + Math.pow(y - tempPoint.y, 2))
      );
    }
    if (config.type === "ellipse") {
      svgCurrEle.setAttributeNS(null, "rx", Math.abs(x - tempPoint.x));
      svgCurrEle.setAttributeNS(null, "ry", Math.abs(y - tempPoint.y));
    }
    if (config.type === "polygon") {
      svgCurrEle.setAttributeNS(null, "points", tempPoint + `${x} ${y}`);
    }
    if (config.type === "diamond") {
      let x2 = (x + tempPoint.x) / 2;
      let y2 = (y + tempPoint.y) / 2;
      svgCurrEle.setAttributeNS(
        null,
        "points",
        `${x} ${y2}, ${x2} ${y}, ${tempPoint.x} ${y2}, ${x2} ${tempPoint.y}`
      );
    }
    if (config.type === "select") {
      if (x - tempPoint.x < 0) {
        svgCurrEle.setAttributeNS(null, "x", x);
        svgCurrEle.setAttributeNS(null, "y", y);
      }
      svgCurrEle.setAttributeNS(null, "width", Math.abs(x - tempPoint.x));
      svgCurrEle.setAttributeNS(null, "height", Math.abs(y - tempPoint.y));
      selectHasMove = true;
    }
  };

  var drawUp = e => {
    let { x, y } = getPoint(e.clientX, e.clientY);
    drawMoveOpen = false;
    if (config.type === "eraser") {
      return;
    }
    if (resizeOpen) {
      resizeOpen = false;
      return;
    }
    if (config.type === "line") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        `M ${svgCurrEle.getAttributeNS(null, "x1")} ${svgCurrEle.getAttributeNS(
          null,
          "y1"
        )} L ${svgCurrEle.getAttributeNS(
          null,
          "x2"
        )} ${svgCurrEle.getAttributeNS(null, "y2")}`
      );
    }
    if (config.type === "rect" || config.type === "round-rect") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        rect2path(
          svgCurrEle.getAttributeNS(null, "x"),
          svgCurrEle.getAttributeNS(null, "y"),
          svgCurrEle.getAttributeNS(null, "width"),
          svgCurrEle.getAttributeNS(null, "height"),
          svgCurrEle.getAttributeNS(null, "rx"),
          svgCurrEle.getAttributeNS(null, "ry")
        )
      );
    }
    if (config.type === "circle") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        ellipse2path(
          svgCurrEle.getAttributeNS(null, "cx"),
          svgCurrEle.getAttributeNS(null, "cy"),
          svgCurrEle.getAttributeNS(null, "r"),
          svgCurrEle.getAttributeNS(null, "r")
        )
      );
    }
    if (config.type === "ellipse") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        ellipse2path(
          svgCurrEle.getAttributeNS(null, "cx"),
          svgCurrEle.getAttributeNS(null, "cy"),
          svgCurrEle.getAttributeNS(null, "rx"),
          svgCurrEle.getAttributeNS(null, "ry")
        )
      );
    }
    if (config.type === "polygon") {
      drawMoveOpen = true;
      return;
    }
    if (config.type === "diamond") {
      svgCurrEle.setAttributeNS(
        null,
        "d",
        polygon2path(svgCurrEle.getAttributeNS(null, "points"))
      );
    }
    if (config.type === "select") {
      if (!selectHasMove) {
        svg.querySelector("#selects").remove();
        return;
      }
      svgCurrEle.remove();
      let selects = document.createElementNS(svgns, "g");
      selects.id = "selects";
      svg.append(selects);
      for (let i = 0; i < boxSizeList.length; i++) {
        if (
          boxSizeList[i].x >= tempPoint.x &&
          boxSizeList[i].y >= tempPoint.y &&
          boxSizeList[i].x + boxSizeList[i].width <= x &&
          boxSizeList[i].y + boxSizeList[i].height <= y
        ) {
          let selectBoxC = document.createElementNS(svgns, "g");
          selectBoxC.setAttributeNS(null, "data-index", i);
          selects.append(selectBoxC);
          let selectBox = document.createElementNS(svgns, "rect");
          selectBox.setAttributeNS(null, "x", boxSizeList[i].x - 5);
          selectBox.setAttributeNS(null, "y", boxSizeList[i].y - 5);
          selectBox.setAttributeNS(null, "width", boxSizeList[i].width + 10);
          selectBox.setAttributeNS(null, "height", boxSizeList[i].height + 10);
          selectBox.setAttributeNS(null, "fill", "transparent");
          selectBox.setAttributeNS(null, "stroke", "#888");
          selectBox.setAttributeNS(null, "stroke-width", 1);
          selectBox.setAttributeNS(null, "stroke-dasharray", "3 3");
          selectBox.setAttributeNS(null, "data-resize", "mv");
          selectBox.style.cursor = "move";
          selectBoxC.append(selectBox);
          let addSelectBoxBtn = (x, y, type) => {
            let selectBoxBtn = document.createElementNS(
              svgns,
              type === "ro" ? "circle" : "rect"
            );
            if (type === "ro") {
              selectBoxBtn.setAttributeNS(null, "cx", x);
              selectBoxBtn.setAttributeNS(null, "cy", y);
              selectBoxBtn.setAttributeNS(null, "r", 4);
            } else {
              selectBoxBtn.setAttributeNS(null, "x", x);
              selectBoxBtn.setAttributeNS(null, "y", y);
              selectBoxBtn.setAttributeNS(null, "width", 8);
              selectBoxBtn.setAttributeNS(null, "height", 8);
            }
            selectBoxBtn.setAttributeNS(null, "fill", "#FFF");
            selectBoxBtn.setAttributeNS(null, "stroke", "#888");
            selectBoxBtn.setAttributeNS(null, "stroke-width", 1);
            selectBoxBtn.setAttributeNS(null, "data-resize", type);
            selectBoxBtn.style.cursor =
              type === "ro"
                ? "alias"
                : type === "tl" || type === "br"
                ? "nwse-resize"
                : "nesw-resize";
            selectBoxC.append(selectBoxBtn);
          };
          addSelectBoxBtn(boxSizeList[i].x - 8, boxSizeList[i].y - 8, "tl");
          addSelectBoxBtn(
            boxSizeList[i].x + boxSizeList[i].width,
            boxSizeList[i].y - 8,
            "tr"
          );
          addSelectBoxBtn(
            boxSizeList[i].x + boxSizeList[i].width,
            boxSizeList[i].y + boxSizeList[i].height,
            "br"
          );
          addSelectBoxBtn(
            boxSizeList[i].x - 8,
            boxSizeList[i].y + boxSizeList[i].height,
            "bl"
          );
        }
      }
    } else {
      undoList.push(svgCurrEle);
      boxSizeList.push(svgCurrEle.getBBox());
    }
  };

  svg.addEventListener("pointerdown", drawDown);
  svg.addEventListener("pointermove", drawMove);
  svg.addEventListener("pointerup", drawUp);

  var stopPolygon = () => {
    tempPoint = null;
    drawMoveOpen = false;
    svgCurrEle.setAttributeNS(
      null,
      "d",
      polygon2path(svgCurrEle.getAttributeNS(null, "points"))
    );
    undoList.push(svgCurrEle);
    boxSizeList.push(svgCurrEle.getBBox());
  };

  window.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      stopPolygon();
    }
    if (e.key === "Control") {
      drawLimited = true;
    }
    if (e.key === "Delete" && svg.querySelector("#selects")) {
      redoList = [];
      for (const item of svg.querySelector("#selects").children) {
        let index = item.getAttributeNS(null, "data-index");
        undoList[index].remove();
        redoList.push(undoList[index]);
        undoList.slice(index, 1);
        boxSizeList.splice(index, 1);
      }
      svg.querySelector("#selects").remove();
    }
  });

  window.addEventListener("keyup", e => {
    if (e.key === "Control") {
      drawLimited = false;
    }
  });

  document.querySelectorAll(".svg-pen .svg-btn").forEach(item => {
    item.addEventListener("click", e => {
      if (document.querySelector(".svg-button .active")) {
        document
          .querySelector(".svg-button .active")
          .classList.remove("active");
      }
      item.classList.add("active");
      config.type = item.getAttribute("data-type");
    });
  });

  document.querySelector("#select-color").addEventListener("change", e => {
    config.color =
      e.target.value === "custom"
        ? document.querySelector("#custom-color").value
        : e.target.value;
  });

  document.querySelector("#custom-color").addEventListener("change", e => {
    if (document.querySelector("#select-color").value === "custom") {
      config.color = e.target.value;
    }
  });

  document.querySelector("#select-size").addEventListener("change", e => {
    switch (e.target.value) {
      case "custom":
        config.lineWidth = document.querySelector("#custom-size").value;
        break;
      case "small":
        config.lineWidth = 2;
        break;
      case "middle":
        config.lineWidth = 4;
        break;
      case "big":
        config.lineWidth = 6;
        break;
    }
  });

  document.querySelector("#custom-size").addEventListener("change", e => {
    if (document.querySelector("#select-size").value === "custom") {
      config.lineWidth = e.target.value;
    }
  });

  document.querySelector("#select-fill-color").addEventListener("change", e => {
    config.fillColor =
      e.target.value === "custom"
        ? document.querySelector("#custom-fill-color").value
        : e.target.value;
  });

  document.querySelector("#custom-fill-color").addEventListener("change", e => {
    if (document.querySelector("#select-fill-color").value === "custom") {
      config.fillColor = e.target.value;
    }
  });

  document.querySelector("#text-size").addEventListener("change", e => {
    config.fontSize = e.target.value;
  });

  document.querySelectorAll(".svg-shape .svg-btn").forEach(item => {
    item.addEventListener("click", e => {
      if (document.querySelector(".svg-button .active")) {
        document
          .querySelector(".svg-button .active")
          .classList.remove("active");
      }
      item.classList.add("active");
      config.type = item.getAttribute("data-type");
    });
  });

  document.querySelector("#svg-undo").addEventListener("click", e => {
    if (undoList.length < 1) {
      return;
    }
    let undoEle = undoList.pop();
    undoEle.remove();
    redoList.push(undoEle);
    redoBoxSizeList.push(boxSizeList.pop());
  });

  document.querySelector("#svg-redo").addEventListener("click", e => {
    if (redoList.length < 1) {
      return;
    }
    let redoEle = redoList.pop();
    svg.append(redoEle);
    undoList.push(redoEle);
    boxSizeList.push(redoBoxSizeList.pop());
  });

  document.querySelector("#svg-clean").addEventListener("click", e => {
    undoList = [];
    redoList = [];
    svg.innerHTML = "";
  });
}
