import IssueModal from "../pages/IssueModal";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(
          "You can use rich text with images in issue descriptions."
        ).click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const comment = "Agne edited this comment";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .click()
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });
});

it("Test Combination: Should add, edit and delete a comment successfully", () => {
  const editedcomment = "Edit this comment";

  //add a comment
  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="issue-comment"]').first();

    cy.contains("Add a comment...").click();
    cy.get('textarea[placeholder="Add a comment..."]').click().type(comment);

    cy.contains("button", "Save").click().should("not.exist");

    cy.contains("Add a comment...").should("exist");
    cy.get('[data-testid="issue-comment"]').should("contain", comment);
  });

  //Edit the added comment.
  cy.get('[data-testid="issue-comment"]').first().contains("Edit").click();
  cy.get('[placeholder="Add a comment..."]').clear().type(editedcomment);
  cy.contains("button", "Save").click().should("not.exist");

  cy.reload();
  cy.get('[data-testid="issue-comment"]').should("contain", editedcomment);

  //Delete the comment.
  cy.get('[data-testid="issue-comment"]').first().contains("Delete").click();

  cy.get('[data-testid="modal:confirm"]').within(() => {
    cy.contains("Are you sure you want to delete this issue?").should(
      "be.visible"
    );
    cy.contains("Once you delete, it's gone for good").should("be.visible");
    cy.contains("Delete comment").click();
  });
  cy.get('[data-testid="modal:confirm"]').should("not.exist");

  cy.get('[data-testid="board-list:backlog')
    .should("be.visible")
    .and("have.length", "1");

  cy.reload();
  cy.get('[data-testid="issue-comment"]')
    .contains(editedcomment)
    .should("not.exist");
});
