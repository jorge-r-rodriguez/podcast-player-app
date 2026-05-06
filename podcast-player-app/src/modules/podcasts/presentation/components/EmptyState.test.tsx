import { render, screen } from '@testing-library/react'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState description="Try another query." title="No podcasts found" />)

    expect(screen.getByRole('heading', { name: /no podcasts found/i })).toBeInTheDocument()
    expect(screen.getByText(/try another query/i)).toBeInTheDocument()
  })
})
