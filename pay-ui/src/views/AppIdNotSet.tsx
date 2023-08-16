import { styled } from "styled-components";
import NotFoundImg from "../assets/images/icons/not-found.jpg";

const AppIdNotSetPage = () => {
    return (
        <StyledContainer>
            <img className="oops-img" src={NotFoundImg} alt="" />
            <div className="title">Oops!</div>
            <div className="desc">
                <span className="text">Invalid params. Get correct url from </span>
                {/* TODO: replace with correct link */}
                <a target="_blank" href="http://localhost:3001/dashboard/projects">
                    your project
                </a>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "404-page" })`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .oops-img {
        margin-top: 60px;
        height: 120px;
    }
    .title {
        margin-top: 40px;
        font-size: 24px;
        font-weight: 500;
        text-align: center;
    }
    .desc {
        margin-top: 10px;
        font-size: 16px;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);

        .text {
            /* margin-right: 8px; */
        }
    }
`;

export default AppIdNotSetPage;
