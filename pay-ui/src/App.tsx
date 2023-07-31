import { ReactNode, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { BrowserRouter, useLocation, useNavigate, useRoutes } from "react-router-dom";
import styled from "styled-components";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import routeConfig from "./common/route/RouteConfig";
import GlobalNavObj from "./common/GlobalNavObj";
import HandleRequests from "./messageManager/requestHandlers/HandleRequests";

type WrapperProps = {
    children: ReactNode;
};
const Wrapper = ({ children }: WrapperProps) => {
    const location = useLocation();
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return <StyledContainer>{children}</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "pay-ui-root" })`
    max-width: 568px;
    /* min-width: 350px; */
    width: 90%;
    max-height: 800px;
    height: 65vh;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 2px 2px 16px #8f8f8f66;
`;

function Index() {
    const element = useRoutes(routeConfig);
    const navigate = useNavigate();

    useEffect(() => {
        const messageHandler = (event: any) => {
            console.log("request message listener: ", event);
            HandleRequests(event, navigate);
        };

        window.addEventListener("message", messageHandler);
        return () => {
            window.removeEventListener("message", messageHandler);
        };
    }, [navigate]);

    useEffect(() => {
        GlobalNavObj.navigate = navigate;
    }, [navigate]);

    return (
        <ErrorBoundary>
            <Wrapper>{element}</Wrapper>
        </ErrorBoundary>
    );
}

function App() {
    useEffect(() => {
        (window as any).buyWithCrypto.init({
            appId: "rBBXvVZq0eSnZZ2pliYiCfeOkx43-jcUrmUedFydsUfr2itcR",
            appKey: "testk",
        });
    }, []);
    return (
        <BrowserRouter>
            <AppRootStyledContainer>
                <Index />
            </AppRootStyledContainer>
        </BrowserRouter>
    );
}

const AppRootStyledContainer = styled.div.attrs({ className: "app-root" })`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
`;

export default App;
