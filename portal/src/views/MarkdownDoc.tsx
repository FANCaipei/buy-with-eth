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

    .nav-toggle-icon {
        position: fixed;
        left: 10px;
        top: 90px;

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
        padding-top: 80px;
        background-color: #fff;

        width: 300px !important;
        min-width: 300px !important;
        max-width: 300px !important;

        &.inVisible {
            display: none;
        }
    }

    .markdown-content {
        padding: 0 40px 40px;
        margin-left: 300px;
        height: 100%;

        @media screen and (max-width: 800px) {
            margin-left: 0;
        }
    }

    img {
        width: 100%;
        max-width: 400px;
    }

    pre {
        background: #f7f7f7;
        padding: 15px;
        border-radius: 12px;
    }
    code {
        display: inline-block;
        width: 100%;
        font-family: MyFancyCustomFont, monospace;
        font-size: inherit;
        word-wrap: break-word;
        box-decoration-break: clone;
        padding: 0.1rem 0.3rem 0.2rem;
        border-radius: 0.2rem;
        white-space: pre;
        overflow-x: scroll;
    }

    .m-nav {
    }
`;

export default MarkDownDoc;
