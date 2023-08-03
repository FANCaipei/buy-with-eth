import { styled } from "styled-components";

const NotFoundPage = () => {
    return <StyledContainer>404 Not Found</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "404-page" })``;

export default NotFoundPage;
