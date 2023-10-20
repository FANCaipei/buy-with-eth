import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import useProtectedPath from "../common/hooks/useProtectedPath";
import OcelotLogo from "../assets/imgs/logos/logo.png";

const EmailVerifyPage = () => {
    useProtectedPath();
    const countRef = useRef<number>(-1);
    const [countdownNumber, setCountdownNumber] = useState<number>(-1);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const sendVerifyEmail = useCallback(() => {
        if (countRef.current > 0) {
            return;
        }
        if (FirebaseManager.auth.currentUser && !FirebaseManager.auth.currentUser.emailVerified) {
            FirebaseManager.sendVerifyEmail()
                .then(() => {
                    const totalCountdown = 60;
                    countRef.current = totalCountdown;
                    setCountdownNumber(totalCountdown);
                    messageApi.open({
                        type: "success",
                        content: "Email sent, please check your mail",
                    });
                })
                .catch(() => {
                    messageApi.open({
                        type: "error",
                        content: "Send email failed, please try later",
                    });
                });
        }
    }, [messageApi, countRef]);

    const checkVerifyStateAndGoDashboard = useCallback(async () => {
        await FirebaseManager.auth.currentUser?.reload();
        if (FirebaseManager.auth.currentUser?.emailVerified) {
            navigate("/dashboard", {
                replace: true,
            });
        } else {
            messageApi.open({
                type: "error",
                content: "Email not verified",
            });
        }
    }, [navigate, messageApi]);

    const Logout = useCallback(async () => {
        await FirebaseManager.auth.signOut();
        navigate("/auth", { replace: true });
    }, [navigate]);

    useEffect(() => {
        if (FirebaseManager.auth.currentUser?.emailVerified) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

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
        <StyledContainer>
            {contextHolder}
            <img src={OcelotLogo} alt="Ocelot Pay Logo" className="logo" />
            <div className="title">Please verify your email</div>
            <div className="desc">
                We just sent an email to <br /> <span className="email">{FirebaseManager.auth.currentUser?.email}</span>
                . <br /> Click the link in the email to verify your account.
            </div>
            <div className="spacer"></div>
            <div className="go-console-block" onClick={checkVerifyStateAndGoDashboard}>
                <span className="text">go console</span>
                <div className="go-console-icon">
                    <ArrowRightOutlined />
                </div>
            </div>
            <div className="btn-row">
                <Button
                    type="primary"
                    onClick={sendVerifyEmail}
                    size="large"
                    disabled={countdownNumber > 0 ? true : false}
                    className="action-btn"
                >
                    {countdownNumber > 0 ? `${countdownNumber}s` : "Resend email"}
                </Button>
                <Button onClick={Logout} size="large" className="action-btn">
                    Change account
                </Button>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "email-verify-page" })`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
    }
    .title {
        font-size: 32px;
    }
    .desc {
        font-size: 16px;
        margin-top: 20px;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        line-height: 24px;

        .email {
            font-weight: bold;
            font-style: italic;
        }
    }
    /* .spacer {
        height: 100px;
    } */
    @keyframes moveArrow {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(20%);
        }
    }
    .go-console-block {
        font-size: 16px;
        color: #1677ff;
        cursor: pointer;
        margin-right: 8px;
        margin: 0px 0 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            .go-console-icon {
                animation-play-state: paused;
            }
        }

        .go-console-icon {
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation-name: moveArrow;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            animation-timing-function: ease-in-out;
        }
    }

    .btn-row {
        width: 350px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .action-btn {
            width: 45%;
        }
    }
`;
export default EmailVerifyPage;
