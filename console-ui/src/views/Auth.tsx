import { Button, Form, Input, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import BgImg from "../assets/imgs/home-bg.jpg";

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
    const [isSendingMail, setIsSendingMail] = useState(false);
    const countRef = useRef<number>(-1);
    const [countdownNumber, setCountdownNumber] = useState<number>(-1);

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

    const sendResetEmail = useCallback(async () => {
        await formInstace.validateFields();
        setIsSendingMail(true);

        FirebaseManager.sendRestPwdEmail(email)
            .then(() => {
                const countNumber = 60;
                countRef.current = countNumber;
                setCountdownNumber(countNumber);
                messageApi.open({
                    type: "success",
                    content: "Email sent successfully",
                });
            })
            .catch(() => {
                messageApi.open({
                    type: "error",
                    content: "Send email failed",
                });
            })
            .finally(() => {
                setIsSendingMail(false);
            });
    }, [formInstace, email, messageApi]);

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
                <Button
                    type="primary"
                    onClick={sendResetEmail}
                    className="form-btn"
                    size="large"
                    loading={isSendingMail}
                    disabled={countdownNumber > 0}
                    style={{ marginTop: "0px" }}
                >
                    {countdownNumber > 0 ? `Resend available in ${countdownNumber}s` : "Send Email"}
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
    }, [isResetPwdMode, isSignUpMode, isAuthing, login, signUp, sendResetEmail, countdownNumber, isSendingMail]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (countRef.current > 0) {
                countRef.current--;
                setCountdownNumber(countRef.current);
            }
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [countRef, setCountdownNumber]);

    return (
        <StyledContainer style={{ backgroundImage: `url(${BgImg})` }}>
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
    background-color: var(--apple-gray-bg);
    background-size: cover;
    background-repeat: no-repeat;

    .container {
        width: 440px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        animation: apple-fade-in var(--apple-duration-slow) var(--apple-ease);

        .title {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 48px;
            text-align: center;
            width: 100%;
            color: var(--apple-text-primary);
            letter-spacing: -0.03em;
        }
        .auth-card {
            margin-top: -8vh;
            width: 100%;
            padding: 32px;
            border-radius: var(--apple-radius-lg);
            background: var(--apple-surface);
            box-shadow: var(--apple-shadow-lg);
            border: 1px solid var(--apple-border-light);
            transition: box-shadow var(--apple-duration-normal) var(--apple-ease);

            &:hover {
                box-shadow: var(--apple-shadow-xl);
            }

            .forget-pwd-title-block {
                position: relative;
                display: flex;
                align-items: center;
                flex-direction: column;
                margin-bottom: 28px;
                text-align: center;

                .back-icon {
                    font-size: 18px;
                    cursor: pointer;
                    position: absolute;
                    left: 0;
                    top: 4px;
                    color: var(--apple-blue);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all var(--apple-duration-fast) var(--apple-ease);

                    &:hover {
                        background: var(--apple-gray-200);
                    }
                }
                .title-text {
                    font-size: 22px;
                    font-weight: 600;
                    color: var(--apple-text-primary);
                    letter-spacing: -0.02em;
                }
                .sub-text {
                    margin-top: 12px;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--apple-text-secondary);
                }
            }

            .ant-form {
                .ant-form-item {
                    margin-bottom: 20px;

                    .ant-form-item-label > label {
                        font-size: 13px;
                        font-weight: 600;
                        color: var(--apple-text-secondary);
                        letter-spacing: -0.01em;
                    }
                }

                .ant-input {
                    height: 44px;
                    border-radius: var(--apple-radius-sm);
                    border: 1px solid var(--apple-border);
                    font-size: 15px;
                    color: var(--apple-text-primary);
                    transition: all var(--apple-duration-fast) var(--apple-ease);
                    background: var(--apple-gray-100);

                    &::placeholder {
                        color: var(--apple-text-tertiary);
                    }

                    &:hover {
                        border-color: var(--apple-gray-500);
                    }

                    &:focus {
                        border-color: var(--apple-blue);
                        box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.12);
                        background: var(--apple-surface);
                    }
                }
            }

            .form-btn {
                width: 100%;
                height: 44px;
                margin-top: 28px;
                border-radius: 980px;
                font-size: 15px;
                font-weight: 600;
                background: var(--apple-blue);
                border-color: var(--apple-blue);
                letter-spacing: -0.01em;
                transition: all var(--apple-duration-fast) var(--apple-ease);
                box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);

                &:hover {
                    background: var(--apple-blue-hover);
                    border-color: var(--apple-blue-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35);
                }

                &:active {
                    transform: translateY(0);
                    background: var(--apple-blue-active);
                    border-color: var(--apple-blue-active);
                }
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
                    color: var(--apple-text-tertiary);
                }
                .toogle-btn {
                    margin-left: 4px;
                    cursor: pointer;
                    color: var(--apple-blue);
                    font-weight: 500;
                    transition: color var(--apple-duration-fast) var(--apple-ease);

                    &:hover {
                        color: var(--apple-blue-hover);
                    }
                }
            }

            .forget-password {
                text-align: right;
                cursor: pointer;
                color: var(--apple-blue);
                font-weight: 500;
                transition: color var(--apple-duration-fast) var(--apple-ease);

                &:hover {
                    color: var(--apple-blue-hover);
                }
            }
        }
    }
`;

export default AuthPage;
