import { Button, Form, Input } from "antd";
import { useCallback } from "react";
import { styled } from "styled-components";

const AuthPage = () => {
    const [formInstace] = Form.useForm();
    const email = Form.useWatch("email", formInstace);
    const password = Form.useWatch("password", formInstace);
    const repeatPwd = Form.useWatch("repeat-password", formInstace);

    const repeatPwdValidator = useCallback(
        (_: any, value: any) => {
            if (value !== password) {
                return Promise.reject("Repeat password is not the same as password");
            }
            return Promise.resolve();
        },
        [password]
    );

    const signIn = useCallback(async () => {
        const validateResult = await formInstace.validateFields();
        console.log("validate result: ", validateResult);
        if (password !== repeatPwd) {
            return;
        }
        // TODO: call firebase signin
        console.log(email, password, repeatPwd);
    }, [password, repeatPwd, email, formInstace]);

    return (
        <StyledContainer>
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
                    <Input type="repeat-password" placeholder="Repeat your password" />
                </Form.Item>
            </Form>
            <Button type="primary" onClick={signIn}>
                SignIn
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
