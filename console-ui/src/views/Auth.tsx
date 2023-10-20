import { Button, Form, Input, message } from "antd";
import { useCallback, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const AuthPage = () => {
    const [formInstace] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const email = Form.useWatch("email", formInstace);
    const password = Form.useWatch("password", formInstace);
    const repeatPwd = Form.useWatch("repeat-password", formInstace);
    const navigate = useNavigate();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [isAuthing, setIsAuthing] = useState<boolean>(false);
    const [isResetPwdMode, setIsResetPwdMode] = useState(false);

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

    const buildActionBtn = useCallback(() => {
        if (isResetPwdMode) {
            return (
                <Button type="primary" className="form-btn" size="large" style={{ marginTop: "0px" }}>
                    Send Email
                </Button>
            );
        } else {
            return isSignUpMode ? (
                <Button type="primary" onClick={signUp} className="form-btn" size="large" loading={isAuthing}>
                    SignUp
                </Button>
            ) : (
                <Button type="primary" onClick={login} className="form-btn" size="large" loading={isAuthing}>
                    Login
                </Button>
            );
        }
    }, [isResetPwdMode, isSignUpMode, isAuthing, login, signUp]);

    return (
        <StyledContainer>
            {contextHolder}
            <div className="container">
                <div className="auth-card">
                    {isResetPwdMode ? (
                        <div className="forget-pwd-title-block">
                            <LeftOutlined className="back-icon" onClick={() => setIsResetPwdMode(false)} />
                            <div className="title-text">Rest Password</div>
                            <div className="sub-text">
                                Enter the email address associated with your account and we'll send you a link to reset
                                your password.
                            </div>
                        </div>
                    ) : (
                        <div className="title">Ocelot Pay</div>
                    )}

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
                        {isResetPwdMode ? null : (
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: "Password is required" }]}
                                label="Password"
                            >
                                <Input type="password" placeholder="Password" />
                            </Form.Item>
                        )}
                        {!isResetPwdMode && isSignUpMode ? (
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
                    {buildActionBtn()}
                </div>
                {isResetPwdMode ? null : (
                    <div className="follow-row">
                        <div className="toggle-mode-container">
                            <span className="desc">
                                {isSignUpMode ? "Already have an account? " : `Don't have an account? `}
                            </span>
                            <span className="toogle-btn" onClick={toggleAuthMode}>
                                {isSignUpMode ? "Login" : "SignUp"}
                            </span>
                        </div>
                        <div className="forget-password" onClick={() => setIsResetPwdMode(true)}>
                            Forgot password?
                        </div>
                    </div>
                )}
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "auth-page" })`
    height: 100%;
    width: 100%;
    background-color: rgb(246, 247, 249);

    .container {
        width: 440px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 60px;
            // font-style: italic;
            text-align: center;
            color: rgb(17, 137, 255);
        }
        .auth-card {
            margin-top: -10vh;
            width: 400px;
            padding: 20px;
            border-radius: 12px;
            background-color: #fff;
            box-shadow: rgba(60, 66, 87, 0.2) 0px 8px 24px;

            .forget-pwd-title-block {
                position: relative;
                display: flex;
                align-items: center;
                flex-direction: column;
                margin-bottom: 30px;
                text-align: center;

                .back-icon {
                    font-size: 20px;
                    cursor: pointer;
                    position: absolute;
                    left: 0;
                    top: 4px;
                }
                .title-text {
                    font-size: 24px;
                    color: rgba(0, 0, 0, 0.9);
                }
                .sub-text {
                    margin-top: 20px;
                    font-size: 14px;
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.6);
                }
            }

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
        .follow-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 20px;
            user-select: none;

            .toggle-mode-container {
                .desc {
                    color: rgba(0, 0, 0, 0.25);
                }
                .toogle-btn {
                    margin-left: 8px;
                    cursor: pointer;
                    color: rgb(84, 105, 212);
                }
            }

            .forget-password {
                text-align: right;
                cursor: pointer;
                color: rgb(84, 105, 212);
            }
        }
    }
`;

export default AuthPage;
