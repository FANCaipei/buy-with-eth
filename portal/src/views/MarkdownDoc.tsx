import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import MarkdownNavbar from "markdown-navbar";
import { styled } from "styled-components";
import "markdown-navbar/dist/navbar.css";
import { useCallback, useEffect, useState } from "react";
import cn from "classnames";

const DocPath = require("../constants/IntegrationDoc.md");

const { Content, Sider } = Layout;

const MarkDownDoc = () => {
    const [article, setArticle] = useState<string>("");
    const [isNavVisible, setIsNavVisible] = useState(false);

    const showNav = useCallback(() => {
        setIsNavVisible(true);
    }, []);

    const hideNav = useCallback(() => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        if (vw > 800) {
            return;
        }
        setIsNavVisible(false);
    }, []);

    useEffect(() => {
        fetch(DocPath).then(resp => {
            resp.text().then(content => {
                setArticle(content);
            });
        });
    }, []);

    useEffect(() => {
        window.addEventListener("click", hideNav);

        return () => {
            window.removeEventListener("click", hideNav);
        };
    }, [hideNav]);

    useEffect(() => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        if (vw > 800) {
            setIsNavVisible(true);
        }
    }, []);

    return (
        <StyledContainer>
            <MenuOutlined
                onClick={e => {
                    e.stopPropagation();
                    showNav();
                }}
                className="nav-toggle-icon"
            />
            <Layout hasSider style={{ height: "100%", backgroundColor: "transparent" }}>
                <Sider
                    className={cn({ "markdown-sider": true, inVisible: !isNavVisible })}
                    onClick={e => e.stopPropagation()}
                >
                    <MarkdownNavbar source={article} className="m-nav" />
                </Sider>

                <Content className="markdown-content">
                    <ReactMarkdown children={article}></ReactMarkdown>
                </Content>
            </Layout>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "markdown-doc" })`
    height: 100%;
    position: relative;
    animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

    .nav-toggle-icon {
        position: fixed;
        left: 16px;
        top: 72px;
        font-size: 18px;
        color: var(--apple-text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: var(--apple-radius-sm);
        transition: all var(--apple-duration-fast) var(--apple-ease);
        z-index: 10;

        &:hover {
            background: var(--apple-gray-200);
            color: var(--apple-text-primary);
        }

        @media screen and (min-width: 800px) {
            display: none;
        }
    }

    .markdown-sider {
        overflow: auto;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        padding-top: 72px;
        background-color: var(--apple-surface);
        border-right: 1px solid var(--apple-border-light);

        width: 280px !important;
        min-width: 280px !important;
        max-width: 280px !important;

        &.inVisible {
            display: none;
        }

        &::-webkit-scrollbar {
            width: 0;
        }
    }

    .markdown-content {
        padding: 24px 48px 48px;
        margin-left: 280px;
        height: 100%;
        overflow-y: auto;
        max-width: 800px;

        @media screen and (max-width: 800px) {
            margin-left: 0;
            padding: 24px 20px;
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--apple-text-primary);
            font-weight: 600;
            letter-spacing: -0.02em;
            margin-top: 2em;
        }

        h1 { font-size: 32px; }
        h2 { font-size: 24px; }
        h3 { font-size: 20px; }

        p {
            color: var(--apple-text-secondary);
            line-height: 1.7;
            font-size: 16px;
        }

        a {
            color: var(--apple-blue);
            text-decoration: none;
            transition: color var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                color: var(--apple-blue-hover);
                text-decoration: underline;
            }
        }
    }

    img {
        width: 100%;
        max-width: 400px;
        border-radius: var(--apple-radius-md);
    }

    pre {
        background: var(--apple-gray-200);
        padding: 20px;
        border-radius: var(--apple-radius-md);
        border: 1px solid var(--apple-border-light);
        overflow-x: auto;
    }

    code {
        display: inline-block;
        width: 100%;
        font-family: "SF Mono", SFMono-Regular, ui-monospace, Menlo, monospace;
        font-size: 14px;
        word-wrap: break-word;
        box-decoration-break: clone;
        padding: 0;
        border-radius: 0;
        white-space: pre;
        overflow-x: auto;
        color: var(--apple-text-primary);
    }

    p code, li code {
        display: inline;
        width: auto;
        background: var(--apple-gray-200);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 14px;
        color: var(--apple-blue);
    }
`;

export default MarkDownDoc;
