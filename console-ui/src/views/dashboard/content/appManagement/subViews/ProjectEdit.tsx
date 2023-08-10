import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Input, Form } from "antd";
import LogoUploader from "../../../../../componets/LogoUploader";
import { ethers } from "ethers";

const AddressValidator = async (_rule: any, value: any) => {
    return ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject("Invalid crypto address");
};

const ProjectEdit = () => {
    const [formInstace] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editAppData, setEditAppData] = useState<any>({});
    const { state } = useLocation();
    const [logoData, setLogoData] = useState<string>();
    const projectName = Form.useWatch("name", formInstace);
    const receiveAddress = Form.useWatch("address", formInstace);
    const callbackApi = Form.useWatch("callbackApi", formInstace);

    const onLogoChange = useCallback((imageData: string) => {
        setLogoData(imageData);
    }, []);

    const uploadLogo = useCallback(async (): Promise<string> => {
        if (logoData?.startsWith("data:")) {
            // upload

            return "https://";
        } else {
            return logoData ?? "";
        }
    }, [logoData]);

    const createProject = useCallback(async () => {
        const logoUrl = await uploadLogo();
        const requestData = {
            logoUrl: logoUrl,
            projectName: projectName,
            receiveAddress: receiveAddress,
            callbackApi: callbackApi,
        };
        console.log(requestData);
    }, [uploadLogo]);

    const editProject = useCallback(async () => {
        const logoUrl = await uploadLogo();
    }, [uploadLogo]);

    const save = useCallback(async () => {
        const validsteResult = await formInstace.validateFields();
        console.log(validsteResult);
        if (isEditMode) {
            editProject();
        } else {
            createProject();
        }
    }, [formInstace, editProject, createProject]);

    useEffect(() => {
        if (state?.appData != null) {
            setIsEditMode(true);
            setEditAppData(state.appData);
        }
    }, [state?.appData]);

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
                        <LogoUploader onLogoChange={onLogoChange} value={logoData} />
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
                    <Button className="save-btn" type="primary" size="large" onClick={save}>
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
