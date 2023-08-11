import { styled } from "styled-components";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const CustomFormLabel = ({ label, tip }: { label: string; tip?: string }) => {
    return (
        <StyledContainer>
            <span>{label}</span>
            {tip == null ? null : (
                <Tooltip title={tip} className="label-tip">
                    <QuestionCircleOutlined />
                </Tooltip>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "custom-form-label-container" })`
    .label-tip {
        margin-left: 8px;
        cursor: pointer;
    }
`;

export default CustomFormLabel;
