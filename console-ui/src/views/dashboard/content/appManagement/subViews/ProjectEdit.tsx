import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import LogoUploader from "../../../../../componets/LogoUploader";
import { ethers } from "ethers";
import FirebaseManager from "../../../../../common/firebase/FirebaseManager";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useFirebaseAuth from "../../../../../common/zustand/useFirebaseAuth";
import useProtectedPath from "../../../../../common/hooks/useProtectedPath";
import CustomFormLabel from "../../../../../componets/CustomFormLabel";

const Tips = {
    projectLogo: {
        title: "Project Logo",
        tips: [
            "User will see your logo on payment view",
            "Large logo image may load slow, 64x64 is enough, .jpg is smaller than .png",
            "The background of where your logo placed will be white",
        ],
    },
    projectName: {
        title: "Project Name",
        tips: ["User will see your project name on payment view", "Name should not be too long"],
    },
    receiveAddress: {
        title: "Receivement Address",
        tips: [
            `It can't be changed once set(may support later)`,
            `It's an ethereum address with case sensitive`,
            "All paid tokens will be sent to this address, make sure you have full control on it",
        ],
    },
    callbackApi: {
        title: "Callback Api",
        tips: [
            "This api will be called whenever user payment successful",
            "Leave it empty if you don't need it, you can also get the payment result at your web page",
            "It must support POST method without authentication required",
            "Keep this url private, do not share to public",
        ],
    },
    secretPhrase: {
        title: "Secret Phrase",
        tips: [
            "This phrase will be used as the salt to hash the payment info",
            "It will only be used when request your callback api, but required even you don't need set the callback api",
            "You can enter any phrase and change it whenever you want",
        ],
    },
};

const AddressValidator = async (_rule: any, value: any) => {
    return ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject("Invalid crypto address");
};

