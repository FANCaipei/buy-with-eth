import { styled } from "styled-components";
import { LeftOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Tooltip } from "antd";

const SubPanelTitleWithBackIcon = ({ title, tip }: { title: string; tip?: string }) => {
    const navigate = useNavigate();

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <StyledContainer>
            <LeftOutlined onClick={goBack} className="back-icon" />
            <div className="title">{title}</div>
            {tip == null ? null : (
                <Tooltip title={tip} className="title-tip">
                    <QuestionCircleOutlined />
                </Tooltip>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "sub-title-container" })`
    display: flex;
    align-items: center;
    font-size: 28px;
    font-weight: 600;
    color: var(--apple-text-primary);
    letter-spacing: -0.03em;

    .back-icon {
        font-size: 18px;
        margin-right: 12px;
        color: var(--apple-blue);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        transition: all var(--apple-duration-fast) var(--apple-ease);

        &:hover {
            background: var(--apple-gray-200);
        }
    }

    .title-tip {
        font-size: 16px;
        height: 10px;
        margin-left: 8px;
        cursor: pointer;
        color: var(--apple-text-tertiary);
        transition: color var(--apple-duration-fast) var(--apple-ease);

        &:hover {
            color: var(--apple-blue);
        }
    }
`;

export default SubPanelTitleWithBackIcon;
