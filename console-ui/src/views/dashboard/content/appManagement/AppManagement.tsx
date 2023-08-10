import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import FirebaseManager from "../../../../common/firebase/FirebaseManager";
import { collection, getDocs, query } from "firebase/firestore";
import useFirebaseAuth from "../../../../common/zustand/useFirebaseAuth";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import { PlusOutlined } from "@ant-design/icons";
import AppCard from "./component/AppCard";
import { Spin } from "antd";

const AppManagement = () => {
    const { user } = useFirebaseAuth() as any;

    const [apps, setApps] = useState<Array<any>>([]);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

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
                return;
            }
            const tempData: Array<any> = [];
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempData.push({ ...doc.data(), id: doc.id });
                }
            });
            console.log("temp data: ", tempData);
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
                    <div className="add-app-card">
                        <PlusOutlined className="add-icon" />
                        <div className="text">Add Project</div>
                    </div>
                    {apps.map(appData => (
                        <div className="card-container" key={appData?.id}>
                            <AppCard appData={appData} />
                        </div>
                    ))}
                </div>
            </Spin>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "app-management" })`
    .content {
        margin-top: 40px;
        display: flex;
        align-items: center;
        .add-app-card {
            width: 300px;
            height: 210px;
            background-color: #fff;
            padding: 20px;
            margin-top: 20px;
            margin-right: 20px;
            border-radius: 8px;
            box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgb(26, 115, 232);
            cursor: pointer;

            &:hover {
                background-color: rgb(245, 245, 245);
            }

            .add-icon {
                font-size: 36px;
            }
            .text {
                font-size: 14px;
                margin-top: 10px;
            }
        }
        .card-container {
            margin-top: 20px;
            margin-right: 20px;
        }
    }
`;

export default AppManagement;
