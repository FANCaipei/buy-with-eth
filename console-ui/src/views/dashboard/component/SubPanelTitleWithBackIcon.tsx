import { styled } from "styled-components";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const SubPanelTitleWithBackIcon = ({ title }: { title: string }) => {
    const navigate = useNavigate();

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <StyledContainer>
            <LeftOutlined onClick={goBack} className="back-icon" />
            <div className="title">{title}</div>
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
`;

export default SubPanelTitleWithBackIcon;
