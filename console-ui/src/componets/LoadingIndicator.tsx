import { styled } from "styled-components";
import LoadingIcon from "../assets/imgs/icons/loading.svg";

const LoadingIndicator = ({ indicatorWidth }: { indicatorWidth: string }) => {
    return (
        <StyledContainer>
            <img className="indicator" width={indicatorWidth} src={LoadingIcon} alt="" />;
        </StyledContainer>
    );
};
const StyledContainer = styled.div.attrs({ className: "spin-indicator" })`
    .indicator {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

export default LoadingIndicator;
