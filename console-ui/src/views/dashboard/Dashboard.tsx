import { styled } from "styled-components";
import useProtectedPath from "../../common/hooks/useProtectedPath";
import { Button, Layout, Menu, MenuProps, Tooltip, Modal, Form, Input, message, Dropdown } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useCallback, useEffect, useState } from "react";
import {
    BarChartOutlined,
    AppstoreAddOutlined,
    FileDoneOutlined,
    FileTextFilled,
    LockOutlined,
    LogoutOutlined,
    UserOutlined,
    ExclamationCircleFilled,
    CommentOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useFirebaseAuth from "../../common/zustand/useFirebaseAuth";
import FirebaseManager from "../../common/firebase/FirebaseManager";
import { collection, getAggregateFromServer, query, sum, where } from "firebase/firestore";
import OcelotLogo from "../../assets/imgs/logos/logo.png";

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
    const [messageApi, contextHolder] = message.useMessage();
    const [activeMenuKey, setActiveMenuKey] = useState("overview");
    const [isChangePwdModalOpen, setIsChangePwdModalOpen] = useState(false);
    const [formInstace] = Form.useForm();
    const newPwd = Form.useWatch("newPassword", formInstace);
    // const repeatNewPwd = Form.useWatch("repeatNewPassword", formInstace);

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

    const repeatPwdValidator = useCallback(
        (_: any, value: any) => {
            if (value !== newPwd) {
                return Promise.reject("Comfirm password is not the same as new password");
            }
            return Promise.resolve();
        },
        [newPwd]
    );

    const Logout = useCallback(async () => {
        await FirebaseManager.auth.signOut();
        navigate("/auth", { replace: true });
    }, [navigate]);

    const changePwd = useCallback(async () => {
        await formInstace.validateFields();
        return FirebaseManager.updatePassword(newPwd)
            .then(() => {
                Logout();
            })
            .catch(() => {
                messageApi.open({
                    type: "error",
                    content: "Change password failed, you can reLogin and try again",
                });
            });
    }, [formInstace, newPwd, Logout, messageApi]);

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
            const snapshot = await getAggregateFromServer(q, {
                totalBill: sum("bill"),
            });
            if (snapshot?.data().totalBill > 1) {
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

    const [userDropDownItems] = useState([
        {
            key: "updatePwd",
            label: <div onClick={() => setIsChangePwdModalOpen(true)}>Change Password</div>,
            icon: <LockOutlined />,
        },
        {
            key: "logout",
            label: <div onClick={Logout}>Logout</div>,
            icon: <LogoutOutlined />,
        },
    ]);

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
            {contextHolder}
            <Layout hasSider>
                <Sider collapsible className="left-slider">
                    <div className="logo-container">
                        <img className="logo" src={OcelotLogo} alt="Logo" />
                        <span className="text">Ocelot Pay</span>
                    </div>
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
                            <Dropdown menu={{ items: userDropDownItems }}>
                                <Button type="text" icon={<UserOutlined />}></Button>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content className="panel-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
            <Modal
                className="change-pwd-modal"
                title="Change Password"
                open={isChangePwdModalOpen}
                onCancel={() => setIsChangePwdModalOpen(false)}
                onOk={changePwd}
                okText="Change password"
            >
                <Form form={formInstace} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ marginTop: "40px" }}>
                    <Form.Item
                        name="newPassword"
                        rules={[{ required: true, message: "New password is required" }]}
                        label="New Password"
                    >
                        <Input type="password" placeholder="New Password" />
                    </Form.Item>
                    <Form.Item
                        name="newRepeatPassword"
                        rules={[
                            { required: true, message: "Confirm password is required" },
                            { validator: repeatPwdValidator },
                        ]}
                        label="Confirm Password"
                    >
                        <Input type="password" placeholder="Confirm Password" />
                    </Form.Item>
                </Form>
            </Modal>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "dashboard-page" })`
    .ant-layout-sider.left-slider {
        height: 100vh;
        background: var(--sidebar-bg) !important;
        transition: width var(--apple-duration-normal) var(--apple-ease);

        .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
            padding: 12px 8px;
        }

        &.ant-layout-sider-collapsed {
            .logo-container {
                width: 100%;
                margin-left: 0;
                margin-right: 0;
                justify-content: center;
                overflow-x: hidden;

                .logo {
                    margin-right: 0;
                }

                .text {
                    display: none;
                }
            }
        }

        .logo-container {
            margin: 8px 12px 20px;
            border-radius: var(--apple-radius-md);
            display: flex;
            align-items: center;
            height: 36px;
            overflow-y: hidden;

            .logo {
                width: 32px;
                height: 32px;
                margin-right: 10px;
                border-radius: var(--apple-radius-sm);
            }
            .text {
                font-size: 18px;
                color: #fff;
                font-weight: 600;
                letter-spacing: -0.02em;
                white-space: nowrap;
            }
        }

        .ant-menu {
            background: transparent !important;
            border: none;
            padding: 0 4px;

            .ant-menu-item {
                border-radius: var(--apple-radius-sm);
                margin: 2px 0;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                font-weight: 500;
                color: var(--sidebar-text);
                transition: all var(--apple-duration-fast) var(--apple-ease);

                .ant-menu-item-icon {
                    font-size: 17px;
                    transition: color var(--apple-duration-fast) var(--apple-ease);
                }

                &:hover {
                    background: rgba(255, 255, 255, 0.08) !important;
                    color: #fff;
                }

                &.ant-menu-item-selected {
                    background: var(--sidebar-active) !important;
                    color: #fff;
                    font-weight: 600;

                    .ant-menu-item-icon {
                        color: #fff;
                    }
                }
            }

            .ant-menu-item::after {
                display: none;
            }
        }

        .ant-layout-sider-trigger {
            background: rgba(255, 255, 255, 0.05) !important;
            border: none;
            margin: 0 8px 4px;
            border-radius: var(--apple-radius-sm);
            transition: background var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                background: rgba(255, 255, 255, 0.1) !important;
            }
        }
    }

    .panel-layout {
        .panel-header {
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.72);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
            color: var(--apple-text-secondary);
            box-shadow: none;
            height: 52px;
            line-height: 52px;

            .email {
                font-size: 13px;
                font-weight: 500;
                color: var(--apple-text-secondary);
            }
            .action-btns {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                gap: 4px;

                .ant-btn {
                    border-radius: var(--apple-radius-sm);
                    transition: all var(--apple-duration-fast) var(--apple-ease);

                    &:hover {
                        background: var(--apple-gray-200);
                    }
                }

                .ant-btn-icon {
                    color: var(--apple-text-secondary);
                    font-size: 16px;
                }
            }
        }
        .panel-content {
            padding: 32px 24px;
            max-height: calc(100vh - 52px);
            overflow-y: auto;
            background: var(--apple-gray-bg);
            animation: apple-fade-in var(--apple-duration-normal) var(--apple-ease);

            &::-webkit-scrollbar {
                width: 6px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: var(--apple-gray-400);
                border-radius: 3px;
            }
        }
    }

    .change-pwd-modal {
        .ant-modal-content {
            border-radius: var(--apple-radius-lg);
            overflow: hidden;
            padding: 0;

            .ant-modal-header {
                padding: 20px 24px 0;
                border: none;
            }

            .ant-modal-title {
                font-size: 17px;
                font-weight: 600;
                color: var(--apple-text-primary);
                letter-spacing: -0.02em;
            }

            .ant-modal-body {
                padding: 20px 24px;
            }

            .ant-modal-footer {
                padding: 0 24px 20px;
                border: none;

                .ant-btn {
                    border-radius: 980px;
                    font-weight: 500;
                    transition: all var(--apple-duration-fast) var(--apple-ease);
                }

                .ant-btn-primary {
                    background: var(--apple-blue);
                    border-color: var(--apple-blue);

                    &:hover {
                        background: var(--apple-blue-hover);
                        border-color: var(--apple-blue-hover);
                    }
                }
            }

            .ant-form-item-label > label {
                font-weight: 500;
                color: var(--apple-text-secondary);
            }

            .ant-input {
                border-radius: var(--apple-radius-sm);
                transition: all var(--apple-duration-fast) var(--apple-ease);

                &:focus {
                    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.12);
                    border-color: var(--apple-blue);
                }
            }
        }
    }
`;

export default DashboardPage;
