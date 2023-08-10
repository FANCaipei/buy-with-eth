import { Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { PlusOutlined } from "@ant-design/icons";

async function getBase64FromImageFile(file: File): Promise<string> {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = function () {
            if (!reader.result || reader.result === "") {
                reject();
            }
            resolve(reader.result as string);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

const LogoUploader = ({ onLogoChange, value }: { onLogoChange: (imageData: string) => void; value?: string }) => {
    const [currentLogo, setCurrentLogo] = useState<string | null>();

    const onFileInputChange = useCallback(async (event: any) => {
        const file = event?.target?.files?.[0];
        if (!file) {
            return;
        }
        const imageData = await getBase64FromImageFile(file);
        if (imageData) {
            setCurrentLogo(imageData);
            onLogoChange(imageData);
        }
    }, []);

    useEffect(() => {
        setCurrentLogo(value);
    }, [value]);

    return (
        <StyledContainer>
            {currentLogo ? (
                <img className="current-logo" src={currentLogo} alt="" />
            ) : (
                <PlusOutlined className="add-file" />
            )}
            <Input className="file-input" type="file" onChange={onFileInputChange} accept="image/*" />
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "logo-uploader-container" })`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: relative;
    background-color: rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .file-input {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 0;
        opacity: 0;
        z-index: 99;
        cursor: pointer;
    }

    .add-file {
        font-size: 20px;
        color: rgb(94, 94, 94);
        cursor: pointer;
    }

    .current-logo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
        cursor: pointer;
    }
`;

export default LogoUploader;
