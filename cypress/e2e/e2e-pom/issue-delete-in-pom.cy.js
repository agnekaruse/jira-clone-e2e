/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //open issue detail modal with title from line 16  
    cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';
 

  it("Should delete issue successfully", () => {

    // Click on the Delete button and confrim deletion
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    // Check that issue is no longer visible on board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.validateAmountOfIssuesInBacklog = 3;

    //Click on Delete button and then Cancel deletion
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
  });
});

