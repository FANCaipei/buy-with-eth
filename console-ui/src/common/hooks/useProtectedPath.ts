import { useEffect } from "react";
import useFirebaseAuth from "../zustand/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

const useProtectedPath = () => {
    const { user } = useFirebaseAuth() as any;
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/auth", { replace: true });
        } else if (!user.emailVerified) {
            navigate("/emailVerify", { replace: true });
        }
    }, [user]);
};

export default useProtectedPath;
