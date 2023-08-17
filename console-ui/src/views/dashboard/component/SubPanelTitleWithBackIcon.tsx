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
    color: rgb(27, 58, 87);

    .back-icon {
        font-size: 20px;
        margin-right: 10px;
    }

    .title-tip {
        font-size: 16px;
        height: 10px;
        margin-left: 8px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
    }
`;

export default SubPanelTitleWithBackIcon;
