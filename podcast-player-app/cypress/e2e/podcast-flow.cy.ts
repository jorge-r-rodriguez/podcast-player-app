describe('Podcast discovery flow', () => {
  beforeEach(() => {
    const podcastResults = Array.from({ length: 12 }, (_, index) => ({
      artistName: 'The Music Lab',
      artworkUrl100: `https://example.com/${index + 1}/100x100bb.jpg`,
      collectionId: 123 + index,
      collectionName:
        index === 0
          ? 'Music Lab Podcast'
          : index === 11
            ? 'Alpha Music Podcast'
            : `Music Lab Podcast ${index + 1}`,
      primaryGenreName: 'Music',
      trackCount: index + 1,
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

    cy.on('window:before:load', (window) => {
      const mediaWindow = window as unknown as {
        HTMLMediaElement: {
          prototype: {
            pause: () => void
            play: () => Promise<void>
          }
        }
      }

      mediaWindow.HTMLMediaElement.prototype.play = () => Promise.resolve()
      mediaWindow.HTMLMediaElement.prototype.pause = () => undefined
    })
  })

  it('searches podcasts, opens detail and returns to the list', () => {
    cy.viewport(1440, 900)
    cy.visit('/podcasts')

    cy.get('input#podcast-search').should('be.visible')
    cy.contains('Music Lab Podcast').should('be.visible')
    cy.get('[data-testid="podcast-results-scroll"]').should(($element) => {
      expect($element[0].scrollHeight).to.be.greaterThan($element[0].clientHeight)
    })
    cy.get('[data-testid="podcast-results-scroll"]').scrollTo('bottom')
    cy.contains('Alpha Music Podcast').should('be.visible')
    cy.get('[data-testid="podcast-results-scroll"]').scrollTo('top')
    cy.contains('Order by').click()
    cy.get('[role="menu"]').contains('Episodes').click()
    cy.get('[data-testid="podcast-results-scroll"] article')
      .first()
      .should('contain.text', 'Alpha Music Podcast')

    cy.get('input#podcast-search').clear()
    cy.get('input#podcast-search').type('jazz')

    cy.wait('@searchPodcasts')
    cy.contains('Music Lab Podcast').click()

    cy.wait('@lookupPodcast')
    cy.contains('Music Lab Podcast').should('be.visible')
    cy.contains('Building better podcasts').should('be.visible')
    cy.contains('Order by').click()
    cy.get('[role="menu"]').contains('Title').click()
    cy.get('[data-testid="episode-results-scroll"] article')
      .first()
      .should('contain.text', 'Building better podcasts')
    cy.get('[data-testid="episode-results-scroll"]').should(($element) => {
      expect($element[0].scrollHeight).to.be.greaterThan($element[0].clientHeight)
    })
    cy.get('button[aria-label="Play Building better podcasts 2"]').click()
    cy.get('audio').should('have.attr', 'src', 'https://example.com/audio-2.mp3')
    cy.get('button[aria-label="Pause playback"]').should('be.visible')
    cy.get('button[aria-label="Next episode"]').click()
    cy.get('audio').should('have.attr', 'src', 'https://example.com/audio-3.mp3')
    cy.get('button[aria-label="Previous episode"]').click()
    cy.get('audio').should('have.attr', 'src', 'https://example.com/audio-2.mp3')
    cy.get('button[aria-label="Enable repeat"]').click()
    cy.get('button[aria-label="Disable repeat"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('input[aria-label="Playback volume"]')
      .invoke('val', 0.25)
      .trigger('input', { target: { value: 0.25 } })
    cy.get('audio').should(($audio) => {
      expect(($audio[0] as { volume: number }).volume).to.be.lessThan(0.85)
    })
    cy.get('input#podcast-search').clear()
    cy.get('input#podcast-search').type('10')
    cy.get('[data-testid="episode-results-scroll"]')
      .should('contain.text', 'Building better podcasts 10')
      .and('not.contain.text', 'Building better podcasts 2')
    cy.get('input#podcast-search').clear()
    cy.get('[data-testid="episode-results-scroll"]').scrollTo('bottom')
    cy.contains('Building better podcasts 10').should('be.visible')
    cy.get('body').type('{esc}')
    cy.get('a[aria-label="Back to search"]').click()
    cy.get('input#podcast-search').should('be.visible')
  })

  it('keeps playback controls usable on mobile', () => {
    cy.viewport(390, 844)
    cy.visit('/podcasts')

    cy.contains('Music Lab Podcast').click()
    cy.wait('@lookupPodcast')

    cy.get('button[aria-label="Shuffle episode"]').should('be.visible')
    cy.get('button[aria-label="Previous episode"]').should('be.visible')
    cy.get('button[aria-label="Play playback"]').should('be.visible')
    cy.get('button[aria-label="Next episode"]').should('be.visible')
    cy.get('button[aria-label="Enable repeat"]').should('be.visible')
    cy.get('aside').should(($player) => {
      const rect = $player[0].getBoundingClientRect()

      expect(rect.left).to.equal(0)
      expect(rect.right).to.equal(390)
    })

    cy.get('button[aria-label="Play Building better podcasts 2"]').click()
    cy.get('button[aria-label="Pause playback"]').should('be.visible')
    cy.get('[data-testid="episode-results-scroll"]').should(($element) => {
      expect($element[0].clientHeight).to.be.greaterThan(100)
      expect($element[0].scrollHeight).to.be.greaterThan($element[0].clientHeight)
    })
    cy.get('[data-testid="episode-results-scroll"]').scrollTo('bottom')
    cy.contains('Building better podcasts 10').should('be.visible')
  })
})
