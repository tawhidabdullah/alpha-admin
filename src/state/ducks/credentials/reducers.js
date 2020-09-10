import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    isAuthenticated: bool,
    redirectAfterLogin: string
}
*/

const globalState = createReducer({})({
  [types.SAVE_CREDENTIALS]: (state, action) => {
    const credentials = action.payload;
    return credentials;
  },
});

export default globalState; 