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
        font-size: 56px;
        font-weight: 700;
        color: var(--apple-text-primary);
        letter-spacing: -0.04em;
    }
    .count {
        font-size: 14px;
        margin-top: 60px;

        .label {
            color: var(--apple-text-secondary);
        }
        .value {
            color: var(--apple-text-primary);
            font-weight: 600;
        }
    }
`;

export default BigNumber;
