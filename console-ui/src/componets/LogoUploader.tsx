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

const LogoUploader = ({
    onLogoChange,
    value,
    onMouseEnter,
}: {
    onLogoChange: (imageFile: File) => void;
    value?: string | File;
    onMouseEnter?: (event: any) => any;
}) => {
    const [currentLogo, setCurrentLogo] = useState<string | null>();

    const onFileInputChange = useCallback(
        async (event: any) => {
            const file = event?.target?.files?.[0];
            if (!file) {
                return;
            }
            const imageData = await getBase64FromImageFile(file);
            if (imageData) {
                setCurrentLogo(imageData);
                onLogoChange(file);
            }
        },
        [onLogoChange]
    );

    useEffect(() => {
        if (typeof value === "string") {
            setCurrentLogo(value);
        }
    }, [value]);

    return (
        <div onMouseEnter={onMouseEnter}>
            <StyledContainer style={{ backgroundColor: currentLogo != null ? "transparent" : "rgba(0, 0, 0, 0.12)" }}>
                {currentLogo ? (
                    <img className="current-logo" src={currentLogo} alt="" />
                ) : (
                    <PlusOutlined className="add-file" />
                )}
                <Input className="file-input" type="file" onChange={onFileInputChange} accept="image/*" />
            </StyledContainer>
        </div>
    );
};

const StyledContainer = styled.div.attrs({ className: "logo-uploader-container" })`
    width: 56px;
    height: 56px;
    border-radius: var(--apple-radius-md);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px dashed var(--apple-border);
    transition: all var(--apple-duration-fast) var(--apple-ease);

    &:hover {
        border-color: var(--apple-blue);
        background-color: rgba(0, 113, 227, 0.04) !important;
    }

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
        color: var(--apple-text-secondary);
        cursor: pointer;
        transition: color var(--apple-duration-fast) var(--apple-ease);
    }

    &:hover .add-file {
        color: var(--apple-blue);
    }

    .current-logo {
        width: 56px;
        border: none;
        border-radius: var(--apple-radius-md);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        cursor: pointer;
    }
`;

export default LogoUploader;
