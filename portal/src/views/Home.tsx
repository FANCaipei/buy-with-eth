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
                            <div className="desc">
                                Easily navigate our user-friendly payment interface, enabling one-click cryptocurrency
                                token payments.
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(104, 126, 255, 0.2)" }}>
                                <img className="icon" src={IntegrationIcon} alt="" />
                            </div>
                            <div className="title">Easy to integrate</div>
                            <div className="desc">
                                Seamless integration with minimal code. Transform your website to accept cryptocurrency
                                token payments in just three simple steps.
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(246, 186, 111, 0.2)" }}>
                                <img className="icon" src={ControlIcon} alt="" />
                            </div>
                            <div className="title">Your assets at your control</div>
                            <div className="desc">
                                Your assets, your control. Users make direct payments to your crypto account without the
                                need for withdrawal.
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(233, 87, 147, 0.2)" }}>
                                <img className="icon" src={DashboardIcon} alt="" />
                            </div>
                            <div className="title">Rich data dashboard</div>
                            <div className="desc">Comprehensive data dashboard for in-depth customer insights.</div>
                        </div>
                        <div className="feature-item">
                            <div className="icon-wrapper" style={{ backgroundColor: "rgba(39, 158, 255, 0.2)" }}>
                                <img className="icon" src={TokensIcon} alt="" />
                            </div>
                            <div className="title">Diverse cryptocurrency compatibility</div>
                            <div className="desc">
                                Enhanced flexibility with support for multiple chains, tokens, and wallets, providing
                                users with a wide range of options.
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
                                {/* <li>$0.10 per transaction for the initial 1,000 transactions each month.</li>
                                <li>$0.05 per transaction for the initial 10,000 transactions each month.</li>
                                <li>$0.03 per transaction for the initial 100,000 transactions each month.</li> */}
                                <li>0.2% processing fee + 0 gas fee </li>
                                <li>You receive exactly the coins user paid, and pay processing fees later </li>
                                <li>Invoices will be generated on the first day of the upcoming month.</li>
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
                            Ocelot Pay facilitates thousands of transactions daily across hundreds of applications.
                        </div>
                        <div className="sub-desc">No more waiting</div>
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
        background-color: var(--apple-surface);

        .home-title {
            font-size: 48px;
            font-weight: 600;
            width: 100%;
            color: var(--apple-text-primary);
            text-align: center;
            padding: 50px 0 20px;
            letter-spacing: -0.03em;
        }

        .home-block {
            min-height: 45vh;
            background-size: cover;
            background-repeat: no-repeat;
            margin-top: 0;

            .block-content {
                min-height: 45vh;
                height: 100%;
                max-width: 1200px;
                width: 100vw;
                margin: 0 auto;
                padding: 0 24px;
            }
        }

        .slogan-block {
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            animation: apple-fade-in 0.8s var(--apple-ease);

            .slogan {
                font-size: 48px;
                font-weight: 700;
                margin-top: 0;
                text-align: center;
                color: #fff;
                letter-spacing: -0.03em;
                line-height: 1.15;
                max-width: 800px;

                @media screen and (max-width: 800px) {
                    font-size: 32px;
                    padding: 0 20px;
                }
            }

            .sub-slogan {
                font-size: 21px;
                font-weight: 400;
                margin-top: 16px;
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
                letter-spacing: -0.01em;
                line-height: 1.4;

                @media screen and (max-width: 800px) {
                    font-size: 17px;
                    padding: 0 20px;
                }
            }
        }

        .feature-small-title {
            font-size: 17px;
            font-weight: 600;
            text-align: center;
            color: var(--apple-blue);
            padding: 80px 0 8px;
            letter-spacing: -0.01em;
        }

        .feature-big-title {
            font-size: 48px;
            font-weight: 700;
            text-align: center;
            color: var(--apple-text-primary);
            padding-bottom: 48px;
            letter-spacing: -0.03em;

            @media screen and (max-width: 800px) {
                font-size: 32px;
            }
        }

        .feature-block {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 20px;
            row-gap: 20px;
            padding-bottom: 80px;

            @media screen and (max-width: 800px) {
                grid-template-columns: 1fr;
                padding: 0 20px 60px;
            }

            .feature-item {
                padding: 40px;
                background-color: var(--apple-gray-200);
                border-radius: var(--apple-radius-lg);
                transition: all var(--apple-duration-normal) var(--apple-ease);

                &:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--apple-shadow-md);
                    background-color: var(--apple-surface);
                }

                @media screen and (max-width: 800px) {
                    padding: 28px;
                }

                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--apple-radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    transition: transform var(--apple-duration-normal) var(--apple-ease-spring);

                    .icon {
                        width: 24px;
                    }
                }

                &:hover .icon-wrapper {
                    transform: scale(1.1);
                }

                .title {
                    font-size: 19px;
                    font-weight: 600;
                    color: var(--apple-text-primary);
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                }

                .desc {
                    font-size: 15px;
                    line-height: 1.5;
                    color: var(--apple-text-secondary);
                }
            }
        }

        .price-block {
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 24px;

            .price-home-title {
                font-size: 17px;
                font-weight: 600;
                width: 100%;
                text-align: center;
                color: var(--apple-blue);
                padding: 0 0 8px;
                letter-spacing: -0.01em;
            }

            .title {
                font-size: 48px;
                font-weight: 700;
                text-align: center;
                letter-spacing: -0.03em;
                line-height: 1.15;
                max-width: 700px;

                @media screen and (max-width: 800px) {
                    font-size: 32px;
                }
            }

            .desc {
                margin-top: 48px;
                font-size: 19px;
                line-height: 1.6;
                font-weight: 400;

                @media screen and (max-width: 800px) {
                    font-size: 17px;
                }

                ul {
                    list-style: none;
                    padding: 0;

                    li {
                        padding: 8px 0;
                        position: relative;
                        padding-left: 24px;

                        &::before {
                            content: "";
                            position: absolute;
                            left: 0;
                            top: 16px;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.5);
                        }
                    }
                }
            }
        }

        .support-block {
            padding: 80px 0;

            .logo-containers {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                filter: grayscale(100%);
                opacity: 0.5;
                padding: 40px 24px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-column-gap: 40px;
                justify-items: center;
                align-items: center;
                transition: all var(--apple-duration-normal) var(--apple-ease);

                &:hover {
                    opacity: 0.8;
                }

                @media screen and (max-width: 800px) {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                }

                .logo-item {
                    height: 36px;
                }
            }
        }

        .start-block {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #fff;
            padding: 80px 24px;

            .main-desc {
                font-size: 32px;
                font-weight: 700;
                text-align: center;
                letter-spacing: -0.03em;
                line-height: 1.2;
                max-width: 700px;

                @media screen and (max-width: 800px) {
                    font-size: 24px;
                }
            }

            .sub-desc {
                margin-top: 12px;
                font-size: 19px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.8);
            }

            .start-btn {
                margin-top: 48px;
                font-size: 17px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 980px;
                padding: 16px 40px;
                background-color: var(--apple-surface);
                color: var(--apple-blue);
                border: none;
                transition: all var(--apple-duration-normal) var(--apple-ease);
                letter-spacing: -0.01em;

                &:hover {
                    transform: scale(1.04);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }

                &:active {
                    transform: scale(0.98);
                }
            }
        }
    }
`;

export default Home;
