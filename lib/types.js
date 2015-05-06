"use strict";

import { s } from "app-localization";
import { ChalkError } from "app-enums";

var ERROR_MESSAGES = "errorMessages/";

var numberToErrorInfo = null;

function getErrorMessage(errorNumber, unknownLabel = "unknownError") {
    try {
        return s(ERROR_MESSAGES + errorNumber);
    } catch (ex) {
        return s(ERROR_MESSAGES + unknownLabel, errorNumber);
    }
}

function extendError(nameOfErrorType, ChildError) {
    ChildError.prototype.name = nameOfErrorType;
    ChildError.prototype = Object.create(Error.prototype);
    ChildError.prototype.constructor = ChildError;
    return ChildError;
}

export var UISafeError = extendError("UISafeError", function UISafeError(errorNumber, defaultLabel) {
    this.message = getErrorMessage(errorNumber, defaultLabel);
    this.number = errorNumber;
    this.stack = (new Error()).stack;
});

export var AppError = extendError("AppError", function AppError(errorNumber, additionalInfo, defaultLabel) {
    this.message = getErrorMessage(errorNumber, defaultLabel);
    this.number = errorNumber;
    this.info  = additionalInfo;
    this.stack = (new Error()).stack;
});

var DataError = extendError("DataError", function DataError(errorNumber, additionalInfo) {
    this.number = errorNumber;
    this.info = additionalInfo;
    this.stack = (new Error()).stack;
});

function createAndExportErrorConstructor(name) {
    function CustomError(errorNumber) {
        UISafeError.call(this, errorNumber);
    }
    CustomError.prototype = Object.create(UISafeError.prototype);
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = name;

    CustomError.displayName = name;

    exports[name] = CustomError;
    return CustomError;
}

function FileAlreadyExistsError(name, ean) {
    createAndExportErrorConstructor("FileAlreadyExistsError").call(this, name);

    Object.defineProperty(this, "ean", {
        value: ean,
        enumerable: true
    });
}

function isCloudClientError(error) {
    return error.name === "CloudClientError";
}

function createChalkDataError(originalError) {
    return new DataError(ChalkError[originalError.type], originalError.message);
}

var SessionSuspendedError = createAndExportErrorConstructor("SessionSuspendedError");
var CredentialsError = createAndExportErrorConstructor("CredentialsError");
var NetworkError = createAndExportErrorConstructor("NetworkError");
var ServerError = createAndExportErrorConstructor("ServerError");

export function convertToUISafeError(originalError, defaultLabel) {
    if (!originalError) {
        throw new Error("Falsy originalError passed to wrapError.");
    }

    // Check if already wrapped or if it's a generic error.
    if (originalError instanceof UISafeError) {
        return originalError;
    }

    if (isCloudClientError(originalError)) {
        originalError = createChalkDataError(originalError);
    }

    if (!originalError.number) {
        return new UISafeError(1, defaultLabel); // 1 for unhandler js errors.
    }

    var errorInfo = numberToErrorInfo(originalError.number);
    if (!errorInfo) { // Failed converting error (IE/beretta js errors can have numbers)
        return new UISafeError(originalError.number, defaultLabel);
    }

    var errorNumber = errorInfo.number;
    var extraInfo = errorInfo.extraInfo;

    switch (errorNumber) {

    case ChalkError.sessionSuspended:
        return new SessionSuspendedError(errorNumber);

    case ChalkError.networkException:
        return new NetworkError(errorNumber);

    case ChalkError.unexpectedResponseStatus:
        return new ServerError(errorNumber);

    case ChalkError.accessCodeAlreadyRedeemed:
    case ChalkError.accessCodeNotFound:
    case ChalkError.accessCodeUnknownError:
        return new RedeemAccessCodeError(errorNumber);

    case ChalkError.invalidCredentials:
    case ChalkError.accountLocked:
    case ChalkError.alreadySignedIn:
    case ChalkError.alreadySignedOut:
        return new CredentialsError(errorNumber);

    case ChalkError.deviceIdNotValidForSession:
        return new DeviceIdNotValidForSessionError(errorNumber);

    case 1013:
        return new FileAlreadyExistsError(errorNumber, extraInfo);
    }

    return new UISafeError(errorNumber, defaultLabel);

}

export function setNumberToErrorInfo(converter) {
    numberToErrorInfo = converter;
}
