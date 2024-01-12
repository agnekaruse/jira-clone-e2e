const issueTitle = "This is an issue of type:Task";

describe("Issue deletion functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Test Case 1: Deleting issue", () => {
    //Check that the issue is visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    //Click the "Trash icon" and delete the issue
    cy.get('[data-testid="icon:trash"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");

    //Chech that the confirmation message is displayed
    cy.get('[data-testid="modal:confirm"]').contains(
      "Are you sure you want to delete this issue?"
    );

    cy.get('[data-testid="modal:confirm"]')
      .contains("Delete issue")
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");

    cy.get('[data-testid="modal:issue-details"]').should("not.exist");

    //Check that the issue is deleted
    cy.reload();
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });
});

describe("Test Case 2: Issue Deletion Cancellation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Issue Deletion Cancellation", () => {
    //Check that the issue is visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    //Click the "Trash icon" and delete the issue
    cy.get('[data-testid="icon:trash"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");

    //Chech that the confirmation message is displayed
    cy.get('[data-testid="modal:confirm"]').contains(
      "Are you sure you want to delete this issue?"
    );

    cy.get('[data-testid="modal:confirm"]')
      .contains("Cancel")
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");
  });
});
