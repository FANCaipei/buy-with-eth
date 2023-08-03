import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";

const routeConfig = [
    { path: "/auth", Component: AuthPage },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
