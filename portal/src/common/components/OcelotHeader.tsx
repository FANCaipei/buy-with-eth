import { Button } from "antd";
import styled from "styled-components";
import Logo from "../../assets/imgs/logo.png";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OcelotHeader = () => {
    const navigate = useNavigate();
    const [isAtDocPage, setIsAtDocPage] = useState(true);
    const location = useLocation();

    const goHome = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const goDoc = useCallback(() => {
        navigate("/doc");
    }, [navigate]);

    const goConsole = useCallback(() => {
        window.open("https://console.ocelotpay.com/", "_blank");
    }, []);

    useEffect(() => {
        if (location.pathname?.includes("/doc")) {
            setIsAtDocPage(true);
        } else {
            setIsAtDocPage(false);
        }
    }, [location]);

    return (
        <StyledContainer style={{ maxWidth: isAtDocPage ? "100vw" : "1200px" }}>
            <div className="logo-block" onClick={goHome}>
                <img src={Logo} alt="" className="logo" />
                <span className="text">Ocelot Pay</span>
            </div>
            <div className="nav-items">
                {!isAtDocPage ? (
                    <a href="#features">
                        <Button type="text" size="large">
                            Why Ocelot Pay
                        </Button>
                    </a>
                ) : null}
                {!isAtDocPage ? (
                    <a href="#price">
                        <Button type="text" size="large">
                            Pricing
                        </Button>
                    </a>
                ) : null}
                {!isAtDocPage ? (
                    <Button type="text" size="large" onClick={goDoc}>
                        Docs
                    </Button>
                ) : null}

                <Button type="primary" size="large" onClick={goConsole}>
                    Console
                </Button>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "ocelot-header" })`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo-block {
        cursor: pointer;
        display: flex;
        align-items: center;
        .logo {
            width: 32px;
            height: 32px;
            margin-right: 10px;
        }
        .text {
            color: rgb(0, 158, 255);
            font-size: 24px;
            font-weight: bold;
        }
    }

    .nav-items {
        button {
            margin-left: 10px;
        }
    }
`;

export default OcelotHeader;
