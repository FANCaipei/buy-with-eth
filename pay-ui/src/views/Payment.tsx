import { Button, Input, Select } from "antd";
import { useCallback, useState } from "react";
import { styled } from "styled-components";

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
    const [currencyTypeCode, setCurrencyTypeCode] = useState("eth");
    const onCurrencyTypeChange = useCallback((selectCode: string) => {
        console.log(selectCode);
        setCurrencyTypeCode(selectCode);
    }, []);

    const [sendValue, setSendValue] = useState();
    const onSendValueChange = useCallback((event: any) => {
        console.log(event);
        setSendValue(event?.target?.value);
    }, []);

    return (
        <StyledContainer>
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
                <Button type="primary">Pay</Button>
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
