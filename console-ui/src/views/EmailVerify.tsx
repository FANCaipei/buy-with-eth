import { useCallback, useEffect, useRef } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import useProtectedPath from "../common/hooks/useProtectedPath";

const EmailVerifyPage = () => {
    useProtectedPath();
    const countRef = useRef<number>(-1);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const sendVerifyEmail = useCallback(() => {
        if (FirebaseManager.auth.currentUser && !FirebaseManager.auth.currentUser.emailVerified) {
            // TODO: send email
            FirebaseManager.sendVerifyEmail()
                .then(() => {
                    countRef.current = 60;
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
    }, [messageApi]);

    const checkVerifyStateAndGoDashboard = useCallback(async () => {
        await FirebaseManager.auth.currentUser?.reload();
        if (FirebaseManager.auth.currentUser?.emailVerified) {
            navigate("/dashboard", {
                replace: true,
            });
        }
    }, [navigate]);

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
            }
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [countRef]);

    return (
        <StyledContainer>
            {contextHolder}
            <div>Please click active link in your email ({FirebaseManager.auth.currentUser?.email})</div>
            {countRef.current > 0 ? (
                <Button type="primary" disabled>
                    {countRef.current}
                </Button>
            ) : (
                <Button type="primary" onClick={sendVerifyEmail}>
                    Send Verify Email
                </Button>
            )}
            <Button onClick={checkVerifyStateAndGoDashboard}>Email verified</Button>
            <Button onClick={Logout}>Logout</Button>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "email-verify-page" })``;
export default EmailVerifyPage;
