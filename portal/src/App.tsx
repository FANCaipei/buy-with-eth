import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { styled } from "styled-components";
import routeConfig from "./common/routes/RouteConfig";
import { Content, Header } from "antd/es/layout/layout";
import OcelotHeader from "./common/components/OcelotHeader";

function Index() {
    const element = useRoutes(routeConfig);
    // use ErrorBoundary in components rather than in antd alter
    return (
        <ErrorBoundary>
            <Header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                }}
            >
                <OcelotHeader />
            </Header>
            <Content style={{ height: "calc(100% - 64px)" }}>{element}</Content>
        </ErrorBoundary>
    );
}

function App() {
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
