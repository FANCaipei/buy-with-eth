import { Button } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const NoApps = () => {
    const navigate = useNavigate();

    const goAppMangement = useCallback(() => {
        navigate("/dashboard/appManagement");
    }, [navigate]);

    return (
        <StyledContainer>
            <div className="text">Haven't got an App?</div>
            <Button type="primary" size="large" onClick={goAppMangement}>
                Create App
            </Button>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "no-apps-container" })`
    display: flex;
    flex-direction: column;
    align-items: center;

    .text {
        font-size: 24px;
        color: #000;
        margin-bottom: 40px;
    }
`;

export default NoApps;
