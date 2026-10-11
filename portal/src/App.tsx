import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { styled } from "styled-components";
import routeConfig from "./common/routes/RouteConfig";
import { Content, Header } from "antd/es/layout/layout";
import OcelotHeader from "./common/components/OcelotHeader";

function Index() {
    const element = useRoutes(routeConfig);
    return (
        <ErrorBoundary>
            <Header
                style={{
                    position: "fixed",
                    top: 0,
                    zIndex: 100,
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.72)",
                    backdropFilter: "saturate(180%) blur(20px)",
                    WebkitBackdropFilter: "saturate(180%) blur(20px)",
                    borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)",
                    height: "52px",
                    lineHeight: "52px",
                }}
            >
                <OcelotHeader />
            </Header>
            <Content style={{ height: "100%", paddingTop: "52px" }}>{element}</Content>
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
    width: 100vw;

    .ant-layout-header {
        @media screen and (max-width: 800px) {
            padding: 0 20px;
        }
    }
`;

export default App;
