import styled from "styled-components";

const HomeContentBlock = ({ children }: { children: any }) => {
    return <StyledContainer>{children}</StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "home-content-block" })`
    height: 35vh;
    /* padding: 60px 20px; */
`;

export default HomeContentBlock;
