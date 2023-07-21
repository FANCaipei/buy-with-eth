import { Button, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { send } from "../messageManager/MessageManager";
import { Utils, ResponseErrorType } from "../common/Utils";

const AvailableCurrencyTypes = [
    {
        chainId: "0x1",
        type: "origin", // 'origin' or 'erc20'
        symbol: "ETH",
        code: "eth",
    },
    {
        chainId: "0x89",
        type: "origin", // 'origin' or 'erc20'
        symbol: "MATIC",
        code: "matic",
    },
    {
        chainId: "0x1",
        type: "erc20", // 'origin' or 'erc20'
        symbol: "USDT-ETH",
        code: "usdt-eth",
    },
    {
        chainId: "0x89",
        type: "origin", // 'origin' or 'erc20'
        symbol: "USDT-Polygon",
        code: "usdt-polygon",
    },
];

const PaymentPage = () => {
    const navigate = useNavigate();
    const { state: params } = useLocation();
    const [responseToOrigin] = useState(params?.responseToOrigin);
    const [responseToId] = useState(params?.responseToId);

    const [targetAddress, setTargetAddress] = useState();

    const [currencyTypeCode, setCurrencyTypeCode] = useState(params?.params?.currencyCode ?? "eth");
    const onCurrencyTypeChange = useCallback((selectCode: string) => {
        console.log(selectCode);
        setCurrencyTypeCode(selectCode);
    }, []);

    const [sendValue, setSendValue] = useState(params?.params?.value);
    const onSendValueChange = useCallback((event: any) => {
        console.log(event);
        setSendValue(event?.target?.value);
    }, []);

    const pay = useCallback(() => {
        const currentProvider = (window as any).buyWithCrypto.utils.ethereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            // TODO: nav to connect wallet with params
            return;
        }
    }, []);
    const cancel = useCallback(() => {
        send("buy-with-crypto-response", responseToId, {
            error: Utils.generateErrorMsg(ResponseErrorType.UserDenyPayment),
        });
    }, []);

    useEffect(() => {
        console.log("payment params: ", params);
        const currentProvider = (window as any).buyWithCrypto.utils.ethereumProvider.getCurrentConnectedProvider();
        if (!currentProvider) {
            // nav to connect wallet with params
            navigate("/connect-wallet", { replace: true, state: params });
        }
        setTargetAddress((window as any).buyWithCrypto.targetAddr);
    }, [navigate, params]);

    return (
        <StyledContainer>
            <div>{targetAddress}</div>
            <Select
                defaultValue={currencyTypeCode}
                style={{ width: 120 }}
                onChange={onCurrencyTypeChange}
                options={AvailableCurrencyTypes.map(item => ({
                    value: item.code,
                    label: item.symbol,
                }))}
            />
            <Input placeholder="Send value" type="number" value={sendValue} onChange={onSendValueChange} />
            <div className="btn-line">
                <Button>Cancel</Button>
                <Button type="primary" onClick={pay}>
                    Pay
                </Button>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "payment-page" })`
    .btn-line {
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
`;

export default PaymentPage;
