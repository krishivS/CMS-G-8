describe('Homepage', () => {
    it('loads successfully', () => {
      cy.visit('http://localhost:5173'); // update port if different
      cy.contains('Welcome'); // replace with text from your page
    });
  });
  