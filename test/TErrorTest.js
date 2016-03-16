import TError from "../lib/TError";

describe("TError", function () {
    var { UNKNOWN } = TError.Errors;

    it("exposes an UNKNOWN error codes", () => {
        TError.Errors.should.ownProperty("UNKNOWN");
    });

    it("belongs to a group code", () => {
        TError.groupCode.should.equal(100);
    });

    describe("when creating an TError w/o parameters", () => {
        beforeEach(() => {
            this.error = new TError();
        });

        it("should have the title `TError`", () => {
            this.error.title.should.equal("TError");
        });

        it("should have the name `TError#UNKNOWN`", () => {
            this.error.name.should.equal("TError#UNKNOWN");
        });

        it("should be an UNKNOWN TError", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the name`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should output to the proper string representation", () => {
            String(this.error).should.equal("TError#UNKNOWN");
        });

        it("should output to the proper number representation", () => {
            this.error.toNumber().should.equal(101);
        });

        it("should be an `TError`", () => {
            TError.isTError(this.error).should.be.true;
        });

        it("should have empty `_criticalCodes`", () => {
            Array.isArray(this.error._criticalCodes).should.be.true;
        });
    });

    describe("when creating an TError w/ a key", () => {
        beforeEach(() => {
            this.error = new TError("UNKNOWN");
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the key`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should be a TError", () => {
            TError.isTError(this.error, "UNKNOWN").should.be.true;
        });
    });

    describe("when providing a opts", () => {
        beforeEach(() => {
            var details = { isFoo: true };
            var message = "Oops. My bad :(";

            this.error = new TError("UNKNOWN", { details, message });
            this.errorInfo = { details, message };
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have the correct message`", () => {
            this.error.message.should.to.have.string(this.errorInfo.message);
        });

        it("should have the correct details", () => {
            this.error.details.should.eql(this.errorInfo.details);
        });

        it("should be a TError", () => {
            TError.isTError(this.error, "UNKNOWN").should.be.true;
        });
    });

    describe("when extending TError", () => {
        beforeEach(() => {
            var Errors = new TError.Enum("UNKNOWN", "DOH", "FOO", "BAR", "BAZ");

            class CustomError extends TError {
                get title() { return "CustomError"; }
                get _criticalCodes() { return [Errors.DOH, Errors.BAZ]; }
                static get groupCode() { return 5000; }
                static get Errors() { return Errors; }
                static isCustomError(err, key) {
                    return TError.isTError(err, key, CustomError);
                }
            }

            this.CustomError = CustomError;

            this.error = new CustomError("DOH");
            this.bazError = new CustomError("BAZ");
            this.fooError = new CustomError("FOO");
        });

        it("should have the name `CustomError#DOH`", () => {
            this.error.name.should.equal("CustomError#DOH");
        });

        it("should output the number `5002`", () => {
            this.error.toNumber().should.equal(5002);
        });

        it("should be a DOH CustomError", () => {
            this.error.code.should.equal(this.CustomError.Errors.DOH);
        });

        it("should have a message the same as the name`", () => {
            this.error.message.should.equal(this.error.name);
        });

        it("should have empty details", () => {
            this.error.details.should.eql({});
        });

        it("should output to the proper string representation", () => {
            String(this.error).should.equal("CustomError#DOH");
        });

        it("should be a `CustomError`", () => {
            this.CustomError.isCustomError(this.error).should.be.true;
        });

        it("should be a critical error after overriding `_criticalCodes`", () => {
            this.error.isCritical.should.be.true;
            this.bazError.isCritical.should.be.true;
            this.fooError.isCritical.should.be.false;
        });
    });

    describe("when creating an TError w/ an Error w/o opts", () => {
        beforeEach(() => {
            this.originalError = new Error("Error message!");
            this.error = new TError(this.originalError);
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the key`s/original error's", () => {
            this.error.message.should.equal(this.originalError.message);
        });

        it("should have details with an `originalError` prop equal to error", () => {
            this.error.details.should.have.property("originalError");
            this.error.details.originalError.should.eql(this.originalError);
        });

        it("should be a TError", () => {
            TError.isTError(this.error, "UNKNOWN").should.be.true;
        });

        it("should output the proper string", () => {
            String(this.error).should.equal("TError#UNKNOWN: " + this.originalError.message);
        });
    });

    describe("when creating an TError w/ an Error and opts", () => {
        beforeEach(() => {
            this.originalError = new Error("Error message!");
            this.errorOpts = { message: "Horrible error!", details: { isFatal: false } };
            this.error = new TError(this.originalError, this.errorOpts);
        });

        it("should be an UNKNOWN error", () => {
            this.error.code.should.eql(UNKNOWN);
        });

        it("should have a message the same as the key`s/original error's", () => {
            this.error.message.should.equal(this.originalError.message);
        });

        it("should have the correct details", () => {
            this.error.details.should.eql(this.errorOpts.details);
        });

        it("should be a TError", () => {
            TError.isTError(this.error, "UNKNOWN").should.be.true;
        });
    });
});
