"use strict";

import Q from "q";
import { convertToUISafeError } from "./types";
import logMgr from "app-logger";

export default function wrapWithUISafePromise(object, method) {
    var logger = logMgr.container("APP");
    return function () {
        if (!object[method]) {
            console.error("Can not wrap method that does not exist.", method);
            return Q.resolve();
        }

        return Q.when(object[method].apply(object, arguments)).catch(function (caughtError) {
            logger.logError(caughtError, { prefixWith: `Api Wrapper Caught Error on ${method}` });
            throw convertToUISafeError(caughtError);
        });
    };
}
