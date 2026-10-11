import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../../../../common/firebase/FirebaseManager";
import { collection, getDocs, query } from "firebase/firestore";
import useFirebaseAuth from "../../../../common/zustand/useFirebaseAuth";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import { PlusOutlined } from "@ant-design/icons";
import AppCard from "./component/AppCard";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

const AppManagement = () => {
    const { user } = useFirebaseAuth() as any;
    const navigate = useNavigate() as any;

    const [apps, setApps] = useState<Array<any>>([]);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

    const navToNewProject = useCallback(() => {
        navigate("/dashboard/projectSetting");
    }, [navigate]);

    const getAllApps = useCallback(async () => {
        if (!user?.uid) {
            return;
        }
        setIsLoadingData(true);
        try {
            const q = query(collection(FirebaseManager.firestore, `userAppConfigs/${user.uid}/apps`));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setApps([]);
                setIsLoadingData(false);
                return;
            }
            const tempData: Array<any> = [];
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempData.push({ ...doc.data(), id: doc.id });
                }
            });
            setApps(tempData);
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsLoadingData(false);
    }, [user?.uid]);

    useEffect(() => {
        getAllApps();
    }, [getAllApps]);

    return (
        <StyledContainer>
            <PanelTitle title="Projects" />
            <Spin spinning={isLoadingData}>
                <div className="content">
                    <div className="add-app-card" onClick={navToNewProject}>
                        <PlusOutlined className="add-icon" />
                        <div className="text">Add Project</div>
                    </div>
                    {apps.map(appData => (
                        <div className="card-container" key={appData?.id}>
                            <AppCard appData={appData} onDelete={getAllApps} />
                        </div>
                    ))}
                </div>
            </Spin>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "app-management" })`
    animation: apple-fade-in var(--apple-duration-normal) var(--apple-ease);

    .content {
        margin-top: 32px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .add-app-card {
            width: 300px;
            height: 210px;
            background: var(--apple-surface);
            padding: 20px;
            margin-top: 20px;
            margin-right: 20px;
            border-radius: var(--apple-radius-lg);
            border: 2px dashed var(--apple-border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--apple-blue);
            cursor: pointer;
            transition: all var(--apple-duration-normal) var(--apple-ease);

            &:hover {
                border-color: var(--apple-blue);
                background: rgba(0, 113, 227, 0.04);
                transform: translateY(-4px);
                box-shadow: var(--apple-shadow-md);
            }

            .add-icon {
                font-size: 32px;
                transition: transform var(--apple-duration-normal) var(--apple-ease-spring);
            }

            &:hover .add-icon {
                transform: scale(1.15);
            }

            .text {
                font-size: 14px;
                font-weight: 600;
                margin-top: 10px;
                letter-spacing: -0.01em;
            }
        }
        .card-container {
            margin-top: 20px;
            margin-right: 20px;
        }
    }
`;

export default AppManagement;
