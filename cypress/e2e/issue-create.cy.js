import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      // System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => { 
      // Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');
      
      // Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
      // Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
    });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});

describe('Test case 1:Add more issues', () => {
  //Modify the test case as follows:
  it('Title: "Bug"', () => {
    cy.visit('/');
    cy.get('[data-testid="icon:plus"]').click()

  //Description: “My bug description”
  cy.get('.ql-editor').type('My bug description');

  //Issue type: “Bug”
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Bug"]')
      .trigger('click');

  //Priority: “Highest”
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Highest"]')
      .trigger('click');

  //Reporter: “Pickle Rick”
  cy.get('[data-testid="select:userIds"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]')
  .trigger('click')
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]')
  .trigger('click')
  cy.get('[data-testid="icon:story"]').should('be.visible');

  //Title "Bug"
  cy.get('[data-testid="form-field:title"]').type('Bug')

  //Assert that the issue has been created and is visible on the board
  cy.get('button[type="submit"]').click();
});
});

describe('Test case 2: Use Random Data Generator', () => {
  it('Use the random data plugin for a single word', () => {
    cy.visit('/');
    cy.get('[data-testid="icon:plus"]').click()

  //Description: use random text for description
  const issueDescription = faker.lorem.sentence()
  cy.get('.ql-editor').type(issueDescription);

  //Issue type: "Task”
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:Story"]')
    .wait(1000)
    .trigger('mouseover')
    .trigger('click');
  cy.get('[data-testid="icon:story"]').should('be.visible');

  //Priority: “Low”
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Low"]')
      .trigger('click');

  //Reporter: “Baby Yoda”
  cy.get('[data-testid="select:userIds"]').click();
  cy.get('[data-testid="select-option:Baby Yoda"]')
  .trigger('click')
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Baby Yoda"]')
  .trigger('click')
  cy.get('[data-testid="icon:story"]').should('be.visible');

  //Title: generate random word
  const issueTitle = faker.lorem.words()
  cy.get('[data-testid="form-field:title"]').type(issueTitle)

  //Assert that the issue has been created and is visible on the board
  cy.get('button[type="submit"]').click();
    
  });
  
});
