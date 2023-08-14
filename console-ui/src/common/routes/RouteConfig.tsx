import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";
import EmailVerifyPage from "../../views/EmailVerify";
import DashboardPage from "../../views/dashboard/Dashboard";
import AppManagement from "../../views/dashboard/content/appManagement/AppManagement";
import BusinessOverview from "../../views/dashboard/content/businessOverview/BusinessOverview";
import Account from "../../views/dashboard/content/accout/Account";
import ProjectEdit from "../../views/dashboard/content/appManagement/subViews/ProjectEdit";
import PaymentPreview from "../../views/dashboard/content/appManagement/subViews/PaymentPreview";

const routeConfig = [
    { path: "/auth", Component: AuthPage },
    { path: "/emailVerify", Component: EmailVerifyPage },
    {
        path: "/dashboard",
        Component: DashboardPage,
        children: [
            {
                path: "projects",
                Component: AppManagement,
            },
            { path: "overview", Component: BusinessOverview, index: true },
            { path: "account", Component: Account },
            { path: "projectSetting", Component: ProjectEdit },
            { path: "paymentPreview", Component: PaymentPreview },
        ],
    },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
