"use strict";

import { showErrorMessageDialog } from "app-dialog";
import { s } from "app-localization";
import { SessionSuspendedError } from "./types";
import { convertToUISafeError } from "./index";

const TITLE_OOPS = s("dialogTitle/oops");

export function throwIfFatal(err) {
    if (err instanceof SessionSuspendedError) { // TODO Should be `instanceof FatalError`.
        throw err;
    }
}

export function mapForUIAndThrowIfFatal(errorCaught, { logger, logPrefix, defaultMsgKey }) {
    logger.logError(errorCaught, { prefixWith: `${logPrefix} Failed` });

    var errorForUI = convertToUISafeError(errorCaught, defaultMsgKey);

    throwIfFatal(errorForUI); // Check if we shouldn't even handle error.
    return errorForUI;
}

export function createErrorHandler(logger) {
    return (logPrefix, opts) => (errorCaught) => {
        var { title, defaultMsgKey, onBeforeShow } = opts || {};
        title = title || TITLE_OOPS;

        var errorForUI = mapForUIAndThrowIfFatal(errorCaught, { logger, logPrefix, defaultMsgKey });

        if (typeof onBeforeShow === "function") {
            onBeforeShow({ errorCaught, errorForUI });
        }
        return showErrorMessageDialog(errorForUI, title);
    };
}
