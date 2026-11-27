import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MOCK_CREDENTIALS } from '@/mocks/constants'
import { useAuthStore } from '@/stores/auth-store'
import { NAVIGATED_TEXT, renderWithProviders } from '@/test/render'

import { LoginForm } from './login-form'

const renderLoginForm = () => renderWithProviders(<LoginForm redirectTo="/users?page=2" />, { initialPath: '/login' })

describe('LoginForm', () => {
  it('shows required errors when submitted empty', async () => {
    const { user } = renderLoginForm()

    await user.click(await screen.findByRole('button', { name: 'Sign in' }))

    expect(await screen.findAllByText('This field is required')).toHaveLength(2)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('shows an alert and clears the password on wrong credentials', async () => {
    const { user } = renderLoginForm()

    await user.type(await screen.findByLabelText(/Username/), 'admin')
    await user.type(screen.getByLabelText(/^Password/), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password/)).toHaveValue('')
  })

  it('stores tokens and redirects after a successful login', async () => {
    const { user, router } = renderLoginForm()

    await user.type(await screen.findByLabelText(/Username/), MOCK_CREDENTIALS.username)
    await user.type(screen.getByLabelText(/^Password/), MOCK_CREDENTIALS.password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText(NAVIGATED_TEXT)).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.href).toBe('/users?page=2'))
    expect(useAuthStore.getState().accessToken).toMatch(/^mock-access\./)
  })
})
