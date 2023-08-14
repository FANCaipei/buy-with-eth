import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Divider, Form, Input, Select, Tooltip, message } from "antd";
import { CopyOutlined, ToolOutlined, ControlOutlined } from "@ant-design/icons";
import useProtectedPath from "../../../../../common/hooks/useProtectedPath";
import CustomFormLabel from "../../../../../componets/CustomFormLabel";

const PaymentUIHost = "http://localhost:3000";

const ProductIdValidator = async (_rule: any, value: any) => {
    return !value.includes("#") ? Promise.resolve() : Promise.reject();
};

const PaymentPreview = () => {
    useProtectedPath();

    const [formInstace] = Form.useForm();
    const payValueInUSD = Form.useWatch("payValue", formInstace);
    const defaultTokenType = Form.useWatch("defaultToken", formInstace);
    const productId = Form.useWatch("productId", formInstace);
    const [currrentUrl, setCurrrentUrl] = useState<string>();
    const [messageApi, contextHolder] = message.useMessage();
    const { state } = useLocation();

    const onTextAreaChange = useCallback((event: any) => {
        setCurrrentUrl(event?.target?.value);
    }, []);

    const copyUrl = useCallback(() => {
        if (!currrentUrl) {
            messageApi.error("Url not generated");
            return;
        }
        navigator.clipboard.writeText(currrentUrl);
    }, [currrentUrl, messageApi]);

    const decodeUrl = useCallback(() => {
        const search = new URLSearchParams(currrentUrl?.split("?")?.[1]);
        const paramStr = search.get("params");
        try {
            const paramsObj = JSON.parse(paramStr || "");
            formInstace.setFieldValue("payValue", paramsObj.valueInUSD);
            formInstace.setFieldValue("defaultToken", paramsObj.defaultTokenCode);
            formInstace.setFieldValue("productId", paramsObj.productId);
        } catch (error) {
            messageApi.error("Decode url failed, invalid format");
            return;
        }
    }, [currrentUrl, formInstace, messageApi]);

    const regenerateUrl = useCallback(() => {
        if (!state?.appId) {
            messageApi.error("No project Id");
            return;
        }
        const paramObj = {
            appId: state.appId,
        };
        if (payValueInUSD) {
            (paramObj as any).valueInUSD = payValueInUSD;
        }
        if (defaultTokenType) {
            (paramObj as any).defaultTokenCode = defaultTokenType;
        }
        if (productId) {
            (paramObj as any).productId = productId;
        }

        const encodedParams = encodeURIComponent(JSON.stringify(paramObj));
        setCurrrentUrl(`${PaymentUIHost}/payment?params=${encodedParams}`);
    }, [messageApi, state?.appId, payValueInUSD, defaultTokenType]);

    useEffect(
        () => {
            regenerateUrl();
        },
        // eslint-disable-next-line
        [] // only excute once, ignore the change of regenerateUrl
    );

    return (
        <StyledContainer>
            {contextHolder}
            <SubPanelTitleWithBackIcon title="Generate payment url" />
            <div className="content">
                <div className="config-container">
                    <Form form={formInstace} size="large" labelCol={{ span: 14 }} labelAlign="left" colon={false}>
                        <Form.Item
                            name="payValue"
                            label={
                                <CustomFormLabel
                                    label="Fixed price in USD"
                                    tip="You can left it empty if you allow user to enter price"
                                />
                            }
                        >
                            <Input
                                type="number"
                                placeholder="Price in USD"
                                value={payValueInUSD}
                                style={{ width: "230px" }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="defaultToken"
                            label={
                                <CustomFormLabel
                                    label="Default token"
                                    tip="The default chosen crypto displayed to user"
                                />
                            }
                        >
                            <Select
                                style={{ width: 230 }}
                                options={[
                                    { value: "eth", label: "ETH" },
                                    { value: "matic", label: "MATIC" },
                                    { value: "usdt-eth", label: "USDT-ETH" },
                                    { value: "usdt-polygon", label: "USDT-Polygon" },
                                    { value: "sepolia-eth", label: "SepoliaETH" },
                                    { value: "usdt-sepolia", label: "USDT-SETH" },
                                ]}
                                value={defaultTokenType}
                            />
                        </Form.Item>
                        <Form.Item
                            name="productId"
                            label={
                                <CustomFormLabel
                                    label="Product ID"
                                    tip="This won't display on payment view. You can set unique id for each of your product. It will be included in payment success response. "
                                />
                            }
                            rules={[
                                {
                                    validator: ProductIdValidator,
                                    message: "# is not allowed",
                                },
                            ]}
                        >
                            <Input
                                type="string"
                                placeholder="Product ID"
                                value={productId}
                                style={{ width: "230px" }}
                            />
                        </Form.Item>
                        <div className="right-layout-items">
                            <Button
                                icon={<ControlOutlined />}
                                className="generate-btn"
                                type="primary"
                                onClick={regenerateUrl}
                                size="large"
                            >
                                Generate url
                            </Button>
                        </div>

                        <Divider />
                        <div className="url-textarea-wrapper">
                            <Input.TextArea
                                placeholder="You can past url here and decode params"
                                value={currrentUrl}
                                rows={5}
                                autoSize={{ minRows: 5, maxRows: 8 }}
                                onChange={onTextAreaChange}
                            />
                            <Tooltip title="copy url">
                                <CopyOutlined className="copy-icon" onClick={copyUrl} />
                            </Tooltip>
                        </div>
                        <div className="right-layout-items">
                            <Button
                                icon={<ToolOutlined />}
                                className="decode-btn"
                                type="primary"
                                onClick={decodeUrl}
                                size="large"
                            >
                                Decode url
                            </Button>
                        </div>
                    </Form>
                </div>
                <div className="iframe-container">
                    <iframe src={currrentUrl} title={currrentUrl} key={currrentUrl} />
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "payment-preview-container" })`
    .content {
        margin-top: 40px;
        display: flex;
        align-items: flex-start;

        .config-container {
            width: 600px;
            box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
            background-color: #fff;
            border-radius: 8px;
            padding: 24px;

            .right-layout-items {
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
            .generate-btn {
                margin-top: 10px;
            }
            .url-textarea-wrapper {
                margin-top: 20px;
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
            .decode-btn {
                margin-top: 40px;
                background-color: rgb(22, 156, 117);
            }
        }
        .iframe-container {
            margin-left: 10px;
            width: 400px;
            height: 500px;

            iframe {
                border: none;
                width: 400px;
                height: 500px;
            }
        }
    }
`;

export default PaymentPreview;
