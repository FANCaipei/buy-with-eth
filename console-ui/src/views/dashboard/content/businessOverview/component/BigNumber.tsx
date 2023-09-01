import { styled } from "styled-components";

const BigNumber = ({ totalRevenue, recordsCount }: { totalRevenue: number; recordsCount: number }) => {
    return (
        <StyledContainer>
            <div className="revenue">${totalRevenue?.toFixed(2)}</div>
            <div className="count">
                <span className="label">Payment records count: </span>
                <span className="value">{recordsCount}</span>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .revenue {
        font-size: 64px;
        color: rgba(0, 0, 0, 0.87);
    }
    .count {
        font-size: 16px;
        margin-top: 80px;

        .label {
            color: rgb(95, 99, 104);
        }
        .value {
            color: rgba(0, 0, 0, 0.87);
        }
    }
`;

export default BigNumber;
