describe('Podcast discovery flow', () => {
  beforeEach(() => {
    const podcastResults = Array.from({ length: 12 }, (_, index) => ({
      artistName: 'The Music Lab',
      artworkUrl100: `https://example.com/${index + 1}/100x100bb.jpg`,
      collectionId: 123 + index,
      collectionName: index === 0 ? 'Music Lab Podcast' : `Music Lab Podcast ${index + 1}`,
      primaryGenreName: 'Music',
      trackCount: 12,
      wrapperType: 'track',
    }))

    const episodeResults = Array.from({ length: 10 }, (_, index) => ({
      description: 'A practical episode about podcast production.',
      kind: 'podcast-episode',
      previewUrl: `https://example.com/audio-${index + 1}.mp3`,
      releaseDate: '2026-01-01T00:00:00Z',
      trackId: 456 + index,
      trackName: index === 0 ? 'Building better podcasts' : `Building better podcasts ${index + 1}`,
      trackTimeMillis: 1800000,
    }))

    cy.intercept('GET', 'https://itunes.apple.com/search*', {
      body: {
        resultCount: podcastResults.length,
        results: podcastResults,
      },
    }).as('searchPodcasts')

    cy.intercept('GET', 'https://itunes.apple.com/lookup*', {
      body: {
        resultCount: episodeResults.length + 1,
        results: [podcastResults[0], ...episodeResults],
      },
    }).as('lookupPodcast')
  })

  it('searches podcasts, opens detail and returns to the list', () => {
    cy.visit('/podcasts')

    cy.get('input#podcast-search').should('be.visible')
    cy.contains('Music Lab Podcast').should('be.visible')
    cy.get('[data-testid="podcast-results-scroll"]').should(($element) => {
      expect($element[0].scrollHeight).to.be.greaterThan($element[0].clientHeight)
    })
    cy.get('[data-testid="podcast-results-scroll"]').scrollTo('bottom')
    cy.contains('Music Lab Podcast 12').should('be.visible')
    cy.get('[data-testid="podcast-results-scroll"]').scrollTo('top')

    cy.get('input#podcast-search').clear()
    cy.get('input#podcast-search').type('jazz')

    cy.wait('@searchPodcasts')
    cy.contains('Music Lab Podcast').click()

    cy.wait('@lookupPodcast')
    cy.contains('Music Lab Podcast').should('be.visible')
    cy.contains('Building better podcasts').should('be.visible')
    cy.get('[data-testid="episode-results-scroll"]').should(($element) => {
      expect($element[0].scrollHeight).to.be.greaterThan($element[0].clientHeight)
    })
    cy.get('button[aria-label="Play Building better podcasts 2"]').click()
    cy.get('audio').should('have.attr', 'src', 'https://example.com/audio-2.mp3')
    cy.get('[data-testid="episode-results-scroll"]').scrollTo('bottom')
    cy.contains('Building better podcasts 10').should('be.visible')
    cy.get('body').type('{esc}')
    cy.get('a[aria-label="Back to search"]').click()
    cy.get('input#podcast-search').should('be.visible')
  })
})
