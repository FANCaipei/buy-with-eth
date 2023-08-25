import AuthPage from "../../views/Auth";
import NotFoundPage from "../../views/NotFound";
import EmailVerifyPage from "../../views/EmailVerify";
import DashboardPage from "../../views/dashboard/Dashboard";
import AppManagement from "../../views/dashboard/content/appManagement/AppManagement";
import BusinessOverview from "../../views/dashboard/content/businessOverview/BusinessOverview";
import ProjectEdit from "../../views/dashboard/content/appManagement/subViews/ProjectEdit";
import PaymentPreview from "../../views/dashboard/content/appManagement/subViews/PaymentPreview";
import Bills from "../../views/dashboard/content/bills/Bills";

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
            { path: "bills", Component: Bills },
            { path: "projectSetting", Component: ProjectEdit },
            { path: "paymentPreview", Component: PaymentPreview },
        ],
    },
    { path: "*", Component: NotFoundPage },
];

export default routeConfig;
