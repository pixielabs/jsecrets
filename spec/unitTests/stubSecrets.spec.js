describe("jsecrets has been stubbed", () => {
  const AWS = require("aws-sdk");
  const jsecrets = require("../../jsecrets.js");

  const stubs = {
    MyTestDatabaseSecret: {
      database: "jsecrets_node_app",
      host: "localhost",
      username: "pixielabs",
      password: "pixielabs_secrets"
    }
  };

  beforeEach(() => {
    jsecrets.devStubs(stubs);
  });

  afterEach(() => {
    jsecrets.devStubs(null);
    jsecrets.secrets = {};
  });

  test(".devStubs makes this.stubs", () => {
    expect(jsecrets.stubs).toBe(stubs);
  });

  test(".fetch() returns a error if a secretId doesn't exist in the stubbs", async () => {
    const regionString = "eu-west-2";
    const secretId = "NotMyTestDatabaseSecret";

    try {
      await jsecrets.fetch(regionString, [secretId]);
    } catch (e) {
      expect(e.message).toEqual(
        ".fetch() errored. You have unstubbed secrets: [NotMyTestDatabaseSecret]"
      );
    }
  });

  test(".get() uses the stubs", async () => {
    const regionString = "eu-west-2";
    const secretId = "MyTestDatabaseSecret";
    await jsecrets.fetch(regionString, [secretId]);

    expect(jsecrets.get("MyTestDatabaseSecret", "password")).toEqual(
      "pixielabs_secrets"
    );
  });

  describe("if the user is running their app in production", () => {
    const processEnv = process.env.NODE_ENV;
    const stubWarning =
      "You have stubbed all calls to AWS Secrets manager. We recommend wrapping your call to `jsecrets.devStubs()` in an `if` block. See the jsecrets README for more info.";

    beforeEach(() => {
      jsecrets.devStubs(null);
      process.env.NODE_ENV = "production";
    });

    afterEach(() => {
      process.env.NODE_ENV = processEnv;
    });

    test(".devStubs warns the user", () => {
      const warn = jest.spyOn(global.console, "warn");
      jsecrets.devStubs(stubs);

      expect(warn).toHaveBeenCalledWith(stubWarning);
    });
  });
});
