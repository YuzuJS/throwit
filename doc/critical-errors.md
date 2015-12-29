# critical errors

Critical errors are errors that contain an error code that should not be handled by any local module/component and instead should be bubbled up to the root of the application. This implies that local context is not as important as to the state of the application. Most errors (non critical ones) have the reverse importance, where the local context is more important.

A perfect example of a critical error is when the auth token is no longer valid, and the session has expired. The local context has no meaning because the application state needs to be reset (user logged out, and shown the welcome sign in screen).

The base class `YepError` returns an empty array when asked for the critical error codes (A protected getter: `_criticalCodes`). This protected getter is used by the `isCritical` public boolean getter.

## how to declare your critical codes

```js
class MyError extends AuthError {
    get _criticalCodes() {
        return [Errors.THE_WORLD_IS_ENDING, Errors.HOPE_IS_LOST];
    }
}
```

The `error.isCritical` will now be true when the code is equal to THE_WORLD_IS_ENDING or HOPE_IS_LOST enum values.