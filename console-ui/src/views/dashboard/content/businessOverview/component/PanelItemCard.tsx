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
    padding: 20px;
    background-color: #fff;
    border: solid 1px rgb(218, 220, 224);
    border-radius: 8px;
    margin: 8px;
    .title {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .tooltip {
            margin-left: 8px;
            cursor: pointer;
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
