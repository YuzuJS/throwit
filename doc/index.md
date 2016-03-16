# docs

## quick links
- [Why TError?](#why)
- [API](#TError-api)
- [TError.register decorator](./decorator.md)

## Why
Errors can be thrown at any level/layer of the application. To make the job of catching errors simpler, a consistent api is provided thru TError. This includes an error code, and queries as to the type of message and any details.

```typescript
interface TError {
    title: string;
    name: string;
    message: string;
    details: Object;
    toNumber(): number;
    toString(): string;
    isCritical: boolean;
    static groupCode: number;
    static Errors: Enumit;
    static isTError(error: Error, key: string, ErrorClass: Class);
}
```

## TError Api

- `title` - The display name of the error class
- `name` - Display name plus the error code. Used by uncaught error handling.
- `message` - Same as regular old Error.
- `details` - Very Useful! Provide more information about the origin of the error, and more details about what went wrong specifically.
  - For example, when throwing an SSO Error, this might useful: ```{ details: type: "sso", ssoParts: { id, email, bearerToken }```
- `code` - The enum value for the type of error. All errors should support `UNKNOWN` value.
- static `Errors` enum - with each type of error created.
- Support for `toString` to `Error XXX`.
- `isCritical` - For more on critical [see these docs](./critical-errors.md).
    ```

## Extending
When extending TError you must provide the following
- static `groupCode` property that is unique.
- static `Errors` enum for your custom error types.
- static `isMyCustomError` method.
- override the title property.
- If you have critical codes, override the `_criticalCodes` property.

__You should use the provided the [`TError.register` decorator](./decorator.md) when subclassing to remove boilerplate code.__

