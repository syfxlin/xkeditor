window.paints = [];

export function initPaint(
  canvasId,
  initBtn = false,
  autoScale = true,
  scale = { x: 1, y: 1 }
) {
  if (paints[canvasId]) {
    return;
  } else {
    paints.push(canvasId);
  }
  var canvasEle = document.getElementById(canvasId);
  var canvasContext = canvasEle.getContext("2d");
  var canvasMoveOpen = false;
  var auxEle = document.getElementById("auxiliary-ele");
  var point = {
    s: [],
    e: []
  };
  var firstPoint = null;
  var lastPoint = null;

  var prevCanvas = [];
  var nextCanvas = [];
  var inputStatus = "mid";
  // 存入初始状态，即空白状态，或者有图像的状态
  prevCanvas.push(
    canvasContext.getImageData(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    )
  );

  var type = "pen";
  var config = {
    lineColor: "#5ab639",
    lineWidth: 0.5,
    shadowBlur: 0.7,
    eraserSize: 15,
    fontSize: 14,
    fontFamily: "Arial"
  };
  //初始化绘制比例
  if (autoScale) {
    scale.x = canvasEle.width / canvasEle.clientWidth;
    scale.y = canvasEle.height / canvasEle.clientHeight;
  }
  /**
   * 形状：
   * 线 ok
   * 矩形 ok
   * 圆 ok
   * 圆角矩形 ok
   * 菱形 ok
   * 直线 ok
   * 不规则边形（可折线段） ok
   *
   * 功能：
   * 画笔颜色 ok
   * 画笔大小 ok
   * 撤销前进 ok
   * 清空 ok
   * 保存 ok
   * 橡皮擦 ok
   * 背景 ok
   * 插入文字 ok
   */

  function drawEraser(loc) {
    canvasContext.save();
    canvasContext.beginPath();
    canvasContext.arc(
      loc.x * scale.x,
      loc.y * scale.y,
      config.eraserSize * scale.x,
      0,
      Math.PI * 2,
      false
    );
    canvasContext.clip();
    canvasContext.clearRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
    canvasContext.restore();
  }

  // 停止绘制不规则边形
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      if (type === "polyline") {
        firstPoint = null;
        lastPoint = null;
      }
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.getElementById("canvas-text")) {
      operateCanvasText();
    }
  });

  function operateCanvasText() {
    let text = document.getElementById("canvas-text").value;
    auxEle.innerHTML = "";
    auxEle.style.display = "none";
    auxEle.style.pointerEvents = "none";
    canvasContext.font = config.fontSize + "px " + config.fontFamily;
    canvasContext.fillText(
      text,
      point.s.x * scale.x + 3,
      point.s.y * scale.y + config.fontSize
    );
    let prevData = canvasContext.getImageData(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
    prevCanvas.push(prevData);
    inputStatus = "mid";
  }

  function canvasDown(e) {
    if (e.buttons === 32) {
      type = "eraser";
    }
    if (e.pointerType === "pen" && type === "eraser" && e.buttons === 1) {
      type = "pen";
    }
    let clientX = 0;
    let clientY = 0;
    clientX = e.clientX;
    clientY = e.clientY;
    let offsetCanvas = canvasEle.getBoundingClientRect();
    clientX -= offsetCanvas.left;
    clientY -= offsetCanvas.top;
    // 记录开始的坐标
    point.s.x = clientX;
    point.s.y = clientY;
    // 若不是 pen 状态就显示辅助线
    if (type !== "pen") {
      auxEle.style.left = clientX + "px";
      auxEle.style.top = clientY + "px";
      auxEle.style.width = "0px";
      auxEle.style.height = "0px";
      auxEle.style.display = "block";
    }
    // 橡皮擦
    if (type === "eraser") {
      drawEraser(point.s);
      auxEle.style.width = config.eraserSize * 2 + "px";
      auxEle.style.height = config.eraserSize * 2 + "px";
      auxEle.style.borderRadius = "50%";
      auxEle.style.transform =
        "translate(-" + config.eraserSize + "px, -" + config.eraserSize + "px)";
    }
    if (type === "text") {
      auxEle.innerHTML = '<input type="text" id="canvas-text" autofocus>';
      auxEle.style.pointerEvents = "auto";
    }
    // 为不同的输入状态调整辅助线
    if (type === "round-rect") {
      auxEle.style.borderRadius = "10px";
    }
    if (type === "ellipse") {
      auxEle.style.borderRadius = "50%";
    }
    // 激活移动事件
    if (type !== "text") {
      canvasMoveOpen = true;
    }
    // 初始化
    canvasContext.beginPath();
    // 设置样式
    canvasContext.strokeStyle = config.lineColor;
    if (type === "pen") {
      canvasContext.lineWidth = config.lineWidth;
    } else {
      canvasContext.lineWidth = config.lineWidth + config.shadowBlur * 2;
    }
    canvasContext.shadowBlur = config.shadowBlur;
    canvasContext.shadowColor = config.lineColor;
  }

  function canvasMove(e) {
    // 若未激活就直接return
    if (e.buttons === 0) return;
    if (!canvasMoveOpen) return;
    // 获取当前坐标
    let t = e.target;
    let clientX = 0;
    let clientY = 0;
    clientX = e.clientX;
    clientY = e.clientY;
    let offsetCanvas = canvasEle.getBoundingClientRect();
    clientX -= offsetCanvas.left;
    clientY -= offsetCanvas.top;
    let canvasX = clientX;
    let canvasY = clientY;
    let width = canvasX - point.s.x;
    let height = canvasY - point.s.y;
    // 由于用户有可能从右下向左上绘制，需要将其转化为正数，否则辅助线会显示错误
    if (canvasX - point.s.x < 0 || canvasY - point.s.y < 0) {
      width = -width;
      height = -height;
      auxEle.style.left = clientX + "px";
      auxEle.style.top = clientY + "px";
    }
    // 各种状态的绘制
    if (type === "pen") {
      // 通过压力重置线宽
      canvasContext.lineWidth = config.lineWidth * e.pressure * 2;
      canvasContext.lineTo(canvasX * scale.x, canvasY * scale.y);
      canvasContext.stroke();
    }
    // 橡皮擦
    if (type === "eraser") {
      drawEraser({ x: canvasX, y: canvasY });
      auxEle.style.left = clientX + "px";
      auxEle.style.top = clientY + "px";
    }
    if (type === "line") {
      let length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      let angle = (Math.atan(height / width) / Math.PI) * 180;
      // 修复向右上角滑动显示不正确的情况
      if (canvasX - point.s.x >= 0 && canvasY - point.s.y <= 0) {
        angle = (Math.acos(width / length) / Math.PI) * 180;
      }
      auxEle.style.width = length + "px";
      auxEle.style.height = "0px";
      auxEle.style.transform = "rotate(" + angle + "deg)";
      auxEle.style.transformOrigin = "top left";
    }
    if (type !== "pen" && type !== "line" && type !== "eraser") {
      auxEle.style.width = width + "px";
      auxEle.style.height = height + "px";
    }
  }

  function canvasUp(e) {
    let clientX = 0;
    let clientY = 0;
    // 关闭移动事件
    canvasMoveOpen = false;
    clientX = e.clientX;
    clientY = e.clientY;
    let offsetCanvas = canvasEle.getBoundingClientRect();
    clientX -= offsetCanvas.left;
    clientY -= offsetCanvas.top;
    // 获取结束的坐标
    point.e.x = clientX;
    point.e.y = clientY;
    // 由于用户有可能从右下向左上绘制，需要将其转化为正数，否则辅助线会显示错误
    if (point.e.x - point.s.x < 0 || point.e.y - point.s.y < 0) {
      let temp = point.s;
      point.s = point.e;
      point.e = temp;
    }
    // 各种状态的绘制
    if (type === "line") {
      canvasContext.moveTo(point.s.x * scale.x, point.s.y * scale.y);
      canvasContext.lineTo(point.e.x * scale.x, point.e.y * scale.y);
      auxEle.style.transform = "none";
    }
    if (type === "polyline") {
      if (lastPoint === null) {
        canvasContext.moveTo(point.s.x * scale.x, point.s.y * scale.y);
        canvasContext.lineTo(point.e.x * scale.x, point.e.y * scale.y);
        firstPoint = [point.s.x, point.s.y];
        lastPoint = [point.e.x, point.e.y];
      } else {
        canvasContext.moveTo(lastPoint[0] * scale.x, lastPoint[1] * scale.y);
        canvasContext.lineTo(point.e.x * scale.x, point.e.y * scale.y);
        lastPoint = [point.e.x, point.e.y];
        if (
          Math.abs(lastPoint[0] - firstPoint[0]) < 5 &&
          Math.abs(lastPoint[1] - firstPoint[1]) < 5
        ) {
          canvasContext.lineTo(
            firstPoint[0] * scale.x,
            firstPoint[1] * scale.y
          );
          firstPoint = null;
          lastPoint = null;
        }
      }
    }
    if (type === "rect") {
      canvasContext.rect(
        point.s.x * scale.x,
        point.s.y * scale.y,
        (point.e.x - point.s.x) * scale.x,
        (point.e.y - point.s.y) * scale.y
      );
    }
    if (type === "round-rect") {
      // 上
      canvasContext.moveTo(point.s.x * scale.x + 10, point.s.y * scale.y);
      canvasContext.lineTo(point.e.x * scale.x - 10, point.s.y * scale.y);
      canvasContext.arc(
        point.e.x * scale.x - 10,
        point.s.y * scale.y + 10,
        10,
        (Math.PI / 2) * 3,
        Math.PI * 2
      );
      // 下
      canvasContext.moveTo(point.e.x * scale.x - 10, point.e.y * scale.y);
      canvasContext.lineTo(point.s.x * scale.x + 10, point.e.y * scale.y);
      canvasContext.arc(
        point.s.x * scale.x + 10,
        point.e.y * scale.y - 10,
        10,
        Math.PI / 2,
        Math.PI
      );
      // 左
      canvasContext.moveTo(point.s.x * scale.x, point.e.y * scale.y - 10);
      canvasContext.lineTo(point.s.x * scale.x, point.s.y * scale.y + 10);
      canvasContext.arc(
        point.s.x * scale.x + 10,
        point.s.y * scale.y + 10,
        10,
        Math.PI,
        (Math.PI / 2) * 3
      );
      // 右
      canvasContext.moveTo(point.e.x * scale.x, point.s.y * scale.y + 10);
      canvasContext.lineTo(point.e.x * scale.x, point.e.y * scale.y - 10);
      canvasContext.arc(
        point.e.x * scale.x - 10,
        point.e.y * scale.y - 10,
        10,
        0,
        Math.PI / 2
      );
    }
    if (type === "ellipse") {
      let radiusX = (point.e.x - point.s.x) / 2;
      let radiusY = (point.e.y - point.s.y) / 2;
      canvasContext.ellipse(
        (point.s.x + radiusX) * scale.x,
        (point.s.y + radiusY) * scale.y,
        radiusX * scale.x,
        radiusY * scale.y,
        0,
        0,
        2 * Math.PI
      );
      auxEle.style.borderRadius = "0";
    }
    if (type === "diamond") {
      canvasContext.moveTo(
        ((point.s.x + point.e.x) / 2) * scale.x,
        point.s.y * scale.y
      );
      canvasContext.lineTo(
        point.e.x * scale.x,
        ((point.s.y + point.e.y) / 2) * scale.y
      );
      canvasContext.lineTo(
        ((point.s.x + point.e.x) / 2) * scale.x,
        point.e.y * scale.y
      );
      canvasContext.lineTo(
        point.s.x * scale.x,
        ((point.s.y + point.e.y) / 2) * scale.y
      );
      canvasContext.lineTo(
        ((point.s.x + point.e.x) / 2) * scale.x,
        point.s.y * scale.y
      );
    }
    // 隐藏辅助线并开始绘制
    if (type !== "text") {
      auxEle.style.display = "none";
    }
    if (type !== "eraser") {
      canvasContext.stroke();
    }
    // 保存状态
    let prevData = canvasContext.getImageData(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
    prevCanvas.push(prevData);
    inputStatus = "mid";
  }

  function switchType(typeStr) {
    type = typeStr;
  }

  function setBackground(img) {
    canvasContext.drawImage(img, 0, 0);
  }

  window.setCanvasScale = function(auto = true, s = { x: 1, y: 1 }) {
    if (auto) {
      scale.x = canvasEle.width / canvasEle.clientWidth;
      scale.y = canvasEle.height / canvasEle.clientHeight;
    } else {
      scale = s;
    }
  };

  function toPrevCanvas() {
    if (prevCanvas.length == 0) {
      document.getElementsByClassName("fa-reply")[0].classList.remove("active");
      document.getElementsByClassName("fa-share")[0].classList.add("active");
      return;
    }
    if (inputStatus !== "prev") {
      nextCanvas.push(prevCanvas.pop());
    }
    let data = prevCanvas.pop();
    canvasContext.putImageData(data, 0, 0);
    nextCanvas.push(data);
    inputStatus = "prev";
  }

  function toNextCanvas() {
    if (nextCanvas.length == 0) {
      document.getElementsByClassName("fa-reply")[0].classList.add("active");
      document.getElementsByClassName("fa-share")[0].classList.remove("active");
      return;
    }
    if (inputStatus !== "next") {
      prevCanvas.push(nextCanvas.pop());
    }
    let data = nextCanvas.pop();
    canvasContext.putImageData(data, 0, 0);
    prevCanvas.push(data);
    inputStatus = "next";
  }

  function cleanCanvas() {
    inputStatus = "mid";
    nextCanvas = [];
    prevCanvas = [];
    canvasContext.clearRect(
      0,
      0,
      canvasContext.canvas.width,
      canvasContext.canvas.height
    );
    prevCanvas = [
      canvasContext.getImageData(
        0,
        0,
        canvasContext.canvas.width,
        canvasContext.canvas.height
      )
    ];
  }

  function getCanvasBlob() {
    let canvasBlob = null;
    canvasEle.toBlob(function(blob) {
      canvasBlob = blob;
    });
    return canvasBlob;
  }

  function getCanvasUrl() {
    return canvasEle.toDataURL();
  }

  canvasEle.addEventListener("pointerdown", canvasDown);
  canvasEle.addEventListener("pointermove", canvasMove);
  canvasEle.addEventListener("pointerup", canvasUp);

  // canvasEle.addEventListener('touchstart', canvasDown);
  // canvasEle.addEventListener('touchmove', canvasMove);
  // canvasEle.addEventListener('touchend', canvasUp);

  if (initBtn) {
    var canBtns = document.getElementsByClassName("can-btn");
    for (let i = 0; i < canBtns.length; i++) {
      const ele = canBtns[i];
      ele.addEventListener("click", function(e) {
        let target = null;
        let type = null;
        if (e.target.tagName === "SPAN") {
          target = e.target.parentElement;
        } else {
          target = e.target;
        }
        type = target.getAttribute("data-type");
        if (type === "color") {
          if (document.querySelector(".can-color .active")) {
            document
              .querySelector(".can-color .active")
              .classList.remove("active");
          }
          config.lineColor = window.getComputedStyle(target).backgroundColor;
          target.classList.add("active");
          return;
        }
        if (type === "size") {
          if (document.querySelector(".can-size .active")) {
            document
              .querySelector(".can-size .active")
              .classList.remove("active");
          }
          let size = target.classList[target.classList.length - 1];
          if (size === "big") {
            config.lineWidth = 3.5;
            config.shadowBlur = 5;
          } else if (size === "middle") {
            config.lineWidth = 2;
            config.shadowBlur = 3;
          } else {
            config.lineWidth = 0.5;
            config.shadowBlur = 0.7;
          }
          target.classList.add("active");
          return;
        }
        if (type === "to-prev-canvas") {
          toPrevCanvas();
          return;
        }
        if (type === "to-next-canvas") {
          toNextCanvas();
          return;
        }
        if (type === "clean-canvas") {
          cleanCanvas();
          return;
        }
        if (type === "save-canvas" || type === "cancel-canvas") {
          return;
        }
        if (document.querySelector(".can-pen .active")) {
          document.querySelector(".can-pen .active").classList.remove("active");
        }
        if (document.querySelector(".can-shape .active")) {
          document
            .querySelector(".can-shape .active")
            .classList.remove("active");
        }
        if (document.querySelector(".can-operate .active")) {
          document
            .querySelector(".can-operate .active")
            .classList.remove("active");
        }
        switchType(type);
        target.classList.add("active");
      });
    }
  }
}
