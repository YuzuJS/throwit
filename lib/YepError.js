import Enum from "enumit";

var Errors = new Enum("UNKNOWN");

export default class YepError extends Error {
    constructor(key = "UNKNOWN", { message, details } = {}) {
        var isKeyAnError = key instanceof Error;
        message = isKeyAnError ? key.message : message;

        super(message);
        var ErrorClass = this.constructor || YepError;

        this.code = isKeyAnError ? ErrorClass.Errors.UNKNOWN : (ErrorClass.Errors[key] || ErrorClass.Errors.UNKNOWN);
        this.details = details || {};
        this.message = message ? message : this.name;
        this.stack = (new Error()).stack;
    }

    get title() {
        return "YepError";
    }

    get name() {
        return `${this.title}#${this.code}`;
    }

    toString() {
        var ErrorClass = this.constructor || YepError;
        return `Error ${ErrorClass.groupCode + this.code.toNumber()}`;
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
}