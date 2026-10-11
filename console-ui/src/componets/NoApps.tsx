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
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .empty-icon {
        height: 100px;
        margin-bottom: 32px;
        opacity: 0.7;
    }
    .text {
        font-size: 17px;
        font-weight: 500;
        color: var(--apple-text-secondary);
        margin-bottom: 20px;
        letter-spacing: -0.02em;
    }

    .ant-btn-primary {
        border-radius: 980px;
        font-weight: 600;
        height: 40px;
        padding: 0 28px;
        background: var(--apple-blue);
        border-color: var(--apple-blue);
        box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
        transition: all var(--apple-duration-fast) var(--apple-ease);

        &:hover {
            background: var(--apple-blue-hover);
            border-color: var(--apple-blue-hover);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35);
        }
    }
`;

export default NoApps;
