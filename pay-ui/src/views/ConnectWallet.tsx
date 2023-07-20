import styled from "styled-components";
import MetamaskIcon from "../assets/images/wallet-logos/metamask.jpg";
import CoinbaseIcon from "../assets/images/wallet-logos/coinbase.jpg";
import { useCallback } from "react";

function ConnectWallet() {
    const connectMetamask = useCallback(() => {
        const metamaskProvider = (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.metamask;
        if (!metamaskProvider) {
            window.open("https://metamask.io/download/", "_blank");
        } else {
            (window as any).buyWithCrypto.utils.walletManager.connectWallet(metamaskProvider, "metamask");
        }
    }, []);
    const connectCoinbase = useCallback(() => {
        const coinbaseProvider = (window as any).buyWithCrypto.utils.ethereumProvider.detectProviders()?.coinbase;
        if (!coinbaseProvider) {
            window.open("https://www.coinbase.com/wallet", "_blank");
        } else {
            (window as any).buyWithCrypto.utils.walletManager.connectWallet(coinbaseProvider, "coinbase");
        }
    }, []);
    return (
        <StyledContainer>
            <div className="wallet-logo-wrapper" onClick={connectMetamask}>
                <img src={MetamaskIcon} alt="Metamask" />
            </div>
            <div className="wallet-logo-wrapper" onClick={connectCoinbase}>
                <img src={CoinbaseIcon} alt="Coinbase" />
            </div>
        </StyledContainer>
    );
}

const StyledContainer = styled.div.attrs({ className: "connect-wallet-page" })`
    display: flex;
    align-items: center;
    justify-content: center;

    .wallet-logo-wrapper {
        cursor: pointer;
        display: felx;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
        img {
            width: 60px;
            height: 60px;
        }
    }
`;

export default ConnectWallet;
