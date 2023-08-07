import { Button, Form, Input, message } from "antd";
import { useCallback, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const [formInstace] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const email = Form.useWatch("email", formInstace);
    const password = Form.useWatch("password", formInstace);
    const repeatPwd = Form.useWatch("repeat-password", formInstace);
    const navigate = useNavigate();
    const [test, setTest] = useState();

    const repeatPwdValidator = useCallback(
        (_: any, value: any) => {
            if (value !== password) {
                return Promise.reject("Repeat password is not the same as password");
            }
            return Promise.resolve();
        },
        [password]
    );

    const signUp = useCallback(async () => {
        await formInstace.validateFields();
        if (password !== repeatPwd) {
            return;
        }

        FirebaseManager.signUp(email, password)
            .then(() => {
                navigate("/emailVerify", {
                    replace: true,
                });
            })
            .catch(() => {
                messageApi.open({
                    type: "error",
                    content: "Sign up failed",
                });
            });
    }, [messageApi, navigate, password, repeatPwd, email, formInstace]);

    return (
        <StyledContainer>
            {contextHolder}
            <div className="title">Title</div>
            <Form form={formInstace}>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        { pattern: /^[\w-.]+@([\w-]+.)+[\w-]+$/g, message: "Invalid email format" },
                    ]}
                >
                    <Input type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item
                    name="repeat-password"
                    rules={[
                        { required: true, message: "Repeat password is required" },
                        { validator: repeatPwdValidator },
                    ]}
                >
                    <Input type="password" placeholder="Repeat your password" />
                </Form.Item>
            </Form>
            <Button type="primary" onClick={signUp}>
                SignUp
            </Button>
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
