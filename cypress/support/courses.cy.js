describe('Courses Page', () => {
    it('should display the Add Course button', () => {
      cy.visit('http://localhost:5173/courses'); // update the URL if needed
      cy.get('button.btn.btn-primary').should('contain', 'Add Course');
    });
  
    it('should open the form when Add Course is clicked', () => {
      cy.visit('http://localhost:3000/courses');
      cy.get('button.btn.btn-primary').click();
      
      // Assuming the form shows an input or heading like "Add New Course"
      cy.contains('Add New Course'); // change this text to match what appears
    });
  });
  