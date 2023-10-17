import styled from "styled-components";
import PlaceHolderImg from "../assets/imgs/placeholder.png";
import SloganBg from "../assets/imgs/home/slogan-bg.jpeg";
import cn from "classnames";

const Home = () => {
    return (
        <StyledContainer>
            <div className="home-content">
                <div className="home-block" style={{ backgroundImage: `url(${SloganBg})` }}>
                    <div className={cn("slogan-block", "block-content")}>
                        {/* <div className="title">Ocelot Pay</div> */}
                        <div className="slogan">Make sure your business touch millions crypto holders</div>
                        <div className="sub-slogan">A platform for end-users to pay with cryptocurrencies</div>
                    </div>
                </div>
                <div className="home-title">Features</div>
                <div className="home-block">
                    <div className="feature-block block-content">
                        <img className="deco-img" src={PlaceHolderImg} alt="" />
                        <div className="text-block right">
                            <div className="title">Best payment experience</div>
                            <div className="divider"></div>
                            <div className="desc">
                                User friendly payment view, one click to pay. Never confuse end-users.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "home" })`
    .home-content {
        width: 100%;
        margin: 0 auto;

        .home-title {
            font-size: 48px;
            width: 100%;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
            padding: 50px 0 20px;
        }

        .home-block {
            min-height: 45vh;
            background-size: cover;
            background-repeat: no-repeat;

            .block-content {
                min-height: 45vh;
                height: 100%;
                max-width: 1200px;
                width: 100%;
                margin: 0 auto;
            }
        }

        .slogan-block {
            width: 100%;
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
                font-size: 32px;
                font-weight: bold;
                margin-top: 40px;
                color: rgb(22, 116, 174);
            }
            .sub-slogan {
                font-size: 20px;
                font-weight: bold;
                margin-top: 20px;
                color: rgba(0, 0, 0, 0.88);
            }
        }
        .feature-block {
            display: flex;
            align-items: center;

            .deco-img {
                width: 70%;
            }
            .text-block {
                width: 30%;
                display: flex;
                flex-direction: column;

                &.left {
                    align-items: flex-start;
                }
                &.right {
                    align-items: flex-end;
                }

                .title {
                    font-size: 32px;
                    font-weight: bold;
                    color: rgb(0, 158, 255);
                }
                .divider {
                    height: 1px;
                    width: 30%;
                    margin: 10px 0;
                    background-color: rgb(0, 158, 255);
                }
                .desc {
                    font-size: 20px;
                    color: rgba(0, 0, 0, 0.88);
                }
            }
        }
    }
`;

export default Home;
