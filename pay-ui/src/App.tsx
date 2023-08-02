import { ReactNode, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { BrowserRouter, useLocation, useNavigate, useParams, useRoutes } from "react-router-dom";
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
    // const urlParams = useParams();

    useEffect(() => {
        // decode url params
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const params = searchParams.get("params");
            console.log(params);
            if (params) {
                const decodedParams = decodeURIComponent(params);
                const paramsObj = JSON.parse(decodedParams);
                console.log("params object: ", paramsObj);
                /**
                 * params decoded format: {
                 *  payment: true/false,
                 *  valueInUSD: number,
                 *  defaultTokenCode: string
                 * }
                 */
                if (paramsObj.payment) {
                    if (window.location.pathname.startsWith("/payment")) {
                        navigate("/buffer", {
                            replace: true,
                            state: {
                                nextPath: "/payment",
                                nextParams: {
                                    params: {
                                        valueInUSD: paramsObj?.valueInUSD,
                                        defaultTokenCode: paramsObj?.defaultTokenCode,
                                    },
                                },
                            },
                        });
                    } else {
                        navigate("/payment", {
                            replace: true,
                            state: {
                                params: {
                                    valueInUSD: paramsObj?.valueInUSD,
                                    defaultTokenCode: paramsObj?.defaultTokenCode,
                                },
                            },
                        });
                    }
                }
            }
        } catch (error) {
            // do nothing
        }
    });

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
