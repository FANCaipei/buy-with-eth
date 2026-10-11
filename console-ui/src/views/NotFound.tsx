import { styled } from "styled-components";

const NotFoundPage = () => {
    return <StyledContainer>404 Not Found</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "404-page" })`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 32px;
    font-weight: 700;
    color: var(--apple-text-tertiary);
    letter-spacing: -0.03em;
    animation: apple-fade-in var(--apple-duration-normal) var(--apple-ease);
`;
export default NotFoundPage;
