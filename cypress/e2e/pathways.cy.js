describe('Pathways of Pacifica page', () => {
  it('renders and allows focusing a pathway', () => {
    cy.visit('/pathways');

    cy.contains('From All Neighborhoods, Toward Lives of Purpose').should('be.visible');
    cy.get('button[aria-label="Focus pathway for Student A"]').click();
    cy.contains('Focused Pathway').should('be.visible');
    cy.contains('Reset to all pathways').should('be.visible');
  });
});
