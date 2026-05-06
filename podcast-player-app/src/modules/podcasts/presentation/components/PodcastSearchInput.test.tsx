import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PodcastSearchInput } from './PodcastSearchInput'

describe('PodcastSearchInput', () => {
  it('renders an accessible search input and emits changes', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(<PodcastSearchInput onChange={onChange} value="" />)

    await user.type(screen.getByLabelText(/search podcasts/i), 'jazz')

    expect(onChange).toHaveBeenCalledWith('j')
    expect(onChange).toHaveBeenCalledWith('a')
    expect(onChange).toHaveBeenCalledWith('z')
  })
})
