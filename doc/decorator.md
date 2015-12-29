# yep-error decorator

When subclassing YepError, most of the code needed to implement the child class is boilerplate code. To make extending YepError easier, a decorator is exposed on the YepError as `YepError.register`

```typescript
interface YepError {
    // decorator exposed on static class.
    static register(groupdCode: Number, opts: YepErrorRegistration);
}

interface YepErrorRegistration {
    title: string;
    Errors: Enumit;
}
```

## Example Usage (AuthError)
``` js
import { YepError } from "@yuzu/yep-errors";
import Enum from "enumit";

const GROUP_CODE = 200;

var Errors = new Enum("UNKNOWN",
                      "INVALID_CREDENTIALS", "INVALID_TOKEN", "MISSING_TOKEN_FIELDS",
                      "SIGN_IN_CONFLICT", "SESSION_SUSPENDED", "NOT_AUTHENTICATED");

@YepError.register(GROUP_CODE, { title: "AuthError", Errors })
export default class AuthError extends YepError {
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
`YepErrors.allErrors` static property and can be easily seen by going to the following route in your url bar: 

`http://mdr.localtest.me:9000/#/errors`
