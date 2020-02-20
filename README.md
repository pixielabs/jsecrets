[![Actions Status](https://github.com/pixielabs/jsecrets/workflows/Unit%20and%20Feature%20tests/badge.svg)](https://github.com/pixielabs/jsecrets/actions)

# jsecrets

jsecrets lets you fetch and use secrets from
[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) in your
JavaScript projects.

You may want to use this if you use AWS Secrets Manager to store encrypted
credentials, e.g. for your database, or for accessing an API with a token,
and need to access those credentials in a backend JavaScript application e.g.
an Express server, Lambda function, or some other backend piece of code.

## Install

Add the package to your package.json with either NPM or Yarn:

```shell
# With NPM:
$ npm i -S jsecrets
# With Yarn:
$ yarn add jsecrets
```

## Fetching secrets

jsecrets expects that your secrets are JSON objects stored in AWS Secrets
Manager as strings.

```js
// app.js
const jsecrets = require("jsecrets");

try {
  // Fetch secrets from AWS Secrets Manager with jsecrets.fetch(), passing in
  // the region and an array of secret IDs. The secret ID can be the Amazon
  // Resource Name (ARN) or the "friendly name" of the secret.
  await jsecrets.fetch("eu-west-2", ["databaseSecret", "anotherSecret"]);

  // Once the secrets have been retrieved, individual values can be extracted by
  // passing in the name of the secret and the key to jsecrets.get().
  const database = jsecrets.get("databaseSecret", "database");
  const username = jsecrets.get("databaseSecret", "username");
  const password = jsecrets.get("databaseSecret", "password");
  const options = {
    host: jsecrets.get("databaseSecret", "host"),
    dialect: "postgres"
  };

  // You might then use those secrets to configure a DB connection, such as:
  const sequelize = new Sequelize(database, username, password, options);

  // The rest of your app goes here.

} catch (e) {
  console.log(e.message);
}
```

## Stubbing jsecrets in development

jsecrets has a helper method making it easy to stub calls to AWS when you are
developing your application, and so don't need to use production secrets.
Immediately after the `import`, call `jsecrets.devStubs()` passing in an 
object with the same shape as your secrets.The stubs will be used in all
circumstances.

Wrap the call to `jsecrets.devStubs()` in a `if` block to ensure `devStubs()`
is not called in production.

If you have multiple secrets, you can pass them all into `jsecrets.devStubs()`
at once.

For example:

```js
const jsecrets = require('jsecrets');

if (process.env.NODE_ENV != 'production') {
  // Stub the return values of jsecrets.get() unless the app is running in
  // production.
  jsecrets.devStubs({
    'databaseSecret': {
      'database': 'jsecrets_node_app',
      'host': 'localhost',
      'username': 'pixielabs',
      'password': 'pixielabs_secrets'
    },
    'anotherSecret': {
      'jwt_signing_key': 'jsecret_signing',
      'jwt_client_key': 'jsecret_client'
    }
  })
}

try {
  // Fetch secrets from AWS Secrets Manager with jsecrets.fetch()
  await jsecrets.fetch("eu-west-2", ["databaseSecret", "anotherSecret"]);
```

## Errors

All errors returned by jsecrets will have a `message` key.

If the error is from AWS then there will also be other keys such as
`code`, `time` and `statusCode`.


## Contributing

### Running the tests

Unit tests can be run with:
```
$ npm test
```

Feature tests are part of the example Express app within the exampleApp folder:
```
$ npm run exampleAppStart
```

In a new terminal:
```
$ npm run exampleAppTest
```

Before contributing, please read the [code of conduct](CODE_OF_CONDUCT.md).
- Check out the latest master to make sure the feature hasn't been implemented
  or the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it
  and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Please try not to mess with the package.json, version, or history. If you
  want to have your own version, or is otherwise necessary, that is fine, but
  please isolate to its own commit so we can cherry-pick around it.