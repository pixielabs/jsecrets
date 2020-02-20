describe("AWS returns a valid response", () => {
  jest.mock("aws-sdk", () => {
    const dataDouble = {
      ARN:
        "arn:aws:secretsmanager:eu-west-2:123456789012:secret:MyTestDatabaseSecret-a1b2c3",
      CreatedDate: 1.523477145713e9,
      Name: "MyTestDatabaseSecret",
      SecretString:
        '{\n  "username":"pixielabs",\n  "password":"BnQw&XDWgaEeT9XGTT29"\n}\n',
      VersionId: "EXAMPLE1-90ab-cdef-fedc-ba987SECRET1",
      VersionStages: ["AWSPREVIOUS"]
    };

    const clientDouble = {
      getSecretValue: jest.fn((object, cb) => {
        const err = null;
        return cb(err, dataDouble);
      })
    };

    return {
      SecretsManager: jest.fn().mockImplementation(() => {
        return clientDouble;
      })
    };
  });

  const AWS = require("aws-sdk");
  const jsecrets = require("../../jsecrets.js");

  const secretId = "MyTestDatabaseSecret";
  const regionString = "eu-west-2";

  test(".secrets returns an empty object", () => {
    expect(jsecrets.secrets).toMatchObject({});
  });

  test(".get() returns an error if called before .fetch()", () => {
    expect(() => {
      jsecrets.get(secretId, "username");
    }).toThrow("You must call jsecrets.fetch() before jsecrets.get()");
  });

  test(".fetch() sets the secrets in Secret.secrets", async () => {
    await jsecrets.fetch(regionString, [secretId]);

    expect(jsecrets.secrets).toMatchObject({
      MyTestDatabaseSecret: {
        password: "BnQw&XDWgaEeT9XGTT29",
        username: "pixielabs"
      }
    });
  });

  test(".get returns the requested secret", async () => {
    await jsecrets.fetch(regionString, [secretId]);

    expect(jsecrets.get(secretId, "username")).toBe("pixielabs");
  });
});
