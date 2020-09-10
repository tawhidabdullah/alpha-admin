import { combineReducers } from 'redux';
import * as types from './types';
import { createReducer } from '../../utils';

/* State shape
{
    isAuthenticated: bool,
    redirectAfterLogin: string
}
*/

const globalState = createReducer([])({
  [types.SAVE_ROLES]: (state, action) => {
    const roles = action.payload;
    return [...roles];
  },
});

export default globalState; 