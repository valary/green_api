import type { ConnectionState, SessionState } from './types'

export const initialSession: SessionState = { current: null }

export const initialConnection: ConnectionState = {
  online: true,
  fatalError: null,
  problem: null,
  settingsWarning: null,
  receivingElsewhere: false,
}
