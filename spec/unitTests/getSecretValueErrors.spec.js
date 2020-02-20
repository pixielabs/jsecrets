describe("AWS Secrets manager returns an error", () => {
  jest.mock("aws-sdk", () => {
    const clientDouble = {
      getSecretValue: jest.fn((object, cb) => {
        const err = {
          message:
            "User: arn:aws:iam::302290960744:user/jonathan is not authorized to perform: secretsmanager:GetSecretValue on resource: arn:aws:secretsmanager:eu-west-2:302290960744:secret:MyTestDatabaseSecret-TOuEXQ",
          code: "AccessDeniedException",
          time: "2019-11-27T08:50:56.677Z",
          requestId: "d47e7ae0-f801-49d0-9804-90137a74602c",
          statusCode: 400,
          retryable: false,
          retryDelay: 85.72081236206728
        };
        return cb(err, null);
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
      expect(e.code).toEqual("AccessDeniedException");
    }
  });
});
