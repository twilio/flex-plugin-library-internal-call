import { createSlice } from '@reduxjs/toolkit';
import * as Flex from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ConnectingParticipant } from '../../types/ConnectingParticipant';

export interface ConferenceState {
  connectingParticipants: Array<ConnectingParticipant>;
}

const initialState = { connectingParticipants: [] } as ConferenceState;

const conferenceSlice = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    addConnectingParticipant(state, action: PayloadAction<ConnectingParticipant>) {
      state.connectingParticipants.push(action.payload);
    },
    removeConnectingParticipant(state, action: PayloadAction<string>) {
      const participantIndex = state.connectingParticipants.findIndex((p) => p.callSid == action.payload);

      if (participantIndex >= 0) {
        state.connectingParticipants.splice(participantIndex, 1);
      }
    },
  },
});

export const { addConnectingParticipant, removeConnectingParticipant } = conferenceSlice.actions;

// Register your redux store under a unique namespace
export const reduxNamespace = 'conference';

// Extend this payload to be of type that your ReduxAction is
// Normally you'd follow this pattern...https://redux.js.org/recipes/usage-with-typescript#a-practical-example
// But that breaks the typing when adding the reducer to Flex, so no payload intellisense for you!
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: Flex.AppState;
  [reduxNamespace]: ConferenceState;
}

// Combine the reducers
export default combineReducers({ conference: conferenceSlice.reducer });
