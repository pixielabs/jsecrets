describe("The returned Secret does not have a SecretString", () => {
  jest.mock("aws-sdk", () => {
    const dataDouble = {
      ARN:
        "arn:aws:secretsmanager:eu-west-2:123456789012:secret:MyTestDatabaseSecret-a1b2c3",
      CreatedDate: 1.523477145713e9,
      Name: "MyTestDatabaseSecret",
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

  test.only(".fetch throws an error if AWS returns errors to the package", async () => {
    const regionString = "eu-west-2";
    const secret = "MyTestDatabaseSecret";

    try {
      await jsecrets.fetch(regionString, [secret]);
    } catch (e) {
      expect(e).toEqual({
        message: "Missing secrets"
      });
    }
  });
});
