import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalNavObj from "../GlobalNavObj";

const NavHelper = () => {
    const navigate = useNavigate();
    useEffect(() => {
        GlobalNavObj.navigate = navigate;
    }, [navigate]);
};

export default NavHelper;
