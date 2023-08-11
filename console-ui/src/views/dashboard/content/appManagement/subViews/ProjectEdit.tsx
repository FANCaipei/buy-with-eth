import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";
import LogoUploader from "../../../../../componets/LogoUploader";
import { ethers } from "ethers";
import FirebaseManager from "../../../../../common/firebase/FirebaseManager";
import { doc, setDoc } from "firebase/firestore";
import useFirebaseAuth from "../../../../../common/zustand/useFirebaseAuth";
import useProtectedPath from "../../../../../common/hooks/useProtectedPath";

const AddressValidator = async (_rule: any, value: any) => {
    return ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject("Invalid crypto address");
};

const ProjectEdit = () => {
    useProtectedPath();
    const navigate = useNavigate();
    const { user } = useFirebaseAuth() as any;
    const [formInstace] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { state } = useLocation();
    const [logoFileOrUrl, setLogoFileOrUrl] = useState<File | string>();
    const projectName = Form.useWatch("name", formInstace);
    const receiveAddress = Form.useWatch("address", formInstace);
    const callbackApi = Form.useWatch("callbackApi", formInstace);
    const [isSaving, setIsSaving] = useState(false);
    const [projectId, setProjectId] = useState<string | null>();

    const onLogoChange = useCallback((imageFile: File) => {
        setLogoFileOrUrl(imageFile);
    }, []);

    const uploadLogo = useCallback(
        async (pId: string): Promise<string> => {
            if (typeof logoFileOrUrl === "string" || logoFileOrUrl == null) {
                return logoFileOrUrl ?? "";
            } else {
                // upload
                const url = await FirebaseManager.uploadFileToFireStorage(logoFileOrUrl, pId);
                return url;
            }
        },
        [logoFileOrUrl]
    );

    const createProject = useCallback(async () => {
        const requestData = {
            name: projectName,
            paymentAddress: receiveAddress,
            callbackApi: callbackApi,
        };
        setIsSaving(true);
        try {
            const res = await FirebaseManager.serverCallFunctions.createApp(requestData);
            if (res?.data?.id) {
                const logoUrl = await uploadLogo(res.data.id);
                if (logoUrl && logoUrl !== "") {
                    const docRef = doc(FirebaseManager.firestore, `userAppConfigs/${user?.uid}/apps/${res.data.id}`);
                    await setDoc(
                        docRef,
                        {
                            logoUrl: logoUrl,
                        },
                        { merge: true }
                    );
                    navigate(-1);
                }
            }
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsSaving(false);
    }, [callbackApi, projectName, receiveAddress, uploadLogo, navigate, user?.uid]);

    const editProject = useCallback(async () => {
        if (projectId == null) {
            return;
        }
        setIsSaving(true);
        try {
            const logoUrl = await uploadLogo(projectId);
            if (logoUrl && logoUrl !== "") {
                const docRef = doc(FirebaseManager.firestore, `userAppConfigs/${user?.uid}/apps/${projectId}`);
                await setDoc(
                    docRef,
                    {
                        logoUrl: logoUrl,
                        name: projectName,
                        paymentAddress: receiveAddress,
                        callbackApi: callbackApi,
                    },
                    { merge: true }
                );
                navigate(-1);
            }
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsSaving(false);
    }, [uploadLogo, projectId, callbackApi, navigate, projectName, receiveAddress, user?.uid]);

    const save = useCallback(async () => {
        await formInstace.validateFields();

        if (isEditMode) {
            editProject();
        } else {
            createProject();
        }
    }, [formInstace, editProject, createProject, isEditMode]);

    useEffect(() => {
        if (state?.appData != null) {
            setIsEditMode(true);
            // init form data
            formInstace.setFieldsValue({
                name: state.appData.name,
                logo: state.appData.logoUrl,
                address: state.appData.paymentAddress,
                callbackApi: state.appData.callbackApi,
            });
            setProjectId(state.appData.id);
        }
    }, [state?.appData, formInstace]);

    return (
        <StyledContainer>
            <SubPanelTitleWithBackIcon title={isEditMode ? "Edit Project" : "New Project"} />
            <div className="form-wrapper">
                <Form form={formInstace} size="large" labelCol={{ span: 7 }} labelAlign="left" colon={false}>
                    <Form.Item
                        name="logo"
                        rules={[{ required: true, message: "Project logo is required" }]}
                        label="Project Logo"
                        trigger="onLogoChange"
                        valuePropName="value"
                    >
                        <LogoUploader onLogoChange={onLogoChange} value={logoFileOrUrl} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Project name is required" }]}
                        label="Project Name"
                    >
                        <Input
                            className="text-value-input"
                            placeholder="Project Name"
                            bordered={false}
                            value={projectName}
                        ></Input>
                    </Form.Item>
                    <Form.Item
                        name="address"
                        rules={[
                            { required: true, message: "Receivement address is required" },
                            { validator: AddressValidator },
                        ]}
                        label="Receivement Address"
                    >
                        <Input
                            className="text-value-input"
                            placeholder="Your crypto account address"
                            bordered={false}
                            value={receiveAddress}
                        ></Input>
                    </Form.Item>
                    <Form.Item name="callbackApi" label="Callback Api">
                        <Input
                            className="text-value-input"
                            placeholder="Callback api url for receiving successful payment result"
                            bordered={false}
                            value={callbackApi}
                        ></Input>
                    </Form.Item>
                </Form>

                <div className="btn-block">
                    <Button className="save-btn" type="primary" size="large" onClick={save} loading={isSaving}>
                        Save
                    </Button>
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "project-edit-container" })`
    .form-wrapper {
        margin-top: 40px;
        max-width: 800px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        background-color: #fff;
        border-radius: 8px;
        padding: 24px;

        .ant-form-item {
            margin-bottom: 40px;
            label {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.55);
                width: 210px;
                flex-shrink: 0;
            }
            .text-value-input {
                color: rgba(0, 0, 0, 0.87);
                border-bottom: solid 1px rgba(0, 0, 0, 0.2);
                border-radius: 0;
                box-shadow: none;
                padding-left: 0;
            }
        }

        .btn-block {
            display: flex;
            justify-content: flex-end;

            .save-btn {
                width: 80px;
                margin-top: 40px;
                align-self: flex-end;
            }
        }
    }
`;

export default ProjectEdit;
