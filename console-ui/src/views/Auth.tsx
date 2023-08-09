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
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [isAuthing, setIsAuthing] = useState<boolean>(false);

    const toggleAuthMode = useCallback(() => {
        if (isAuthing) {
            return;
        }
        setIsSignUpMode(!isSignUpMode);
    }, [isAuthing, isSignUpMode]);

    const repeatPwdValidator = useCallback(
        (_: any, value: any) => {
            if (value !== password) {
                return Promise.reject("Repeat password is not the same as password");
            }
            return Promise.resolve();
        },
        [password]
    );

    const login = useCallback(async () => {
        await formInstace.validateFields();
        setIsAuthing(true);
        FirebaseManager.login(email, password)
            .then(() => {
                navigate("/dashboard", {
                    replace: true,
                });
            })
            .catch(() => {
                messageApi.open({
                    type: "error",
                    content: "Login failed",
                });
            })
            .finally(() => {
                setIsAuthing(false);
            });
    }, [navigate, email, formInstace, messageApi, password]);

    const signUp = useCallback(async () => {
        await formInstace.validateFields();
        if (password !== repeatPwd) {
            return;
        }
        setIsAuthing(true);
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
            })
            .finally(() => {
                setIsAuthing(false);
            });
    }, [messageApi, navigate, password, repeatPwd, email, formInstace]);

    return (
        <StyledContainer>
            {contextHolder}
            <div className="container">
                <div className="title">Title</div>
                <div className="auth-card">
                    <Form form={formInstace} layout={"vertical"} size="large">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Email is required" },
                                { pattern: /^[\w-.]+@([\w-]+.)+[\w-]+$/g, message: "Invalid email format" },
                            ]}
                            label="Email"
                        >
                            <Input type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Password is required" }]}
                            label="Password"
                        >
                            <Input type="password" placeholder="Password" />
                        </Form.Item>
                        {isSignUpMode ? (
                            <Form.Item
                                name="repeat-password"
                                rules={[
                                    { required: true, message: "Repeat password is required" },
                                    { validator: repeatPwdValidator },
                                ]}
                                label="Repeat password"
                            >
                                <Input type="password" placeholder="Repeat your password" />
                            </Form.Item>
                        ) : null}
                    </Form>
                    {isSignUpMode ? (
                        <Button type="primary" onClick={signUp} className="form-btn" size="large" loading={isAuthing}>
                            SignUp
                        </Button>
                    ) : (
                        <Button type="primary" onClick={login} className="form-btn" size="large" loading={isAuthing}>
                            Login
                        </Button>
                    )}
                </div>
                <div className="toggle-mode-container">
                    <span className="desc">
                        {isSignUpMode ? "Already have an account? " : `Don't have an account? `}
                    </span>
                    <span className="toogle-btn" onClick={toggleAuthMode}>
                        {isSignUpMode ? "Login" : "SignUp"}
                    </span>
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "auth-page" })`
    height: 100%;
    width: 100%;

    .container {
        width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 40px;
            margin-top: 80px;
            // font-style: italic;
        }
        .auth-card {
            width: 400px;
            padding: 20px;
            border-radius: 12px;
            background-color: #fff;
            box-shadow: rgba(60, 66, 87, 0.2) 0px 8px 24px;

            .ant-form {
                .ant-form-item {
                    label {
                        font-size: 14px;
                        font-weight: bold;
                    }
                }
            }

            .form-btn {
                width: 100%;
                margin-top: 40px;
            }
        }
        .toggle-mode-container {
            margin-top: 20px;
            font-size: 14px;
            user-select: none;

            .desc {
                color: rgba(0, 0, 0, 0.25);
            }
            .toogle-btn {
                margin-left: 8px;
                cursor: pointer;
                color: rgb(84, 105, 212);
            }
        }
    }
`;

export default AuthPage;
