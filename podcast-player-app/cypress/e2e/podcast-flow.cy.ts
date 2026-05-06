describe('Podcast discovery flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/search*', {
      body: {
        resultCount: 1,
        results: [
          {
            artistName: 'The Music Lab',
            artworkUrl100: 'https://example.com/100x100bb.jpg',
            collectionId: 123,
            collectionName: 'Music Lab Podcast',
            primaryGenreName: 'Music',
            trackCount: 12,
            wrapperType: 'track',
          },
        ],
      },
    }).as('searchPodcasts')

    cy.intercept('GET', '**/lookup*', {
      body: {
        resultCount: 2,
        results: [
          {
            artistName: 'The Music Lab',
            artworkUrl100: 'https://example.com/100x100bb.jpg',
            collectionId: 123,
            collectionName: 'Music Lab Podcast',
            primaryGenreName: 'Music',
            trackCount: 12,
            wrapperType: 'track',
          },
          {
            description: 'A practical episode about podcast production.',
            kind: 'podcast-episode',
            previewUrl: 'https://example.com/audio.mp3',
            releaseDate: '2026-01-01T00:00:00Z',
            trackId: 456,
            trackName: 'Building better podcasts',
            trackTimeMillis: 1800000,
          },
        ],
      },
    }).as('lookupPodcast')
  })

  it('searches podcasts, opens detail and returns to the list', () => {
    cy.visit('/podcasts')

    cy.contains('h1', 'Discover music podcasts').should('be.visible')
    cy.contains('Music Lab Podcast').should('be.visible')

    cy.get('input#podcast-search').clear()
    cy.get('input#podcast-search').type('jazz')

    cy.wait('@searchPodcasts')
    cy.contains('Music Lab Podcast').click()

    cy.wait('@lookupPodcast')
    cy.contains('h1', 'Music Lab Podcast').should('be.visible')
    cy.contains('Building better podcasts').should('be.visible')
    cy.get('audio[controls]').should('have.attr', 'src', 'https://example.com/audio.mp3')

    cy.contains('a', 'Back to search').click()
    cy.contains('h1', 'Discover music podcasts').should('be.visible')
  })
})
