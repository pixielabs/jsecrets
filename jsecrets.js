const AWS = require("aws-sdk");

class jsecrets {
  static devStubs(stubs) {
    if (process.env.NODE_ENV == "production") {
      const stubWarning =
        "You have stubbed all calls to AWS Secrets manager. We recommend wrapping your call to `jsecrets.devStubs()` in an `if` block. See the jsecrets README for more info.";
      console.warn(stubWarning);
    }
    this.stubs = stubs;
  }

  // If this.stubs == null, fetch the secrets from AWS Secrets Manager.
  static async fetch(region, secrets) {
    if (this.stubs) {
      // find any unstubbed secrets
      const unstubbedSecrets = secrets.filter(secret => {
        return !Object.keys(this.stubs).includes(secret);
      });
      if (unstubbedSecrets.length) {
        // if there are any secrets that do not have equivalent stubs
        // raise an informative error.
        throw {
          message: `.fetch() errored. You have unstubbed secrets: [${unstubbedSecrets}]`
        };
      }
    } else {
      // Use AWS Secrets Manager if stubs haven't been set.
      await this._fetchAWSSecrets(region, secrets);
    }
    this.fetched = true;
    return;
  }

  // If this.stubs has been set, the secrets can be retrieved from
  // this.stubs. If this.stubs hasn't been set, i.e. the app is
  // running in production, the secrets are retrieved from this.secrets.
  static get(secretId, key) {
    // Ensure secrets have been fetched (or env vars have been loaded)
    if (!this.fetched) {
      throw { message: "You must call jsecrets.fetch() before jsecrets.get()" };
    }

    if (this.stubs && this.stubs[secretId][key]) {
      // Use the stubs if set.
      return this.stubs[secretId][key];
    } else if (!this.stubs && this.secrets[secretId][key]) {
      // Otherwise use secrets loaded from AWS.
      return this.secrets[secretId][key];
    } else {
      // raise if key cannot be found in the secret.
      throw { message: `${key} is undefined in ${secretId}`}
    }
  }

  // Gets all secrets from AWS Secrets Manager from the SecretIds specified.
  static _fetchAWSSecrets(region, secrets) {
    const client = new AWS.SecretsManager({ region });

    return Promise.all(
      secrets.map(secretId => {
        return this._getSecretValue(client, secretId);
      })
    );
  }

  // Gets a set of key/values from a single SecretId location in AWS Secrets
  // Manager and adds them to this.secrets.
  static _getSecretValue(client, secretId) {
    return new Promise(resolve => {
      client.getSecretValue({ SecretId: secretId }, (err, data) => {
        // If AWS returns an error, raise it
        if (err) {
          throw err;
        }
        // Grab the secret from the data returned from AWS
        const secrets = data.SecretString;
        // If AWS returns no secret for some reason, raise an error
        if (!secrets) {
          // throw new Error("Missing secrets")
          throw { message: "Missing secrets" };
        }
        // Otherwise, set the secrets on our singleton...
        this.secrets[secretId] = JSON.parse(secrets);
        // ...and resolve the promise
        resolve();
      });
    });
  }
}

jsecrets.secrets = {};

module.exports = jsecrets;
