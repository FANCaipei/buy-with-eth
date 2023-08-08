import { styled } from "styled-components";
import useProtectedPath from "../../common/hooks/useProtectedPath";
import { Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useCallback, useEffect } from "react";
import { BarChartOutlined, AppstoreAddOutlined, UserOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";

const items: MenuProps["items"] = [
    {
        key: "overview", // the path
        icon: React.createElement(BarChartOutlined),
        label: `Overview`,
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
    useProtectedPath();

    const navigate = useNavigate();

    const onMenuItemClick = useCallback(
        (item: any) => {
            if (!item?.key) {
                return;
            }
            navigate(item.key);
        },
        [navigate]
    );

    useEffect(() => {
        // default panel
        navigate("overview");
    }, []);

    return (
        <StyledContainer>
            <Layout hasSider>
                <Sider collapsible className="left-slider">
                    <div className="logo-container" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["overview"]}
                        items={items}
                        onClick={onMenuItemClick}
                    />
                </Sider>
                <Layout>
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
`;

export default DashboardPage;
