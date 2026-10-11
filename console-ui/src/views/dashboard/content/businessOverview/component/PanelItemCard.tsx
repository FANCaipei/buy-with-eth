import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { styled } from "styled-components";

const PanelItemCard = ({
    title,
    children,
    style,
    titleTooltip,
}: {
    title: string;
    children?: any;
    style?: object;
    titleTooltip?: string;
}) => {
    return (
        <StyledContainer style={style}>
            <div className="title">
                {title}
                <div className="tooltip">
                    {titleTooltip ? (
                        <Tooltip title={titleTooltip}>
                            <QuestionCircleOutlined />
                        </Tooltip>
                    ) : null}
                </div>
            </div>
            <div className="content">{children}</div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    height: 400px;
    padding: 24px;
    background: var(--apple-surface);
    border: 1px solid var(--apple-border-light);
    border-radius: var(--apple-radius-lg);
    margin: 8px;
    box-shadow: var(--apple-shadow-sm);
    transition: all var(--apple-duration-normal) var(--apple-ease);

    &:hover {
        box-shadow: var(--apple-shadow-md);
    }

    .title {
        font-size: 13px;
        font-weight: 600;
        color: var(--apple-text-secondary);
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        letter-spacing: -0.01em;

        .tooltip {
            margin-left: 6px;
            cursor: pointer;
            color: var(--apple-text-tertiary);
            transition: color var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                color: var(--apple-blue);
            }
        }
    }
    .content {
        width: 100%;
        height: calc(100% - 40px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default PanelItemCard;
