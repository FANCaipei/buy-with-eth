import { Button } from "antd";
import styled from "styled-components";
import Logo from "../../assets/imgs/logo.png";

const OcelotHeader = () => {
    return (
        <StyledContainer>
            <div className="logo-block">
                <img src={Logo} alt="" className="logo" />
                <span className="text">Ocelot Pay</span>
            </div>
            <div className="nav-items">
                <Button type="text" size="large">
                    Why Ocelot Pay
                </Button>
                <Button type="text" size="large">
                    Pricing
                </Button>
                <Button type="text" size="large">
                    Docs
                </Button>
                <Button type="primary" size="large">
                    Console
                </Button>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "ocelot-header" })`
    width: 100%;
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
