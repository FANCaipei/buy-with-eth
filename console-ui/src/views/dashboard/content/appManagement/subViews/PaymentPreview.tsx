import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import useProtectedPath from "../../../../../common/hooks/useProtectedPath";

const PaymentUIHost = "http://localhost:3000";

const PaymentPreview = () => {
    useProtectedPath();

    const [currrentUrl, setCurrrentUrl] = useState<string>();
    const [messageApi, contextHolder] = message.useMessage();
    const { state } = useLocation();

    const regenerateUrl = useCallback(() => {
        if (!state.appId) {
            messageApi.error("No project Id");
            return;
        }
        const paramObj = {
            appId: state.appId,
            valueInUSD: 1,
            defaultTokenCode: "eth",
        };
        const encodedParams = encodeURIComponent(JSON.stringify(paramObj));
        setCurrrentUrl(`${PaymentUIHost}/payment?params=${encodedParams}`);
    }, [messageApi, state?.appId]);

    return (
        <StyledContainer>
            {contextHolder}
            <SubPanelTitleWithBackIcon title="Generate payment url" />
            <div className="content">
                <div className="config-container"></div>
                <div className="iframe-container">
                    <iframe />
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "payment-preview-container" })``;

export default PaymentPreview;
