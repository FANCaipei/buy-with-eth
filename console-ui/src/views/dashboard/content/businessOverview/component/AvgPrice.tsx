import { styled } from "styled-components";

const AvgPrice = ({ avgPrices }: { avgPrices: Array<{ avgPrice: number; tokenSymbol: string; color: string }> }) => {
    return (
        <StyledContainer>
            {avgPrices.map(item => (
                <div className="avg-price">
                    <div className="price">{item.avgPrice}</div>
                    <div className="label">{item.tokenSymbol}</div>
                </div>
            ))}
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
`;

export default AvgPrice;
