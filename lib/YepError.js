import Enum from "enumit";

var Errors = new Enum("UNKNOWN");
var allErrors = {};

export default class YepError extends Error {
    constructor(key = "UNKNOWN", { message, details } = {}) {
        var isKeyAnError = key instanceof Error;
        message = isKeyAnError ? key.message : message;

        super(message);
        var ErrorClass = this.constructor || YepError;

        this.code = isKeyAnError ? ErrorClass.Errors.UNKNOWN : (ErrorClass.Errors[key] || ErrorClass.Errors.UNKNOWN);
        this.details = isKeyAnError && !details ? { originalError: key } : (details || {});
        this.message = message ? message : this.name;
        this.stack = (new Error()).stack;
    }

    get title() {
        return "YepError";
    }

    get name() {
        return `${this.title}#${this.code}`;
    }

    toNumber() {
        var ErrorClass = this.getClass();
        return ErrorClass.groupCode + this.code.toNumber();
    }

    toString() {
        var name = this.name;
        var msg = this.message;
        var stringInfo = name !== msg ? `${name}: ${msg}` : name;
        return `${stringInfo}`;
    }

    getClass() {
        return this.constructor || YepError;
    }

    get _criticalCodes() {
        return [];
    }

    get isCritical() {
        return this._criticalCodes.some((c) => c.value === this.code.value);
    }

    static get groupCode() {
        return 100;
    }

    static get Errors() {
        return Errors;
    }

    static isYepError(error, key, ErrorClass) {
        ErrorClass = ErrorClass || YepError;

        if (key) {
            return error instanceof ErrorClass && error.code === ErrorClass.Errors[key];
        } else {
            return error instanceof ErrorClass;
        }
    }

    static get allErrors() {
        return allErrors;
    }

    static register(groupCode, options) {
        return (target) => {
            var errorCheckMethod = `is${options.title}`;

            Object.defineProperty(target, errorCheckMethod, {
                value(error, key) {
                    return YepError.isYepError(error, key, target);
                }
            });
            Object.defineProperty(target, "groupCode", { get: () => groupCode });
            Object.defineProperty(target, "Errors", { get: () => options.Errors });
            Object.defineProperty(target.prototype, "title", { get: () => options.title });

            allErrors[groupCode] = target;
        };
    }

}
