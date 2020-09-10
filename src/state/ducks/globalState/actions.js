import * as types from "./types";

export const saveRoles = (roles) => ({
    type: types.SAVE_ROLES,
    payload: roles
});
