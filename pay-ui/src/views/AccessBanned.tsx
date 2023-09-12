import { styled } from "styled-components";
import NotFoundImg from "../assets/images/icons/not-found.jpg";

const ConsoleHost = process.env.REACT_APP_CONSOLE_DOMAIN;

const AccessBannedPage = () => {
    return (
        <StyledContainer>
            <img className="oops-img" src={NotFoundImg} alt="" />
            <div className="title">Access denied</div>
            <div className="desc">
                <span className="text">If you are admin, please check </span>
                <a target="_blank" rel="noreferrer" href={`${ConsoleHost}/dashboard/bills`}>
                    your bills
                </a>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "access-deny-page" })`
    display: flex;
    height: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .oops-img {
        margin-top: -40px;
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

export default AccessBannedPage;
