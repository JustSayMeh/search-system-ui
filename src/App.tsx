import React, {useState} from 'react';
import './App.css';
import {Header} from "./Header";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {WatchPage} from "./WatchPage";
import SearchPanel from "./panels/searchPanel/SearchPanel";
import {Worker} from "@react-pdf-viewer/core";
import {ICsrfToken} from "./api/interfaces/ICsrfToken";
import {Login} from "./Login";
import {SecureApi} from "./api/SecureApi";
import {AdminPanel} from "./AdminPanel";
import UserContext from "./context/UserContext";
import {message, Spin} from "antd";

function App() {
    let [userInfo, setUserInfo] = useState<ICsrfToken | null>();
    let [isLoad, setIsLoad] = useState<boolean>(true);
    const value = {userInfo, setUserInfo};

    let api = new SecureApi();
    const fetchToken = () => {
        setIsLoad(true);
        api.getCsrfToken()
            .then(value => {
                setUserInfo(value);
            })
            .catch(() => Promise.reject())
            .finally(() => setIsLoad(false));
    }
    const onLogin = (value: FormData) => {
        api.login(value)
            .then(value => {
                fetchToken();
            })
            .catch((e) => {
                message.error(e);
            })
    }
    const onLogout = () => {
        setUserInfo(null);
    }
    React.useEffect(() => {
        fetchToken();
    }, []);
    return (
        <UserContext.Provider value={value}>
            {!isLoad && <Router>
                <Switch>
                    {userInfo &&
                    <Switch>
                        <Route path={"/login"}>
                            <Redirect to="/"/>
                        </Route>
                        {userInfo.admin &&
                        <Route path={"/adminpanel"}>
                            <AdminPanel/>
                        </Route>
                        }
                        <Route path="/watch/:domain/:docname">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                                <WatchPage/>
                            </Worker>
                        </Route>
                        <Route path={"/"}>
                            <Header name={userInfo.name} onLogout={onLogout}/>
                            <SearchPanel/>
                        </Route>
                    </Switch>
                    }
                    {!userInfo &&
                    <Route path={"/login"}>
                        <Login onLogin={onLogin}/>
                    </Route>
                    }
                    {!userInfo && <Redirect to="/login"/>}
                </Switch>
            </Router>
            }
            {isLoad && <div style={{
                position: "fixed",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Spin size="large"/>
            </div>}
        </UserContext.Provider>
    );
}

export default App;
