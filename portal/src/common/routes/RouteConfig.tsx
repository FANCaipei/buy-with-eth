import Home from "../../views/Home";
import MarkDownDoc from "../../views/MarkdownDoc";

const routeConfig = [
    { path: "/home", Component: Home },
    { path: "/doc", Component: MarkDownDoc },
    { path: "*", Component: Home },
];

export default routeConfig;
