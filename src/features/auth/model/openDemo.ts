import { DEMO_CREDENTIALS, type DemoScenario } from '@/shared/config'
import { createAppAsyncThunk } from '@/shared/lib/redux'
import { signIn } from './signIn'

// MSW нужен только в демо, поэтому воркер и хендлеры приезжают отдельным чанком.
export async function startDemo(scenario: DemoScenario) {
  const mocks = await import('@/shared/api/mocks/browser')
  await mocks.startDemo(scenario)
}

export const openDemo = createAppAsyncThunk('auth/openDemo', async (scenario: DemoScenario, { dispatch }) => {
  await startDemo(scenario)
  await dispatch(signIn({ credentials: DEMO_CREDENTIALS, remember: false, mode: 'demo', scenario })).unwrap()
})
