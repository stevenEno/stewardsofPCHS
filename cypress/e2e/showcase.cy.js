describe('Student showcase page', () => {
  beforeEach(() => {
    cy.fixture('github-projects.json').then((fixture) => {
      cy.intercept('GET', '**/repos/*/*/contents/projects*', {
        statusCode: 200,
        body: fixture.folders
      });

      Object.entries(fixture.metadata).forEach(([slug, metadata]) => {
        cy.intercept('GET', `**/repos/*/*/contents/projects/${slug}/project.json*`, {
          statusCode: 200,
          body: {
            content: btoa(JSON.stringify(metadata))
          }
        });

        cy.intercept('GET', `**/repos/*/*/contents/projects/${slug}*`, {
          statusCode: 200,
          body: [
            { name: 'thumbnail.jpg', download_url: `https://cdn/${slug}-thumb.jpg` },
            { name: 'demo.mp4', download_url: `https://cdn/${slug}-demo.mp4` }
          ]
        });
      });
    });

    cy.visit('/');
  });

  it('loads and displays the highlighted project', () => {
    cy.contains('Student Projects Showcase').should('be.visible');
    cy.contains('Weather App').should('be.visible');
  });

  it('opens modal from a thumbnail click', () => {
    cy.contains('History Timeline').click();
    cy.get('[role="dialog"]').should('exist');
    cy.contains('View GitHub branch / PR').should('exist');
  });

  it('filters projects by search', () => {
    cy.get('input[aria-label="Search projects by project name or student name"]').type('Leah');
    cy.contains('History Timeline').should('be.visible');
    cy.contains('Weather App').should('not.exist');
  });
});
