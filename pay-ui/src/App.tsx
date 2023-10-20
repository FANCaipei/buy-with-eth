import { ReactNode, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { BrowserRouter, useLocation, useNavigate, useRoutes } from "react-router-dom";
import styled from "styled-components";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import routeConfig from "./common/route/RouteConfig";
import GlobalNavObj from "./common/GlobalNavObj";
import HandleRequests from "./messageManager/requestHandlers/HandleRequests";
import useUrlParamsConfig from "./common/golbalStates/urlParamsConfigState";
import { Spin } from "antd";
import LoadingIndicator from "./common/components/LoadingIndicator";
import useAuthorityCheck from "./common/golbalStates/authorityCheckState";
import DisableDevtool from "disable-devtool";

// 设置全局spin的indicator
Spin.setDefaultIndicator(<LoadingIndicator indicatorWidth="40px" />);

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
    width: 100%;
    height: 100%;
    max-height: 800px;
    /* height: 65vh; */
    background-color: #fff;
    /* border-radius: 16px; */
    /* box-shadow: 2px 2px 16px #8f8f8f66; */
`;

function Index() {
    const element = useRoutes(routeConfig);
    const canAccessProject = useAuthorityCheck((state: any) => state.canAccessProject);
    const navigate = useNavigate();

    useEffect(() => {
        if (!canAccessProject) {
            navigate("/access-deny", { replace: true });
        }
    }, [navigate, canAccessProject]);

    useEffect(() => {
        if (!(window as any).OcelotPay.appId) {
            navigate("/app-id-missing", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const messageHandler = (event: any) => {
            // console.log("request message listener: ", event);
            HandleRequests(event, navigate);
        };

        window.addEventListener("message", messageHandler);
        (window as any).isPayUIReady = true;
        return () => {
            window.removeEventListener("message", messageHandler);
            (window as any).isPayUIReady = false;
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

function App({ appConfigs }: { appConfigs: any }) {
    const initParamsFromUrl = useUrlParamsConfig((state: any) => state.initParamsFromUrl);

    useEffect(() => {
        initParamsFromUrl?.(appConfigs);
    }, [initParamsFromUrl, appConfigs]);

    useEffect(() => {
        DisableDevtool();
        let letters = "";
        const targetWords = "enable dev";
        const enableDevtool = (event: any) => {
            if (event?.key) {
                letters = letters + event.key;
            }

            if (letters === targetWords) {
                // enable devtool
                DisableDevtool.isSuspend = true;
            }

            if (letters.length >= targetWords.length) {
                letters = "";
            }
        };

        window.addEventListener("keyup", enableDevtool);

        return () => {
            window.removeEventListener("keyup", enableDevtool);
        };
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
    /* align-items: center; */
    justify-content: center;
    width: 100vw;
    height: 100vh;
`;

export default App;
