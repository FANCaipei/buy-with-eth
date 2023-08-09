import { styled } from "styled-components";

const AppCard = ({ appData }: { appData: any }) => {
    return (
        <StyledContainer>
            <div className="title">{appData?.name}</div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "app-card-container" })`
    width: 300px;
    height: 210px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    &:hover {
        background-color: (245, 245, 245);
    }

    .title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
    }
`;

export default AppCard;
