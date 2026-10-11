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
    display: inline-flex;
    align-items: center;

    .label-tip {
        margin-left: 6px;
        cursor: pointer;
        color: var(--apple-text-tertiary);
        transition: color var(--apple-duration-fast) var(--apple-ease);

        &:hover {
            color: var(--apple-blue);
        }
    }
`;

export default CustomFormLabel;
