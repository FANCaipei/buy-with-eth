import styled from "styled-components";
import HomeContentBlock from "../common/components/HomeContentBlock";
import PlaceHolderImg from "../assets/imgs/placeholder.png";

const Home = () => {
    return (
        <StyledContainer>
            <div className="home-content">
                <HomeContentBlock>
                    <div className="slogan-block">
                        <div className="title">Ocelot Pay</div>
                        <div className="slogan">Make sure your business touch millions crypto holders</div>
                    </div>
                </HomeContentBlock>
                <HomeContentBlock>
                    <div className="feature-block">
                        <img className="deco-img" src={PlaceHolderImg} alt="" />
                        <div className="text-block"></div>
                    </div>
                </HomeContentBlock>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "home" })`
    .home-content {
        max-width: 1440px;
        margin: 0 auto;

        .slogan-block {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;

            .title {
                font-size: 48px;
                font-weight: bold;
                color: rgb(0, 158, 255);
            }
            .slogan {
                font-size: 24px;
                font-weight: bold;
                margin-top: 40px;
                color: rgb(22, 116, 174);
            }
        }
        .feature-block {
            display: flex;
            align-items: stretch;

            .deco-img {
                width: 30%;
            }
            .text-block {
                width: 70%;
            }
        }
    }
`;

export default Home;
