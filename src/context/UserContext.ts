import React from "react";
import {ICsrfToken} from "../api/interfaces/ICsrfToken";
interface IUserContext {
    userInfo: ICsrfToken | null | undefined,
    setUserInfo: (value: ICsrfToken) => void;
}
// set the defaults
const UserContext = React.createContext<IUserContext>({
    userInfo: null,
    setUserInfo: (value) => {}
});

export default UserContext;