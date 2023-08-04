import { useEffect } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../common/firebase/FirebaseManager";

const EmailVerifyPage = () => {
    useEffect(() => {
        if (!FirebaseManager.auth?.currentUser) {
        }
    }, []);

    return <StyledContainer></StyledContainer>;
};

const StyledContainer = styled.div.attrs({ className: "email-verify-page" })``;
export default EmailVerifyPage;
