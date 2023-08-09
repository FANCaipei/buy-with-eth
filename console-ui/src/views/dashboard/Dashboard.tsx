import { styled } from "styled-components";
import useProtectedPath from "../../common/hooks/useProtectedPath";
import { Button, Layout, Menu, MenuProps, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useCallback, useEffect, useState } from "react";
import { BarChartOutlined, AppstoreAddOutlined, UserOutlined, FileTextFilled, LogoutOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useFirebaseAuth from "../../common/zustand/useFirebaseAuth";
import FirebaseManager from "../../common/firebase/FirebaseManager";

const MenuItemsData: MenuProps["items"] = [
    {
        key: "overview", // the path
        icon: React.createElement(BarChartOutlined),
        label: `Analyse`,
    },
    {
        key: "appManagement", // the path
        icon: React.createElement(AppstoreAddOutlined),
        label: `Applications`,
    },
    {
        key: "account", // the path
        icon: React.createElement(UserOutlined),
        label: `Account`,
    },
];

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
            navigate(item.key);
        },
        [navigate]
    );

    const Logout = useCallback(async () => {
        await FirebaseManager.auth.signOut();
        navigate("/auth", { replace: true });
    }, [navigate]);

    useEffect(() => {
        const paths = (pathname ?? "").split("/");
        if (paths[1] !== "dashboard") {
            return;
        }
        const panelKey = paths[2];
        const availablePath = MenuItemsData.map(item => item?.key);
        if (availablePath.includes(panelKey)) {
            setActiveMenuKey(panelKey);
        } else {
            // default panel
            navigate("overview", { replace: true });
        }
    }, [pathname, navigate]);

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
                                <Button type="text" icon={<FileTextFilled />}></Button>
                            </Tooltip>
                            <Tooltip title="SignOut">
                                <Button type="text" icon={<LogoutOutlined />} onClick={Logout}></Button>
                            </Tooltip>
                        </div>
                    </Header>
                    <Content>
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
        padding: 0 20px;

        .panel-header {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: transparent;
            color: rgb(71, 98, 130);

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
    }
`;

export default DashboardPage;
