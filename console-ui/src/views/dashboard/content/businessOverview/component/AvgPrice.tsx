import { styled } from "styled-components";

const AvgPrice = ({ avgPrices }: { avgPrices: Array<{ avgPrice: number; tokenSymbol: string; color: string }> }) => {
    return (
        <StyledContainer>
            {avgPrices.map(item => (
                <div className="avg-price" style={{ color: item.color }}>
                    <div className="price">${item.avgPrice?.toFixed(4)}</div>
                    <div className="label">{item.tokenSymbol}</div>
                </div>
            ))}
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    .avg-price {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .price {
            font-size: 32px;
            font-weight: bold;
        }
        .label {
            margin-top: 30px;
            font-size: 16px;
        }
    }
`;

export default AvgPrice;
