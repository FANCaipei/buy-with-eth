import styled from "styled-components";
import SloganBg from "../assets/imgs/home/slogan-bg.jpeg";
import cn from "classnames";
import EasyIcon from "../assets/imgs/home/icons/cliqz-icon.svg";
import IntegrationIcon from "../assets/imgs/home/icons/puzzle-icon.svg";
import ControlIcon from "../assets/imgs/home/icons/cryptocurrency-bitcoin-icon.svg";
import DashboardIcon from "../assets/imgs/home/icons/dashboard-report-icon.svg";
import TokensIcon from "../assets/imgs/home/icons/token-icon.svg";

const Home = () => {
    return (
        <StyledContainer>
            <div className="home-content">
                <div className="home-block" style={{ backgroundImage: `url(${SloganBg})` }}>
                    <div className={cn("slogan-block", "block-content")}>
                        {/* <div className="title">Ocelot Pay</div> */}
                        <div className="slogan">Make sure your business touch millions crypto holders</div>
                        <div className="sub-slogan">Cryptocurrency payment saas platform</div>
                    </div>
                </div>
                <div className="home-title">Features</div>
                <div className="home-block">
                    <div className="feature-block block-content">
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(92, 201, 167, 0.2)" }}>
                                <img className="icon" src={EasyIcon} alt="" style={{ color: "rgb(92, 201, 167)" }} />
                            </div>
                            <div className="title">Best cryptocurrency payment experience</div>
                            <div className="desc">User friendly payment view, one click to pay with crypto tokens.</div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(104, 126, 255, 0.2)" }}>
                                <img className="icon" src={IntegrationIcon} alt="" />
                            </div>
                            <div className="title">Easy to integrate</div>
                            <div className="desc">
                                No code (low code) integration. It only take 3 steps to let your website be able to
                                accept crypto token payment.{" "}
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(246, 186, 111, 0.2)" }}>
                                <img className="icon" src={ControlIcon} alt="" />
                            </div>
                            <div className="title">Your assets at your control</div>
                            <div className="desc">
                                We don't hold any assets, user directly pay to your crypto account.No more need to
                                withdraw.
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(233, 87, 147, 0.2)" }}>
                                <img className="icon" src={DashboardIcon} alt="" />
                            </div>
                            <div className="title">Rich data dashboard</div>
                            <div className="desc">Rich data dashboard let you know your customer deeply.</div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(39, 158, 255, 0.2)" }}>
                                <img className="icon" src={TokensIcon} alt="" />
                            </div>
                            <div className="title">Multi cryptocurrency support</div>
                            <div className="desc">
                                Multi-chain, multi-token and multi-wallet support, give users more choices.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-title">Princing</div>
                <div className="home-title">Support By</div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "home" })`
    .home-content {
        width: 100%;
        margin: 0 auto;
        padding-bottom: 48px;

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

                .icon-wrapper {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    display: block;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .icon {
                        width: 30px;
                    }
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
