import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";
import EmailVerifyPage from "../../views/EmailVerify";
import DashboardPage from "../../views/dashboard/Dashboard";
import AppManagement from "../../views/dashboard/content/AppManagement";
import BusinessOverview from "../../views/dashboard/content/BusinessOverview";
import Account from "../../views/dashboard/content/Account";

const routeConfig = [
    { path: "/auth", Component: AuthPage },
    { path: "/emailVerify", Component: EmailVerifyPage },
    {
        path: "/dashboard",
        Component: DashboardPage,
        children: [
            { path: "appManagement", Component: AppManagement },
            { path: "overview", Component: BusinessOverview, index: true },
            { path: "account", Component: Account },
        ],
    },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
