const jsecrets = require("../../jsecrets.js");

const express = require("express");
const app = express();
const port = 3000;

if (process.env.NODE_ENV != "production") {
  jsecrets.devStubs({
    databaseSecret: {
      database: "jsecrets_node_app",
      host: "localhost",
      username: "pixielabs",
      password: "pixielabs_secrets"
    },
    anotherSecret: {
      jwt_signing_key: "jsecret_signing",
      jwt_client_key: "jsecret_client"
    }
  });
}

(async () => {
  try {
    await jsecrets.fetch("eu-west-2", ["databaseSecret", "anotherSecret"]);

    app.get("/database", (req, res) =>
      res.send(jsecrets.get("databaseSecret", "database"))
    );

    app.get("/jwt_signing_key", (req, res) =>
      res.send(jsecrets.get("anotherSecret", "jwt_signing_key"))
    );

    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  } catch (e) {
    console.log(e.message);
  }
})();
