const consoleUtils = {
  formatArray: input => {
    var output = "";
    for (var i = 0, l = input.length; i < l; i++) {
      if (typeof input[i] === "string") {
        output += '"' + input[i] + '"';
      } else if (Array.isArray(input[i])) {
        output += "Array [";
        output += consoleUtils.formatArray(input[i]);
        output += "]";
      } else {
        output += consoleUtils.formatOutput(input[i]);
      }
      if (i < input.length - 1) {
        output += ", ";
      }
    }
    return output;
  },
  formatObject: input => {
    var bufferDataViewRegExp = /^(ArrayBuffer|SharedArrayBuffer|DataView)$/;
    var complexArrayRegExp = /^(Int8Array|Int16Array|Int32Array|Uint8Array|Uint16Array|Uint32Array|Uint8ClampedArray|Float32Array|Float64Array|BigInt64Array|BigUint64Array)$/;
    var objectName = input.constructor.name;
    if (objectName === "String") {
      return `String { "${input.valueOf()}" }`;
    }
    if (input === JSON) {
      return `JSON {}`;
    }
    if (objectName.match(bufferDataViewRegExp)) {
      return objectName + " {}";
    }
    if (objectName.match(complexArrayRegExp)) {
      var arrayLength = input.length;
      if (arrayLength > 0) {
        return objectName + " [" + consoleUtils.formatArray(input) + "]";
      } else {
        return objectName + " []";
      }
    }
    if (objectName === "Symbol" && input !== undefined) {
      return input.toString();
    }
    if (objectName === "Object") {
      var formattedChild = "";
      var start = true;
      for (var key in input) {
        if (start) {
          start = false;
        } else {
          formattedChild = formattedChild + ", ";
        }
        formattedChild =
          formattedChild + key + ": " + consoleUtils.formatOutput(input[key]);
      }
      return objectName + " { " + formattedChild + " }";
    }
    return input;
  },
  formatOutput: input => {
    if (input === undefined || input === null || typeof input === "boolean") {
      return String(input);
    } else if (typeof input === "number") {
      if (Object.is(input, -0)) {
        return "-0";
      }
      return String(input);
    } else if (typeof input === "bigint") {
      return String(input) + "n";
    } else if (typeof input === "string") {
      return '"' + input + '"';
    } else if (Array.isArray(input)) {
      return "Array [" + consoleUtils.formatArray(input) + "]";
    } else {
      return consoleUtils.formatObject(input);
    }
  },
  writeOutput: (content, output) => {
    var outputContent = output.textContent;
    var newLogItem = "> " + content + "\n";
    output.textContent = outputContent + newLogItem;
  }
};

export default function runJS(code, outputEle) {
  const console = {
    error: function(loggedItem) {
      consoleUtils.writeOutput(loggedItem);
      window.console.error.apply(console, arguments);
    },
    log: function() {
      var formattedList = [];
      for (var i = 0, l = arguments.length; i < l; i++) {
        var formatted = consoleUtils.formatOutput(arguments[i]);
        formattedList.push(formatted);
      }
      var output = formattedList.join(" ");
      consoleUtils.writeOutput(output, outputEle);
      window.console.log.apply(console, arguments);
    }
  };
  outputEle.textContent = "";
  eval(code);
}
