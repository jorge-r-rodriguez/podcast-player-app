describe('Podcast app shell', () => {
  it('loads the podcast search route', () => {
    cy.visit('/podcasts')
    cy.contains('h1', 'Discover music podcasts').should('be.visible')
  })
})
