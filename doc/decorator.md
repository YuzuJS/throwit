# throwit decorator

When subclassing TError, most of the code needed to implement the child class is boilerplate code. To make extending TError easier, a decorator is exposed on the TError as `TError.register`

```typescript
interface TError {
    // decorator exposed on static class.
    static register(groupdCode: Number, opts: TErrorRegistration);
}

interface TErrorRegistration {
    title: string;
    Errors: Enumit;
}
```

## Example Usage (AuthError)
``` js
import { TError } from "throwit";
import Enum from "enumit";

const GROUP_CODE = 200;

var Errors = new TError.Enum(
    "UNKNOWN", "INVALID_CREDENTIALS", "INVALID_TOKEN", "MISSING_TOKEN_FIELDS",
    "SIGN_IN_CONFLICT", "SESSION_SUSPENDED", "NOT_AUTHENTICATED"
);

@TError.register(GROUP_CODE, { title: "AuthError", Errors })
export default class AuthError extends TError {
    // any additional custom methods unique to this class can live here
}
```

## What is generated
The decorator will generate a whole host of lovely methods as seen in the example below:

``` js
AuthError.groupCode // returns 200
AuthError.Errors // returns the enum above ("UNKNOWN", "INVALID_CREDENTIALS"...);

var pretendError = new AuthError("INVALID_CREDENTIALS");

pretendError.title // returns "AuthError"
AuthError.isAuthError(pretendError) // returns true
```

## There's more!

In addition to ease of use, the decorator memoizes all error classes, which can be referenced with the 
`TErrors.allErrors` static property and can be easily seen by going to the following route in your url bar: 

`http://mdr.localtest.me:9000/#/errors`
