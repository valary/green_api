import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { expect, it, vi } from 'vitest'
import { mockInstance } from '@/shared/api/mocks/mockInstance'
import { DEMO_CREDENTIALS } from '@/shared/config'
import { lightTheme } from '@/shared/theme'
import { routes } from './router/routes'
import { createStore } from './store'

function renderApp() {
  const router = createMemoryRouter(routes)
  render(
    <Provider store={createStore()}>
      <ThemeProvider theme={lightTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
  return router
}

it('вход → новый чат → отправка → ответ приходит в тот же чат → выход', async () => {
  const user = userEvent.setup()
  const router = renderApp()

  await user.type(screen.getByLabelText('idInstance'), DEMO_CREDENTIALS.idInstance)
  await user.type(screen.getByLabelText('apiTokenInstance'), DEMO_CREDENTIALS.apiTokenInstance)
  await user.clear(screen.getByLabelText('apiUrl'))
  await user.type(screen.getByLabelText('apiUrl'), DEMO_CREDENTIALS.apiUrl)
  await user.click(screen.getByRole('button', { name: 'Войти' }))

  expect(await screen.findByText('Чатов пока нет')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Новый чат' }))
  await user.type(screen.getByLabelText('Номер телефона'), '+7 (900) 123-45-67{Enter}')
  expect(await screen.findByRole('heading', { name: '+7 900 123-45-67' })).toBeInTheDocument()

  await user.type(screen.getByLabelText('Сообщение'), 'Тест{Enter}')
  const feed = screen.getByRole('log')
  expect(within(feed).getByText('Тест')).toBeInTheDocument()
  expect(await within(feed).findByText('Привет! Сообщение пришло, отвечаю из Telegram')).toBeInTheDocument()
  expect(await within(feed).findByLabelText('Прочитано')).toBeInTheDocument()
  await vi.waitFor(() => expect(mockInstance.queue).toHaveLength(0))

  await user.click(screen.getByRole('button', { name: 'Выйти' }))
  expect(await screen.findByRole('heading', { name: 'Вход по данным GREEN-API' })).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/')
  expect(sessionStorage.length + localStorage.length).toBe(0)
}, 15_000)
