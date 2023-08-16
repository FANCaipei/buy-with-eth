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
                    value={state.receiptId}
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
    padding: 20px;
    .head {
        font-size: 20px;
    }
    .result-img {
        padding: 80px 0 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 96px;
    }
    .title {
        font-size: 24px;
        font-weight: 500;
        text-align: center;
    }
    .desc {
        margin-top: 10px;
        font-size: 16px;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
    }
    .receipt-container {
        margin-top: 10px;
        position: relative;

        .copy-icon {
            position: absolute;
            right: 10px;
            bottom: 10px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.55);
            cursor: pointer;
        }
    }
`;

export default ResultPage;
