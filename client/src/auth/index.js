import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    SHOW_ERROR: "SHOW_ERROR",
    HIDE_ERROR: "HIDE_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        err: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    err: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    err: null
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    err: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    err: null
                })
            }
            case AuthActionType.SHOW_ERROR: {
                return setAuth({
                    // user: payload.user,
                    // loggedIn: auth.loggedIn,
                    err: payload.err
                })
            }
            case AuthActionType.HIDE_ERROR: {
                return setAuth({
                    // user: payload.user,
                    // loggedIn: false,
                    err: null
                })
            }
            default:
                return auth;
        }
    }

    auth.hideError = function() {
        authReducer({
            type: AuthActionType.HIDE_ERROR,
            payload: null
        })
    }

    auth.loginUser = async function (userData, store) {
        try{
            const response = await api.loginUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                })
                history.push("/");
                if(typeof lastname !== "undefined"){
                    store.loadIdNamePairs();
                }
            }
        } catch (err){
            authReducer({
                type: AuthActionType.SHOW_ERROR,
                payload: {
                    // user: response.data.user,
                    err: err.response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
            // if(typeof lastname !== "undefined"){
            //     store.loadIdNamePairs();
            // }
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    auth.registerUser = async function(userData, store) {
        try{
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        } catch(err){
            authReducer({
                type: AuthActionType.SHOW_ERROR,
                payload: {
                    // user: response.data.user,
                    err: err.response.data.errorMessage
                }
            })
        }
        
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };