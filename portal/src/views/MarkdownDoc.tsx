import { Layout } from "antd";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import MarkdownNavbar from "markdown-navbar";
import { styled } from "styled-components";
import "markdown-navbar/dist/navbar.css";

const { Content, Sider } = Layout;

// Mock data
const article = `# Markdown-Navbar Demo
 
## Chicken Chicken 1
 
Chicken Chicken Chicken Chicken Chicken.
 
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
 
### Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken.
 
#### Chicken Chicken Chicken Chicken
##### tertet
 
Chicken Chicken Chicken Chicken Chicken Chicken.
## Chicken Chicken 2
 
Chicken Chicken Chicken Chicken Chicken.
 
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
 
### Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken.
 
#### Chicken Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken Chicken.
## Chicken Chicken 3
 
Chicken Chicken Chicken Chicken Chicken.
 
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
 
### Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken.
 
#### Chicken Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken Chicken.
## Chicken Chicken 4
 
Chicken Chicken Chicken Chicken Chicken.
 
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
* Chicken Chicken Chicken Chicken Chicken.
 
### Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken.
 
#### Chicken Chicken Chicken Chicken
 
Chicken Chicken Chicken Chicken Chicken Chicken.
`;

const MarkDownDoc = () => {
    return (
        <StyledContainer>
            <Layout hasSider style={{ height: "100%", backgroundColor: "transparent" }}>
                <Sider
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
                    <MarkdownNavbar source={article} />
                </Sider>
                <Content
                    style={{
                        padding: "0 40px 20px",
                        marginLeft: "200px",
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
`;

export default MarkDownDoc;
