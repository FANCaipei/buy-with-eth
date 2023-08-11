import { styled } from "styled-components";
import GeneralUtils from "../../../../../common/utils/GeneralUtils";
import { Button, Tooltip } from "antd";
import { SettingFilled, DeleteFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const AppCard = ({ appData }: { appData: any }) => {
    const navigate = useNavigate();

    const goSetting = useCallback(() => {
        navigate("/dashboard/projectSetting", {
            state: {
                appData: appData,
            },
        });
    }, [navigate, appData]);

    return (
        <StyledContainer>
            <div className="title">{appData?.name}</div>
            <div className="address">{GeneralUtils.maskAddress(appData?.paymentAddress)}</div>
            <div className="action-icons">
                <Tooltip title="Setting">
                    <Button type="text" icon={<SettingFilled />} onClick={goSetting}></Button>
                </Tooltip>
                <Tooltip title="Delete">
                    <Button type="text" icon={<DeleteFilled />}></Button>
                </Tooltip>
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "app-card-container" })`
    width: 300px;
    height: 210px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    position: relative;

    &:hover {
        background-color: rgb(245, 245, 245);
    }

    .title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
    }
    .address {
        margin-top: 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
    }
    .action-icons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;

        .ant-btn-icon {
            color: rgba(0, 0, 0, 0.55);
        }
    }
`;

export default AppCard;
