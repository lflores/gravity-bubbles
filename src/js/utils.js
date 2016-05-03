/**
jQuery extends replacemement
TODO: Resolve jQuery conflict
*/
//Object.prototype.extends = function (out) {
//    out = out || {};
//
//    for (var i = 0; i < arguments.length; i++) {
//        var obj = arguments[i];
//        if (!obj) {
//            continue;
//        }
//
//        for (var key in obj) {
//            if (obj.hasOwnProperty(key)) {
//                if (typeof obj[key] === 'object' && typeof this[key] != 'undefined')
//                    this[key].extends(obj[key]);
//                else
//                    this[key] = obj[key];
//            }
//        }
//    }
//    return this;
//};

/**
jQuery extend replacement
*/
var deepExtend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        if (!obj) {
            continue;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    out[key] = deepExtend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }
    return out;
};

if (typeof String.replaceParams === 'undefined') {
    /**
    Retorna una string con los parametros reemplazados 
    Por ej. {0} será reemplazado por el primer valor de los parámetros
    */
    String.prototype.replaceParams = function (params) {
        if (typeof params === 'undefined') {
            return this;
        }
        //Si el parametro es un string lo hago array
        if (typeof params === 'string') {
            params = [params];
        }
        //Reviso todos 
        var _ret = this.replace(/^\s+|\s+$/g, "");
        for (var i = 0; i < params.length; i++) {
            _ret = _ret.replace("\{" + i + "\}", params[i]).replace("\{" + i + "\}", params[i]);
        }
        return _ret;
    };
}

/**
Text cutter, using char sequence
*/
String.prototype.splitMultiple = function (chars) {
    if (typeof chars === 'undefined') {
        chars = "\n-";
    }
    var _chars = chars.split("");
    var _lines = this.split(_chars[0]);
    _chars.splice(0, 1);
    if (_chars.length === 0) {
        return _lines.map(function (elem) {
            return elem.trim();
        });
    }
    var _newlines = [];
    for (var i = 0; i < _lines.length; i++) {
        var _line = _lines[i].splitMultiple(_chars.join(""));
        if (_line.length > 1) {
            _newlines = _newlines.concat(_line);
        } else {
            _newlines.push(_line[0]);
        }
    }
    return _newlines;
};
