import { Button } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import EmptyFolderIcon from "../assets/imgs/icons/empty-folder.svg";

const NoApps = () => {
    const navigate = useNavigate();

    const goAppMangement = useCallback(() => {
        navigate("/dashboard/projects");
    }, [navigate]);

    return (
        <StyledContainer>
            <img className="empty-icon" src={EmptyFolderIcon} alt="" />
            <div className="text">Haven't got a project?</div>
            <Button type="primary" size="large" onClick={goAppMangement}>
                Create Project
            </Button>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "no-apps-container" })`
    display: flex;
    flex-direction: column;
    align-items: center;

    .empty-icon {
        height: 100px;
        margin-bottom: 40px;
    }
    .text {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.8);
        margin-bottom: 20px;
    }
`;

export default NoApps;
