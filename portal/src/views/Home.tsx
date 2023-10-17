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
                        <div className="feature-item">
                            <img className="icon" src="" alt="" />
                            <div className="title">Best cryptocurrency payment experience</div>
                            <div className="desc">User friendly payment view, one click to pay with crypto tokens.</div>
                        </div>
                        <div className="feature-item">
                            <img className="icon" src="" alt="" />
                            <div className="title">Easy to integrate</div>
                            <div className="desc">
                                No code (low code) integration. It only take 3 steps to let your website be able to
                                accept crypto token payment.{" "}
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
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: repeat(2, 1fr);
            column-gap: 20px;
            row-gap: 20px;

            .feature-item {
                padding: 48px;
                background-color: #fff;
                border-radius: 16px;
                box-shadow: rgba(12, 8, 0, 0.3) 0px 2px 8px -1px;

                .icon {
                    width: 55px;
                    height: 55px;
                    display: block;
                    margin-bottom: 30px;
                }
                .title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #000;
                    margin-bottom: 16px;
                }
                .desc {
                    font-size: 16px;
                    line-height: 24px;
                    color: rgb(87, 87, 87);
                }
            }
        }
    }
`;

export default Home;
