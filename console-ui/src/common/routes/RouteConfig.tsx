import React from "react";
import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";
import FirebaseManager from "../firebase/FirebaseManager";
import { Navigate } from "react-router-dom";
import EmailVerifyPage from "../../views/EmailVerify";

interface RouteComponentOrElement {
    Component?: React.ComponentType;
    element?: React.ReactNode;
}

const guardedComponent = (pageComponent: React.ComponentType): RouteComponentOrElement => {
    // make sure firebase inited
    FirebaseManager.init();
    if (!FirebaseManager?.auth?.currentUser) {
        return { element: <Navigate to={"/auth"} replace /> };
    }
    return { Component: pageComponent };
};

const routeConfig = [
    { path: "/auth", Component: AuthPage },
    { path: "/emailVerify", ...guardedComponent(EmailVerifyPage) },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
