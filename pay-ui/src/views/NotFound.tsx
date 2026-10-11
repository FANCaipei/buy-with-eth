import { styled } from "styled-components";

const NotFoundPage = () => {
    return <StyledContainer>404 not found</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "404-page" })`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    font-weight: 500;
    color: var(--apple-text-tertiary);
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);
`;

export default NotFoundPage;
