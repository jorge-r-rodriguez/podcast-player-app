const runLivePagesSpec = Cypress.env('LIVE_PAGES') === true
const describeLivePages = runLivePagesSpec ? describe : describe.skip

describeLivePages('Live GitHub Pages podcast detail', () => {
  it('loads the shared podcast detail URL with real iTunes data', () => {
    cy.visit('/#/podcasts/1646101002')

    cy.contains('Unable to load podcasts').should('not.exist')
    cy.contains('The Mel Robbins Podcast', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="episode-results-scroll"] article').should('have.length.greaterThan', 0)
    cy.get('button[aria-label^="Play first episode:"]').click()
    cy.get('audio').should('have.attr', 'src').and('include', '.mp3')
    cy.get('button[aria-label="Pause playback"]').should('be.visible')
  })
})
