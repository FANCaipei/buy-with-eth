import { Form, Input } from "antd";
import { styled } from "styled-components";

const AuthPage = () => {
    return (
        <StyledContainer>
            <div className="title">Title</div>
            <Form>
                <Form.Item name="email">
                    <Input type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item name="password">
                    <Input type="password" placeholder="Password" />
                </Form.Item>
            </Form>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "auth-page" })`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export default AuthPage;
