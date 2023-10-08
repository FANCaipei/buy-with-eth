import { Layout } from "antd";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import MarkdownNavbar from "markdown-navbar";
import { styled } from "styled-components";
import "markdown-navbar/dist/navbar.css";
import { useEffect, useState } from "react";

const DocPath = require("../constants/IntegrationDoc.md");

const { Content, Sider } = Layout;

const MarkDownDoc = () => {
    const [article, setArticle] = useState<string>("");

    useEffect(() => {
        fetch(DocPath).then(resp => {
            resp.text().then(content => {
                setArticle(content);
            });
        });
    }, []);
    return (
        <StyledContainer>
            <Layout hasSider style={{ height: "100%", backgroundColor: "transparent" }}>
                <Sider
                    width={300}
                    style={{
                        overflow: "auto",
                        height: "100vh",
                        position: "fixed",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        paddingTop: "80px",
                        backgroundColor: "#fff",
                    }}
                >
                    <MarkdownNavbar source={article} className="m-nav" />
                </Sider>
                <Content
                    style={{
                        padding: "0 40px 20px",
                        marginLeft: "300px",
                        height: "100%",
                        // overflow: "scroll",
                    }}
                >
                    <ReactMarkdown children={article}></ReactMarkdown>
                </Content>
            </Layout>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "markdown-doc" })`
    height: 100%;

    img {
        max-width: 400px;
    }

    .m-nav {
    }
`;

export default MarkDownDoc;
