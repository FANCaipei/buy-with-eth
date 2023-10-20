import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { styled } from "styled-components";
import routeConfig from "./common/routes/RouteConfig";
import { Spin } from "antd";
import useFirebaseAuth from "./common/zustand/useFirebaseAuth";
import LoadingIndicator from "./componets/LoadingIndicator";
import DisableDevtool from "disable-devtool";
import { useEffect } from "react";

// 设置全局spin的indicator
Spin.setDefaultIndicator(<LoadingIndicator indicatorWidth="40px" />);

function Index() {
    const element = useRoutes(routeConfig);
    const { isReady } = useFirebaseAuth() as any;
    // use ErrorBoundary in components rather than in antd alter
    return (
        <ErrorBoundary>
            {!isReady ? (
                <Spin spinning={!isReady}>
                    <div style={{ height: "100vh" }}></div>
                </Spin>
            ) : (
                element
            )}
        </ErrorBoundary>
    );
}

function App() {
    useEffect(() => {
        DisableDevtool({
            clearLog: false,
        });
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
    height: 100%;
`;

export default App;
