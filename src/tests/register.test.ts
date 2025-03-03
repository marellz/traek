import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import '@testing-library/jest-dom/vitest'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'node:test'
import { createApp } from 'vue'
// import { faker } from '@faker-js/faker'
import router from '@/router'
import Register from '@/views/auth/register.vue'
const app = createApp({})
app.use(createPinia())

describe('Testing user registration', () => {
  beforeEach(() => {
    router.push('/register')
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should show registration form', () => {
    render(Register, {
      global: {
        plugins: [router],
      },
    })

    expect(screen.getByText('Join Our Platform')).toBeInTheDocument()
  })

  it('should show form', () => {
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('should show error message if email is invalid', async () => {
    const emailField = screen.getByTestId(/email/i)
    // const password = screen.getByLabelText(/email/i)
    await fireEvent.focus(emailField)
    await fireEvent.blur(emailField)
    setTimeout(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    }, 100)
  })

  it('should show error message if password is empty', async () => {
    console.log('password')
    const passwordField = screen.getByTestId(/password/i)
    await fireEvent.focus(passwordField)
    await fireEvent.blur(passwordField)
    setTimeout(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    }, 100)

    await fireEvent.update(passwordField, '123')
    await fireEvent.blur(passwordField)
  })

  it('should show error message if password is short', async () => {
    console.log('password')
    const passwordField = screen.getByTestId(/password/i)

    await fireEvent.update(passwordField, '123')
    await fireEvent.blur(passwordField)

    setTimeout(() => {
      expect(screen.getByText('password must be at least 8 characters')).toBeInTheDocument()
    }, 100)
  })
})
