import styled from "styled-components";
import MetamaskIcon from "../assets/images/wallet-logos/metamask.svg";
import CoinbaseIcon from "../assets/images/wallet-logos/coinbase.svg";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ConnectWallet() {
    const { state: params } = useLocation();
    const navigate = useNavigate();

    const metamaskDetedcted = useCallback(() => {
        return (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.metamask != null;
    }, []);

    const coinbaseDetedcted = useCallback(() => {
        return (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.coinbase != null;
    }, []);

    const connectMetamask = useCallback(async () => {
        const metamaskProvider = (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.metamask;
        if (!metamaskProvider) {
            window.open("https://metamask.io/download/", "_blank");
        } else {
            const accountAddr = await (window as any).buyWithCrypto.utils.walletManager.connectWallet(
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
        const coinbaseProvider = (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.coinbase;
        if (!coinbaseProvider) {
            window.open("https://www.coinbase.com/wallet/downloads", "_blank");
        } else {
            const accountAddr = await (window as any).buyWithCrypto.utils.walletManager.connectWallet(
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
                <span className="text">Powered by xxxx</span>
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
    padding-bottom: 20px;

    .title {
        font-size: 24px;
        font-weight: 500;
        margin-top: 100px;
        text-align: center;
    }

    .wallets-contianer {
        margin-top: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        .wallet-logo-wrapper {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 40px;

            &:hover {
                position: relative;
                top: -10px;
                transition: top 0.5s ease-in-out;

                .not-detected {
                    opacity: 1;
                }
            }

            img {
                width: 80px;
                height: 80px;
            }

            .wallet-name {
                margin-top: 20px;
                font-size: 16;
                font-weight: 500;
            }

            .not-detected {
                margin-top: 4px;
                font-size: 12px;
                height: 16px;
                color: rgba(0, 0, 0, 0.45);
                opacity: 0;
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
        color: rgba(0, 0, 0, 0.45);

        .text {
            font-size: 14px;
            margin-right: 8px;

            .logo-img {
                height: 20px;
            }
        }
    }
`;

export default ConnectWallet;
