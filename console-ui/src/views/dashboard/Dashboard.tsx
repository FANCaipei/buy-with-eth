import { styled } from "styled-components";
import useProtectedPath from "../../common/hooks/useProtectedPath";
import { Button, Layout, Menu, MenuProps, Tooltip, Modal } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useCallback, useEffect, useState } from "react";
import {
    BarChartOutlined,
    AppstoreAddOutlined,
    FileDoneOutlined,
    FileTextFilled,
    LogoutOutlined,
    ExclamationCircleFilled,
    CommentOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useFirebaseAuth from "../../common/zustand/useFirebaseAuth";
import FirebaseManager from "../../common/firebase/FirebaseManager";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

const { confirm } = Modal;

let isBillModalDisplayedOrQuering = false;

const MenuItemsData: MenuProps["items"] = [
    {
        key: "overview", // the path
        icon: React.createElement(BarChartOutlined),
        label: `Analyse`,
    },
    {
        key: "projects", // the path
        icon: React.createElement(AppstoreAddOutlined),
        label: `Projects`,
    },
    {
        key: "bills", // the path
        icon: React.createElement(FileDoneOutlined),
        label: `Bills`,
    },
    {
        key: "feedback", // the path
        icon: React.createElement(CommentOutlined),
        label: `Feedback`,
    },
];

const AllowedSubPaths = ["overview", "projects", "bills", "projectSetting", "paymentPreview", "feedback"];

const DashboardPage = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [activeMenuKey, setActiveMenuKey] = useState("overview");

    const { user } = useFirebaseAuth() as any;

    const onMenuItemClick = useCallback(
        (item: any) => {
            if (!item?.key) {
                return;
            }
            navigate(`/dashboard/${item.key}`);
        },
        [navigate]
    );

    const Logout = useCallback(async () => {
        await FirebaseManager.auth.signOut();
        navigate("/auth", { replace: true });
    }, [navigate]);

    const checkIfHasUnpaiedBill = useCallback(async () => {
        if (!user?.uid || isBillModalDisplayedOrQuering) {
            return;
        }
        isBillModalDisplayedOrQuering = true;
        try {
            const q = query(
                collection(FirebaseManager.firestore, `invoices/${user.uid}/invoices`),
                where("paied", "!=", true)
            );
            const snapshot = await getCountFromServer(q);
            if (snapshot?.data().count) {
                // show confirm modal
                confirm({
                    title: "Unpaid Bills",
                    icon: <ExclamationCircleFilled />,
                    content: "You have unpaid bill, go Bills and check?",
                    okText: "Go",
                    cancelText: "cancel",
                    onOk() {
                        navigate("/dashboard/bills");
                    },
                    onCancel() {
                        // console.log("Cancel");
                    },
                });
            }
        } catch (error) {
            isBillModalDisplayedOrQuering = false;
        }
    }, [user?.uid, navigate]);

    const goDoc = useCallback(() => {
        window.open("https://ocelotpay.com/doc", "_blank");
    }, []);

    useEffect(() => {
        const paths = (pathname ?? "").split("/");
        // if (paths[1] !== "dashboard") {
        //     return;
        // }
        const panelKey = paths[2];
        const availablePath = MenuItemsData.map(item => item?.key);
        if (availablePath.includes(panelKey)) {
            setActiveMenuKey(panelKey);
        }
        if (!AllowedSubPaths.includes(panelKey)) {
            // default panel
            navigate("/dashboard/overview", { replace: true });
        }
    }, [pathname, navigate]);

    useEffect(() => {
        checkIfHasUnpaiedBill();
    }, [checkIfHasUnpaiedBill]);

    // must at the end
    useProtectedPath();

    return (
        <StyledContainer>
            <Layout hasSider>
                <Sider collapsible className="left-slider">
                    <div className="logo-container" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[activeMenuKey]}
                        items={MenuItemsData}
                        onClick={onMenuItemClick}
                    />
                </Sider>
                <Layout className="panel-layout">
                    <Header className="panel-header">
                        <span className="email">{user?.email}</span>
                        <div className="action-btns">
                            <Tooltip title="Doc">
                                <Button type="text" icon={<FileTextFilled />} onClick={goDoc}></Button>
                            </Tooltip>
                            <Tooltip title="SignOut">
                                <Button type="text" icon={<LogoutOutlined />} onClick={Logout}></Button>
                            </Tooltip>
                        </div>
                    </Header>
                    <Content className="panel-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "dashboard-page" })`
    .ant-layout-sider.left-slider {
        height: 100vh;
        .logo-container {
            height: 32px;
            margin: 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
        }
    }

    .panel-layout {
        .panel-header {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: transparent;
            color: rgb(71, 98, 130);
            box-shadow: rgba(0, 0, 0, 0.1) 2px 8px 12px;

            .email {
                font-size: 14px;
            }
            .action-btns {
                display: flex;
                justify-content: flex-end;
                align-items: center;

                .ant-btn-icon {
                    color: rgb(71, 98, 130);
                }
            }
        }
        .panel-content {
            padding: 40px 20px;
            max-height: calc(100vh - 60px);
            overflow-y: scroll;
        }
    }
`;

export default DashboardPage;