const ProjectEdit = () => {
    useProtectedPath();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { user } = useFirebaseAuth() as any;
    const [formInstace] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { state } = useLocation();
    const [logoFileOrUrl, setLogoFileOrUrl] = useState<File | string>();
    const projectName = Form.useWatch("name", formInstace);
    const receiveAddress = Form.useWatch("address", formInstace);
    const callbackApi = Form.useWatch("callbackApi", formInstace);
    const secretPhrase = Form.useWatch("secretPhrase", formInstace);
    const [isSaving, setIsSaving] = useState(false);
    const [projectId, setProjectId] = useState<string | null>();
    const [currentTips, setCurrentTips] = useState<any>();

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
            secretPhrase: secretPhrase,
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
            messageApi.error("Create failed");
        }
        setIsSaving(false);
    }, [messageApi, callbackApi, projectName, receiveAddress, uploadLogo, navigate, user?.uid, secretPhrase]);

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
                const appPrivateDocRef = doc(
                    FirebaseManager.firestore,
                    `userAppConfigs/${user?.uid}/apps/${projectId}/private/privateInfo`
                );
                await setDoc(
                    appPrivateDocRef,
                    {
                        secretPhrase: secretPhrase,
                    },
                    { merge: true }
                );
                navigate(-1);
            }
        } catch (error) {
            // do nothing
            console.error(error);
            messageApi.error("Save failed");
        }
        setIsSaving(false);
    }, [
        messageApi,
        uploadLogo,
        projectId,
        callbackApi,
        navigate,
        projectName,
        receiveAddress,
        user?.uid,
        secretPhrase,
    ]);

    const save = useCallback(async () => {
        await formInstace.validateFields();

        if (isEditMode) {
            editProject();
        } else {
            createProject();
        }
    }, [formInstace, editProject, createProject, isEditMode]);

    const getAppSecretPhrase = useCallback(
        async (projectId: string): Promise<string | undefined> => {
            if (!user?.uid) {
                return Promise.reject();
            }
            try {
                const appPrivateDocRef = doc(
                    FirebaseManager.firestore,
                    `userAppConfigs/${user?.uid}/apps/${projectId}/private/privateInfo`
                );
                const docRef = await getDoc(appPrivateDocRef);
                return docRef.data()?.secretPhrase;
            } catch (error) {
                console.error(error);
                messageApi.error("Get project secret phrase failed");
            }
        },
        [user?.uid, messageApi]
    );

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
            setLogoFileOrUrl(state.appData.logoUrl);
            setProjectId(state.appData.id);
            getAppSecretPhrase(state.appData.id).then(str => formInstace.setFieldsValue({ secretPhrase: str }));
        }
    }, [state?.appData, formInstace, getAppSecretPhrase]);

    return (
        <StyledContainer>
            {contextHolder}
            <SubPanelTitleWithBackIcon title={isEditMode ? "Edit Project" : "New Project"} />
            <div className="content-block">
                <div className="form-wrapper">
                    <Form form={formInstace} size="large" labelCol={{ span: 7 }} labelAlign="left" colon={false}>
                        <Form.Item
                            name="logo"
                            rules={[
                                {
                                    required: true,
                                    message: "Project logo is required",
                                },
                            ]}
                            label={
                                <CustomFormLabel label="Project Logo" tip="User will see your logo on payment view" />
                            }
                            trigger="onLogoChange"
                            validateTrigger="onLogoChange"
                            valuePropName="value"
                        >
                            <LogoUploader
                                onLogoChange={onLogoChange}
                                value={logoFileOrUrl}
                                onMouseEnter={() => setCurrentTips(Tips.projectLogo)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Project name is required" }]}
                            label={<CustomFormLabel label="Project Name" />}
                        >
                            <Input
                                className="text-value-input"
                                placeholder="Project Name"
                                bordered={false}
                                value={projectName}
                                onFocus={() => setCurrentTips(Tips.projectName)}
                            ></Input>
                        </Form.Item>
                        <Form.Item
                            name="address"
                            rules={[
                                { required: true, message: "Receivement address is required" },
                                { validator: AddressValidator },
                            ]}
                            label={
                                <CustomFormLabel
                                    label="Receivement Address"
                                    tip="All paid tokens will be sent to this address"
                                />
                            }
                        >
                            <Input
                                className="text-value-input"
                                placeholder="Your crypto account address"
                                bordered={false}
                                value={receiveAddress}
                                readOnly={isEditMode}
                                onFocus={() => setCurrentTips(Tips.receiveAddress)}
                            ></Input>
                        </Form.Item>
                        <Form.Item
                            name="secretPhrase"
                            rules={[{ required: true, message: "Secret phrase is required" }]}
                            label={
                                <CustomFormLabel
                                    label="Secret Phrase"
                                    tip="Secret phrase help you identify the payment response info is from us"
                                />
                            }
                        >
                            <Input
                                className="text-value-input"
                                placeholder="Any phrase you like"
                                bordered={false}
                                value={secretPhrase}
                                onFocus={() => setCurrentTips(Tips.secretPhrase)}
                            ></Input>
                        </Form.Item>
                        <Form.Item
                            name="callbackApi"
                            rules={[{ pattern: /^https?:\/\//g, message: "Must start with http:// or https://" }]}
                            label={<CustomFormLabel label="Callback Api" tip="Api url which support POST method" />}
                        >
                            <Input
                                className="text-value-input"
                                placeholder="Callback api url for receiving successful payment result"
                                bordered={false}
                                value={callbackApi}
                                onFocus={() => setCurrentTips(Tips.callbackApi)}
                            ></Input>
                        </Form.Item>
                    </Form>

                    <div className="btn-block">
                        <Button className="save-btn" type="primary" size="large" onClick={save} loading={isSaving}>
                            Save
                        </Button>
                    </div>
                </div>
                <div className="tips">
                    <div className="tip-title">{currentTips?.title}</div>
                    <ul className="tip-desc">
                        {currentTips?.tips?.map((tip: any) => (
                            <li key={tip}> {tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "project-edit-container" })`
    .content-block {
        display: flex;
        margin-top: 40px;

        .form-wrapper {
            flex-grow: 1;
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

                    &[readonly] {
                        color: rgba(0, 0, 0, 0.4);
                        cursor: not-allowed;
                    }
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

        .tips {
            flex-grow: 0;
            margin-left: 20px;
            font-size: 16px;
            color: #1677ffaa;
            max-width: 350px;

            .tip-title {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 40px;
            }
            .tip-desc {
                color: #1677ffaa;
                li {
                    margin-top: 20px;
                    word-break: break-word;
                    line-height: 24px;
                }
            }
        }
    }
`;

export default ProjectEdit;
