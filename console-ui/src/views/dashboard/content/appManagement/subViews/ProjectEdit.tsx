import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input } from "antd";

const ProjectEdit = () => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editAppData, setEditAppData] = useState<any>({});
    const { state } = useLocation();
    const [formInstace] = Form.useForm();
    const projectName = Form.useWatch("name", formInstace);

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
                {/* <Form form={formInstace} size="large">
                    <Form.Item name="name" rules={[{ required: true, message: "Name is required" }]} label="Name">
                        <Input type="text" placeholder="Project Name" />
                    </Form.Item>
                </Form> */}
                <div className="edit-item">
                    <div className="label">Project Name</div>
                    <Input className="value" placeholder="Project Name" bordered={false}></Input>
                </div>
                <div className="edit-item">
                    <div className="label">Receivement Address</div>
                    <Input className="value" placeholder="Your crypto account address" bordered={false}></Input>
                </div>
                <div className="edit-item">
                    <div className="label">Callback Api</div>
                    <Input
                        className="value"
                        placeholder="Callback api url for receiving successful payment result"
                        bordered={false}
                    ></Input>
                </div>
                <div className="edit-item">
                    <div className="label">Project Logo</div>
                    <Input className="value" placeholder="Your crypto account address" bordered={false}></Input>
                </div>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "project-edit-container" })`
    .form-wrapper {
        margin-top: 40px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        background-color: #fff;
        border-radius: 8px;
        padding: 24px;

        .edit-item {
            display: flex;
            align-items: center;
            font-size: 14px;

            & + .edit-item {
                margin-top: 40px;
            }
            .label {
                color: rgba(0, 0, 0, 0.55);
                width: 200px;
            }
            .value {
                color: rgba(0, 0, 0, 0.87);
                border-bottom: solid 1px rgba(0, 0, 0, 0.2);
                border-radius: 0;
                box-shadow: none;
                padding-left: 0;
            }
        }
    }
`;

export default ProjectEdit;
