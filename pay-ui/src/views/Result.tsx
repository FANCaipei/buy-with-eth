import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, LeftOutlined } from "@ant-design/icons";
import { Input, Tooltip, message } from "antd";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { styled } from "styled-components";

const ResultPage = () => {
    const { state } = useLocation();
    /**
     * state structure
     * {
     *      type: "success", // success || failed
     *      receiptId:
     *           "rBBXvVZq0eSnZZ2pliYiCfeOkx43-jcUrmUedFydsUfr2itcR#0xe96d4692d92a6776b81c8d53a27b86ad726a7fbeaef5227c361e441765ccd3d4#0x89#MATIC#0#ssdfadsfsdffeecetrcetcte",
     * }
     */
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const navBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const copyReceipt = useCallback(() => {
        try {
            navigator.clipboard.writeText(state?.receiptId);
            messageApi.open({
                type: "success",
                content: "Copied",
            });
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Copy failed",
            });
        }
    }, [state?.receiptId, messageApi]);

    return (
        <StyledContainer>
            {contextHolder}
            <div className="head">
                <LeftOutlined className="back-icon" onClick={navBack} />
            </div>
            <div className="result-img">
                {state?.type === "success" ? (
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                ) : (
                    <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                )}
            </div>
            <div className="title" style={{ color: state?.type === "success" ? "#52c41a" : "#ff4d4f" }}>
                {state?.type === "success" ? "Success" : "Something went wrong"}
            </div>
            <div className="desc">
                {state?.type === "success"
                    ? "Following is your receipt"
                    : "If payment succeeded in your wallet, please provide the following receipt to us"}
            </div>
            <div className="receipt-container">
                <Input.TextArea
                    placeholder=""
                    value={state?.receiptId}
                    rows={3}
                    autoSize={{ minRows: 3, maxRows: 20 }}
                />
                <Tooltip title="copy receipt">
                    <CopyOutlined className="copy-icon" onClick={copyReceipt} />
                </Tooltip>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "result-page" })`
    padding: 24px 28px;
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .head {
        font-size: 20px;

        .back-icon {
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all var(--apple-duration-fast) var(--apple-ease);
            color: var(--apple-text-secondary);

            &:hover {
                background: var(--apple-gray-200);
                color: var(--apple-text-primary);
            }

            &:active {
                transform: scale(0.92);
            }
        }
    }

    .result-img {
        padding: 60px 0 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 80px;
        animation: apple-scale-in var(--apple-duration-slow) var(--apple-ease-spring);
    }

    .title {
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        letter-spacing: -0.02em;
    }

    .desc {
        margin-top: 8px;
        font-size: 15px;
        text-align: center;
        color: var(--apple-text-secondary);
        line-height: 1.5;
    }

    .receipt-container {
        margin-top: 24px;
        position: relative;

        .ant-input {
            border-radius: var(--apple-radius-sm) !important;
            background: var(--apple-gray-200) !important;
            border: 1px solid var(--apple-border-light) !important;
            font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace !important;
            font-size: 12px !important;
            color: var(--apple-text-secondary) !important;
            resize: none;

            &:focus {
                border-color: var(--apple-blue) !important;
                box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15) !important;
            }
        }

        .copy-icon {
            position: absolute;
            right: 12px;
            bottom: 12px;
            font-size: 16px;
            color: var(--apple-text-tertiary);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                background: var(--apple-gray-300);
                color: var(--apple-blue);
            }

            &:active {
                transform: scale(0.9);
            }
        }
    }
`;

export default ResultPage;
