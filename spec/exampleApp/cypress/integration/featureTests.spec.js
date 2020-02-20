context("jsecrets Feature tests", () => {
  describe("The '/database' route", () => {
    it("should show the database secret id", () => {
      cy.visit("/database");
      cy.get("body").should("contain", "jsecrets_node_app");
    });
  });

  describe("The '/jwt_signing_key' route", () => {
    it("should show the database secret id", () => {
      cy.visit("/jwt_signing_key");
      cy.get("body").should("contain", "jsecret_signing");
    });
  });
});
