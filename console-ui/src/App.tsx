import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import "./App.css";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { styled } from "styled-components";
import routeConfig from "./common/routes/RouteConfig";

function Index() {
    const element = useRoutes(routeConfig);
    // use ErrorBoundary in components rather than in antd alter
    return <ErrorBoundary>{element}</ErrorBoundary>;
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
