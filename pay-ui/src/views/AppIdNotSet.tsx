import { styled } from "styled-components";
import NotFoundImg from "../assets/images/icons/not-found.jpg";

const ConsoleHost = process.env.REACT_APP_CONSOLE_DOMAIN;

const AppIdNotSetPage = () => {
    return (
        <StyledContainer>
            <img className="oops-img" src={NotFoundImg} alt="" />
            <div className="title">Oops!</div>
            <div className="desc">
                <span className="text">Invalid params. Get correct url from </span>
                <a target="_blank" rel="noreferrer" href={`${ConsoleHost}/dashboard/projects`}>
                    your project
                </a>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "appid-miss-page" })`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 28px;
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .oops-img {
        margin-top: 60px;
        height: 120px;
        border-radius: var(--apple-radius-md);
    }

    .title {
        margin-top: 32px;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        color: var(--apple-text-primary);
        letter-spacing: -0.02em;
    }

    .desc {
        margin-top: 8px;
        font-size: 15px;
        text-align: center;
        color: var(--apple-text-secondary);
        line-height: 1.5;

        a {
            color: var(--apple-blue);
            text-decoration: none;
            font-weight: 500;
            transition: color var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                color: var(--apple-blue-hover);
                text-decoration: underline;
            }
        }
    }
`;

export default AppIdNotSetPage;
