import { styled } from "styled-components";

const AppIdNotSetPage = () => {
    return <StyledContainer>appId must provided</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "404-page" })``;

export default AppIdNotSetPage;
