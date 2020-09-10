import * as types from "./types";

export const saveCredentials = (roles) => ({
    type: types.SAVE_CREDENTIALS,
    payload: roles
});
