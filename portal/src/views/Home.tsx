import styled from "styled-components";
// import SloganBg from "../assets/imgs/home/slogan-bg.jpeg";
import cn from "classnames";
import EasyIcon from "../assets/imgs/home/icons/cliqz-icon.svg";
import IntegrationIcon from "../assets/imgs/home/icons/puzzle-icon.svg";
import ControlIcon from "../assets/imgs/home/icons/cryptocurrency-bitcoin-icon.svg";
import DashboardIcon from "../assets/imgs/home/icons/dashboard-report-icon.svg";
import TokensIcon from "../assets/imgs/home/icons/token-icon.svg";
import GoogleLogo from "../assets/imgs/home/support-logos/google.svg";
import AwsLogo from "../assets/imgs/home/support-logos/aws.svg";
import EthLogo from "../assets/imgs/home/support-logos/ethereum.svg";
import PolygonLogo from "../assets/imgs/home/support-logos/polygon.png";
import { useCallback } from "react";

const Home = () => {
    const goConsole = useCallback(() => {
        window.open("https://console.ocelotpay.com/", "_blank");
    }, []);

    return (
        <StyledContainer>
            <div className="home-content">
                <div
                    className="home-block"
                    style={{
                        marginTop: "0",
                        height: "70vh",
                        // backgroundImage: `url(${SloganBg})`,
                        background: "linear-gradient(140deg,rgb(16,131,241),rgb(24,34,109))",
                    }}
                >
                    <div className={cn("slogan-block", "block-content")}>
                        {/* <div className="title">Ocelot Pay</div> */}
                        <div className="slogan">Reach millions of cryptocurrency holders with ease</div>
                        {/* <div className="sub-slogan">Cryptocurrency payment saas platform</div> */}
                        <div className="sub-slogan">By seamlessly incorporating Ocelot Pay</div>
                        <div className="sub-slogan" style={{ marginTop: "0" }}>
                            your go-to cryptocurrency payment SaaS platform for businesses
                        </div>
                    </div>
                </div>
                <div id="features"></div>
                <div className="home-block">
                    <div className="feature-small-title">Features</div>
                    <div className="feature-big-title">Why Ocelot Pay</div>
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
                <div id="price"></div>
                <div className="home-block" style={{ backgroundColor: "rgb(11, 22, 63)" }}>
                    <div className="price-block">
                        <div className="price-home-title">Pricing</div>
                        <div className="title">Pay as you go, no transaction no fee. No cost for trying</div>
                        <div className="desc">
                            <ul>
                                <li>$0.1/transaction for first 1000 transactions per month</li>
                                <li>$0.05/transaction for first 10000 transactions per month</li>
                                <li>$0.03/transaction for first 100000 transactions per month</li>
                                <li>Bill will be generated on the 1st day of next month</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="home-block">
                    <div className="support-block">
                        <div className="home-title">Supported By</div>
                        <div className="logo-containers">
                            <img className="logo-item" src={GoogleLogo} alt="Google" />
                            <img className="logo-item" src={AwsLogo} alt="AWS" />
                            <img className="logo-item" src={EthLogo} alt="Ethereum" />
                            <img className="logo-item" src={PolygonLogo} alt="Polygon" />
                        </div>
                    </div>
                </div>
                <div className="home-block" style={{ backgroundColor: "rgb(99, 99, 172)" }}>
                    <div className="start-block">
                        <div className="main-desc">
                            Hundreds apps are completing thousands payments every day on Ocelot Pay
                        </div>
                        <div className="sub-desc">Don't want to wait anymore</div>
                        <div className="start-btn" onClick={goConsole}>
                            Start now
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
        background-color: rgb(248, 249, 250);

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
            margin-top: 48px;

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
                text-align: center;
                /* color: rgb(22, 116, 174); */
                color: #fff;
            }
            .sub-slogan {
                font-size: 20px;
                font-weight: bold;
                margin-top: 20px;
                /* color: rgba(0, 0, 0, 0.88); */
                color: rgba(255, 255, 255, 0.8);
            }
        }
        .feature-small-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            color: rgb(255, 177, 22);
            padding: 48px 0 0px;
        }
        .feature-big-title {
            font-size: 36px;
            font-weight: bold;
            text-align: center;
            color: rgb(11, 22, 63);
            padding-bottom: 48px;
        }
        .feature-block {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: repeat(2, 1fr);
            column-gap: 20px;
            row-gap: 20px;
            padding-bottom: 48px;

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
        .price-block {
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-bottom: 48px;

            .price-home-title {
                font-size: 20px;
                font-weight: bold;
                width: 100%;
                text-align: center;
                color: rgb(255, 107, 107);
                padding: 48px 0 0px;
            }
            .title {
                font-size: 36px;
                font-weight: bold;
            }
            .desc {
                margin-top: 20px;
                font-size: 16px;
                line-height: 32px;
            }
        }
        .support-block {
            .logo-containers {
                width: 100%;
                filter: grayscale(100%);
                padding: 40px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-column-gap: 20px;
                justify-items: center;
                align-items: center;

                .logo-item {
                    height: 40px;
                }
            }
        }
        .start-block {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #fff;

            .main-desc {
                margin-top: 48px;
                font-size: 24px;
                font-weight: bold;
            }
            .sub-desc {
                margin-top: 32px;
                font-size: 16px;
            }
            .start-btn {
                margin-top: 80px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                padding: 20px 60px;
                background-color: rgb(140, 206, 134);
                border-bottom: 2px solid #6abf62;
                border-right: 2px solid #6abf62;
                transition: all 0.3s ease-in-out;

                &:hover {
                    background-color: #73b0f4;
                    border-right: 2px solid #4495f0;
                    border-bottom: 2px solid #4495f0;
                }
            }
        }
    }
`;

export default Home;
