import { NavigateFunction } from "react-router-dom";

const GlobalNavObj: {
    navigate: NavigateFunction | null;
} = {
    navigate: null,
};

export default GlobalNavObj;
