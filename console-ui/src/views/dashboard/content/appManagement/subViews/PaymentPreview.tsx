import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Divider, Form, Input, Select, Tooltip, message } from "antd";
import { CopyOutlined, ToolOutlined, ControlOutlined } from "@ant-design/icons";
import { CopyBlock, paraisoLight } from "react-code-blocks";
import useProtectedPath from "../../../../../common/hooks/useProtectedPath";
import CustomFormLabel from "../../../../../componets/CustomFormLabel";

const PaymentUIHost = "http://localhost:3000";

const GeneratePayUIUrl = (appId: string, valueInUSD: any, defaultTokenType: any, productId: any): string => {
    const paramObj = {
        appId: appId,
    };
    if (valueInUSD) {
        (paramObj as any).valueInUSD = valueInUSD;
    }
    if (defaultTokenType) {
        (paramObj as any).defaultTokenCode = defaultTokenType;
    }
    if (productId) {
        (paramObj as any).productId = productId;
    }

    const encodedParams = encodeURIComponent(JSON.stringify(paramObj));
    return `${PaymentUIHost}/payment?params=${encodedParams}`;
};

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

    const copyUrl = useCallback(() => {
        if (!currrentUrl) {
            messageApi.error("Url not generated");
            return;
        }
        try {
            navigator.clipboard.writeText(currrentUrl);
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
    }, [currrentUrl, messageApi]);

    const copyCode = useCallback(() => {
        if (!currrentUrl) {
            messageApi.error("Url not generated");
            return;
        }
        try {
            navigator.clipboard.writeText(`<iframe src="${currrentUrl}"/>`);
            messageApi.open({
                type: "success",
                content: "Code copied",
            });
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Copy failed",
            });
        }
    }, [currrentUrl, messageApi]);

    const regenerateUrl = useCallback(() => {
        if (!state?.appId) {
            messageApi.error("No project Id");
            return;
        }

        const url = GeneratePayUIUrl(state.appId, payValueInUSD, defaultTokenType, productId);
        setCurrrentUrl(url);
    }, [messageApi, state?.appId, payValueInUSD, defaultTokenType, productId]);

    const decodeUrl = useCallback(
        (url?: string) => {
            const search = new URLSearchParams((url ?? currrentUrl)?.split("?")?.[1]);
            const paramStr = search.get("params");
            try {
                const paramsObj = JSON.parse(paramStr || "");
                formInstace.setFieldValue("payValue", paramsObj.valueInUSD);
                formInstace.setFieldValue("defaultToken", paramsObj.defaultTokenCode);
                formInstace.setFieldValue("productId", paramsObj.productId);
                if (paramsObj.appId !== state?.appId) {
                    const url = GeneratePayUIUrl(
                        state?.appId,
                        paramsObj.valueInUSD,
                        paramsObj.defaultTokenCode,
                        paramsObj.productId
                    );
                    setCurrrentUrl(url);
                }
            } catch (error) {
                messageApi.error("Decode url failed, invalid format");
                return;
            }
        },
        [currrentUrl, formInstace, messageApi, state?.appId]
    );

    const onTextAreaChange = useCallback(
        (event: any) => {
            setCurrrentUrl(event?.target?.value);
            decodeUrl(event?.target?.value);
        },
        [decodeUrl]
    );

    useEffect(() => {
        formInstace.setFieldValue("appId", state?.appId);
    }, [state?.appId, formInstace]);

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
            <SubPanelTitleWithBackIcon
                title={state?.appName}
                tip="Config an copy code at left, your payment view preview on right."
            />
            <div className="content">
                <div className="config-container">
                    <Form form={formInstace} size="large" labelCol={{ span: 14 }} labelAlign="left" colon={false}>
                        <Form.Item
                            name="appId"
                            label={<CustomFormLabel label="AppId" tip="You need this to init SDK" />}
                        >
                            <Input placeholder="Some thing went wrong" style={{ width: "450px" }} disabled={true} />
                        </Form.Item>
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
                            <div className="label">Past url here and decode params</div>
                            <Input.TextArea
                                placeholder="Past url here and decode params"
                                value={currrentUrl}
                                rows={5}
                                autoSize={{ minRows: 5, maxRows: 8 }}
                                onChange={onTextAreaChange}
                            />
                            <Tooltip title="copy url">
                                <CopyOutlined className="copy-icon" onClick={copyUrl} />
                            </Tooltip>
                        </div>
                        <div className="iframe-code-container">
                            <CopyBlock
                                //@ts-ignore
                                text={`<iframe src="${currrentUrl}"/>`}
                                language="html"
                                showLineNumbers={false}
                                theme={paraisoLight}
                                onCopy={copyCode}
                                codeBlock
                            />
                        </div>

                        <div className="right-layout-items">
                            <Button
                                icon={<ToolOutlined />}
                                className="decode-btn"
                                type="primary"
                                onClick={() => decodeUrl()}
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

                .label {
                    margin-bottom: 10px;
                    font-size: 16px;
                }

                .copy-icon {
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.55);
                    cursor: pointer;
                }
            }
            .iframe-code-container {
                margin-top: 10px;
            }
            .decode-btn {
                margin-top: 40px;
                background-color: rgb(22, 156, 117);
            }
        }
        .iframe-container {
            margin-left: 40px;
            width: 480px;
            height: 550px;

            iframe {
                border: none;
                width: 480px;
                height: 550px;
                overflow: hidden;
                border-radius: 16px;
                box-shadow: 2px 2px 16px #8f8f8f66;
            }
        }
    }
`;

export default PaymentPreview;
