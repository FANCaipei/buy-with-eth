import styled from "styled-components";
import MetamaskIcon from "../assets/images/wallet-logos/metamask.svg";
import CoinbaseIcon from "../assets/images/wallet-logos/coinbase.svg";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ConnectWallet() {
    const { state: params } = useLocation();
    const navigate = useNavigate();

    const metamaskDetedcted = useCallback(() => {
        return (window as any).OcelotPay.utils.ethereumProvider.detectProviders()?.metamask != null;
    }, []);

    const coinbaseDetedcted = useCallback(() => {
        return (window as any).OcelotPay.utils.ethereumProvider.detectProviders()?.coinbase != null;
    }, []);

    const connectMetamask = useCallback(async () => {
        const metamaskProvider = (window as any).OcelotPay.utils.ethereumProvider.detectProviders()?.metamask;
        if (!metamaskProvider) {
            window.open("https://metamask.io/download/", "_blank");
        } else {
            const accountAddr = await (window as any).OcelotPay.utils.walletManager.connectWallet(
                metamaskProvider,
                "metamask"
            );
            if (accountAddr) {
                navigate("/payment", {
                    replace: true,
                    state: params,
                });
            }
        }
    }, [params, navigate]);
    const connectCoinbase = useCallback(async () => {
        const coinbaseProvider = (window as any).OcelotPay.utils.ethereumProvider.detectProviders()?.coinbase;
        if (!coinbaseProvider) {
            window.open("https://www.coinbase.com/wallet/downloads", "_blank");
        } else {
            const accountAddr = await (window as any).OcelotPay.utils.walletManager.connectWallet(
                coinbaseProvider,
                "coinbase"
            );
            if (accountAddr) {
                navigate("/payment", {
                    replace: true,
                    state: params,
                });
            }
        }
    }, [navigate, params]);
    return (
        <StyledContainer>
            <div className="title">Connect Wallet</div>
            <div className="wallets-contianer">
                <div className="wallet-logo-wrapper" onClick={connectMetamask}>
                    <img src={MetamaskIcon} alt="Metamask" />
                    <div className="wallet-name">Metamask</div>
                    <div className="not-detected">{metamaskDetedcted() ? "" : "Not Installed"}</div>
                </div>
                <div className="wallet-logo-wrapper" onClick={connectCoinbase}>
                    <img src={CoinbaseIcon} alt="Coinbase" />
                    <div className="wallet-name">Coinbase</div>
                    <div className="not-detected">{coinbaseDetedcted() ? "" : "Not Installed"}</div>
                </div>
            </div>
            <div className="spacer"></div>
            <div className="bottom-block">
                <span className="text">
                    Powered by{" "}
                    <a target="_blank" rel="noreferrer" href="https://ocelotpay.com">
                        Ocelot Pay
                    </a>
                </span>
                <img className="logo-img" src="" alt="" />
            </div>
        </StyledContainer>
    );
}

const StyledContainer = styled.div.attrs({ className: "connect-wallet-page" })`
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
    padding: 0 28px 20px;
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 80px;
        text-align: center;
        color: var(--apple-text-primary);
        letter-spacing: -0.02em;
    }

    .wallets-contianer {
        margin-top: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;

        .wallet-logo-wrapper {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 40px;
            border-radius: var(--apple-radius-lg);
            background: var(--apple-surface);
            border: 1px solid var(--apple-border-light);
            transition: all var(--apple-duration-normal) var(--apple-ease);
            min-width: 160px;

            &:hover {
                transform: translateY(-4px);
                box-shadow: var(--apple-shadow-md);
                border-color: var(--apple-blue);

                .not-detected {
                    opacity: 1;
                }
            }

            &:active {
                transform: translateY(-2px) scale(0.98);
            }

            img {
                width: 72px;
                height: 72px;
                transition: transform var(--apple-duration-normal) var(--apple-ease-spring);
            }

            &:hover img {
                transform: scale(1.08);
            }

            .wallet-name {
                margin-top: 16px;
                font-size: 16px;
                font-weight: 600;
                color: var(--apple-text-primary);
            }

            .not-detected {
                margin-top: 6px;
                font-size: 12px;
                height: 16px;
                color: var(--apple-text-tertiary);
                opacity: 0;
                transition: opacity var(--apple-duration-normal) var(--apple-ease);
            }
        }
    }

    .spacer {
        flex-grow: 1;
    }

    .bottom-block {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 16px;
        border-top: 1px solid var(--apple-border-light);
        width: 100%;

        .text {
            font-size: 13px;
            color: var(--apple-text-tertiary);
            font-weight: 500;

            a {
                color: var(--apple-blue);
                text-decoration: none;
                transition: color var(--apple-duration-fast) var(--apple-ease);

                &:hover {
                    color: var(--apple-blue-hover);
                }
            }
        }
    }
`;

export default ConnectWallet;
