* 
 */
(function(){
var KasperskyLab = {SIGNATURE:"7D8B79A2-8974-4D7B-A76A-F4F29624C06B7wK6ZAI6aTE9zhhF6DI_XyToGXrkPYTlLB9_5MWIqWfmHGP5vPvPX1ffOZtqLyeGdYcaa5yucgpI91MsLoVqpg",PLUGINS_LIST:"",PREFIX:"https://gc.kis.v2.scr.kaspersky-labs.com/",INJECT_ID:"FD126C42-EBFA-4E12-B309-BB3FDD723AC1"}; var KasperskyLab = (function (context) {
    function GetClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }
    var exports = {}, undef;
    function ObjectToJson(object) {
        if (object === null || object == Infinity || object == -Infinity || object === undef)
            return "null";
        var className = GetClass(object);
        if (className == "Boolean") {
            return "" + object;
        } else if (className == "Number") {
            return window.isNaN(object) ? "null" : "" + object;
        } else if (className == "String") {
			var escapedStr = "" + object;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof object == "object") {
            if (!ObjectToJson.check) ObjectToJson.check = [];
            for (var i=0, chkLen=ObjectToJson.check.length ; i<chkLen ; ++i) {
                if (ObjectToJson.check[i] === object) {
                    throw new TypeError();
                }
            }
            ObjectToJson.check.push(object);
            var str = '';
            if (className == "Array" || className == "Array Iterator") {
                for (var index = 0, length = object.length; index < length; ++index) {
                    str += ObjectToJson(object[index]) + ',';
                }
                ObjectToJson.check.pop();
                return "["+str.slice(0,-1)+"]";
            } else {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        str += '"' + property + '":' + ObjectToJson(object[property]) + ',';
                    }
                }
                ObjectToJson.check.pop();
                return "{"+str.slice(0,-1)+"}";
            }
        }
        return undef;
    }
    exports.stringify = function (source) {
        return ObjectToJson(source);
    };
    var parser = {
        source : null,
        grammar : /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/,
        ThrowError : function() {
            throw new SyntaxError('JSON syntax error');
        },
        NextToken : function(token) {
            this.source = token.input.slice(token[0].length);
            return this.grammar.exec(this.source);
        },
        ParseArray : function(){
            var token = this.grammar.exec(this.source),
                parseItem = token && token[1] != ']',
                result = [];
            for(;;token = this.NextToken(token)) {
                if (!token)
                    this.ThrowError();
                if (parseItem) {
                    result.push(this.ParseValue(token));
                    token = this.grammar.exec(this.source);
                } else {
                    if (token[1]) {
                        if (token[1] == ']') {
                            break;
                        } else if (token[1] != ',') {
                            this.ThrowError();
                        }
                    } else {
                        this.ThrowError();
                    }
                }
                parseItem = !parseItem;
            }
            return result;
        },