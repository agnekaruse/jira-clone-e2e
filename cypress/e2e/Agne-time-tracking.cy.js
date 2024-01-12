describe("Automation tests for time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("Click on an issue to see what's behind it.").click();
      });
  });

  const IssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const Stopwatch = '[data-testid="icon:stopwatch"]';
  const TimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');

  const estimatedTime = "10";
  const estimatedTimeUpdated = "20";
  const loggedTime = "2";
  const remainingTime = "5";
  const timeSpent = "Time spent (hours)";
  const timeRemaining = "Time remaining (hours)";
  const updatedRemainingTime = "5";

  it("Should add, edit and delete estimation time", () => {
    IssueDetailsModal().within(() => {
      cy.get('[placeholder="Number"]').click().clear().type(estimatedTime);

      cy.contains("div", "10h estimated").should("be.visible");

      cy.get('[placeholder="Number"]')
        .click()
        .clear()
        .type(estimatedTimeUpdated);

      cy.contains("div", "20h estimated").should("be.visible");

      cy.get('[placeholder="Number"]').click().clear();

      cy.contains("div", "20h estimated").should("not.exist");
    });
  });

  it("Timetracking. Should log time and remove logged time", () => {
    IssueDetailsModal;
    cy.get(Stopwatch).click();

    cy.contains(timeSpent);
    cy.get('[placeholder="Number"][value="2"]').clear().type(loggedTime);
    cy.contains(timeRemaining);
    cy.get('[placeholder="Number"][value=""]').clear().type(remainingTime);
    cy.contains("button", "Done").click().should("not.exist");

    //Check that the new value is visible.
    cy.contains("div", "2h logged").should("be.visible");
    cy.contains("div", "5h remaining").should("be.visible");

    //Delete logged time
    IssueDetailsModal;
    cy.get(Stopwatch).click();

    cy.contains(timeSpent);
    cy.get('input[placeholder="Number"][value="2"]').clear();
    cy.contains(timeRemaining);
    cy.get('[placeholder="Number"]').last().click().clear();
    cy.contains("button", "Done").click().should("not.exist");

    cy.contains(updatedRemainingTime);
    cy.contains("div", "5h estimated").should("be.visible");
  });
});
