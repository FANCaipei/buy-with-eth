import styled from "styled-components";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const Feedback = () => {
    const [isLoadingIframe, setisLoadingIframe] = useState(true);
    const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

    useEffect(() => {
        const onIframeLoad = () => {
            setisLoadingIframe(false);
        };
        iframeRef?.addEventListener("load", onIframeLoad);
    }, [iframeRef]);

    return (
        <StyledContainer>
            <PanelTitle title="Feedback" />
            <div className="iframe-wrapper">
                <Spin spinning={isLoadingIframe}>
                    <iframe
                        title="feedback"
                        src="https://e.zonka.co/u6Q0Mw?zf_embed=1&zf_embedintrooff=0&zf_embedheaderoff=0&zf_embedfooteroff=1&zf_embednavigation=1"
                        className="feedback-iframe"
                        ref={setIframeRef}
                        style={{ height: "60vh" }}
                    />
                </Spin>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: apple-fade-in var(--apple-duration-normal) var(--apple-ease);

    .iframe-wrapper {
        width: 100%;
        height: 50vh;
        max-width: 50vw;
        margin: 10vh auto 0;
        background: var(--apple-surface);
        border-radius: var(--apple-radius-lg);
        border: 1px solid var(--apple-border-light);
        box-shadow: var(--apple-shadow-sm);
        overflow: hidden;

        .feedback-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
`;

export default Feedback;
