import { styled } from "styled-components";
import GeneralUtils from "../../../../../common/utils/GeneralUtils";
import { Button, Tooltip, Modal } from "antd";
import { SettingFilled, DeleteFilled, WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import FirebaseManager from "../../../../../common/firebase/FirebaseManager";
import useFirebaseAuth from "../../../../../common/zustand/useFirebaseAuth";

const AppCard = ({ appData, onDelete }: { appData: any; onDelete?: (appData: any) => {} }) => {
    const { user } = useFirebaseAuth() as any;
    const navigate = useNavigate();

    const goSetting = useCallback(
        (event: any) => {
            event?.stopPropagation();
            navigate("/dashboard/projectSetting", {
                state: {
                    appData: appData,
                },
            });
        },
        [navigate, appData]
    );

    const goPaymentPreview = useCallback(() => {
        navigate("/dashboard/paymentPreview", {
            state: {
                appId: `${user.uid}-${appData.id}`,
                appName: appData.name,
            },
        });
    }, [navigate, user?.uid, appData?.id, appData?.name]);

    const deleteProject = useCallback(async (): Promise<void> => {
        if (!user?.uid) {
            return Promise.reject();
        }
        const deleteResult = await deleteDoc(
            doc(FirebaseManager.firestore, `userAppConfigs/${user.uid}/apps/${appData?.id}`)
        );
        // delete private info doc, no need await, we don't care if it success
        deleteDoc(doc(FirebaseManager.firestore, `userAppConfigs/${user.uid}/apps/${appData?.id}/private/privateInfo`));
        onDelete?.(appData);
        return deleteResult;
    }, [appData, user?.uid, onDelete]);

    const confirmDeleteProject = useCallback(
        (event: any) => {
            event?.stopPropagation();
            if (!appData?.id) {
                return;
            }
            Modal.confirm({
                centered: true,
                title: "Delete Project",
                icon: <WarningOutlined />,
                content: (() => (
                    <span>
                        Comfirm to delete <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>{appData?.name}</span>
                    </span>
                ))(),
                okText: "Confirm",
                okType: "danger",
                cancelText: "Cancel",
                onOk: deleteProject,
                onCancel: () => {},
            });
        },
        [appData?.id, appData?.name, deleteProject]
    );

    return (
        <StyledContainer onClick={goPaymentPreview}>
            <div className="title-block">
                <div className="left-side">
                    <div className="title">{appData?.name}</div>
                    <div className="address">{GeneralUtils.maskAddress(appData?.paymentAddress)}</div>
                </div>
                <img className="logo-img" src={appData?.logoUrl} alt="" />
            </div>

            <div className="action-icons">
                <Tooltip title="Setting">
                    <Button type="text" icon={<SettingFilled />} onClick={goSetting}></Button>
                </Tooltip>
                <Tooltip title="Delete">
                    <Button type="text" icon={<DeleteFilled />} onClick={confirmDeleteProject}></Button>
                </Tooltip>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "app-card-container" })`
    width: 300px;
    height: 210px;
    background: var(--apple-surface);
    padding: 24px;
    border-radius: var(--apple-radius-lg);
    cursor: pointer;
    border: 1px solid var(--apple-border-light);
    box-shadow: var(--apple-shadow-sm);
    position: relative;
    transition: all var(--apple-duration-normal) var(--apple-ease);

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--apple-shadow-md);
        border-color: var(--apple-blue);
    }

    .title-block {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left-side {
            .title {
                font-size: 18px;
                font-weight: 600;
                color: var(--apple-text-primary);
                letter-spacing: -0.02em;
            }
            .address {
                margin-top: 8px;
                font-size: 13px;
                color: var(--apple-text-secondary);
                font-family: "SF Mono", SFMono-Regular, ui-monospace, monospace;
            }
        }
        .logo-img {
            width: 44px;
            border-radius: var(--apple-radius-sm);
            transition: transform var(--apple-duration-normal) var(--apple-ease-spring);
        }
    }

    &:hover .logo-img {
        transform: scale(1.08);
    }

    .action-icons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;

        .ant-btn {
            border-radius: var(--apple-radius-sm);
            transition: all var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                background: var(--apple-gray-200);
            }
        }

        .ant-btn-icon {
            color: var(--apple-text-secondary);
            font-size: 15px;
        }
    }
`;

export default AppCard;
