import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Logo from "../../assets/imgs/logo.png";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OcelotHeader = () => {
    const navigate = useNavigate();
    const [isAtDocPage, setIsAtDocPage] = useState(true);
    const [currentPath, setCurrentPath] = useState<string>();
    const location = useLocation();
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

    const goHome = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    const goDoc = useCallback(() => {
        navigate("/doc");
    }, [navigate]);

    const goGetStart = useCallback(() => {
        navigate("/get-start");
    }, [navigate]);

    const goConsole = useCallback(() => {
        window.open("https://console.ocelotpay.com/", "_blank");
    }, []);

    const openDropdownMenu = useCallback(() => {
        setIsDropdownMenuOpen(true);
    }, []);
    const closeDropdownMenu = useCallback(() => {
        setIsDropdownMenuOpen(false);
    }, []);

    const [dropdownMenus, setDropdownMenus] = useState<MenuProps["items"]>();

    useEffect(() => {
        if (location.pathname?.includes("/doc") || location.pathname?.includes("/get-start")) {
            setIsAtDocPage(true);
        } else {
            setIsAtDocPage(false);
        }
        setCurrentPath(location.pathname);
    }, [location]);

    useEffect(() => {
        // if (isAtDocPage) {
        //     setDropdownMenus([
        //         {
        //             key: "4",
        //             label: (
        //                 <Button type="primary" size="large" onClick={goConsole}>
        //                     Console
        //                 </Button>
        //             ),
        //         },
        //     ]);
        // } else {
        //     setDropdownMenus([
        //         {
        //             key: "1",
        //             label: (
        //                 <a href="#features">
        //                     <Button type="text" size="large">
        //                         Why Ocelot Pay
        //                     </Button>
        //                 </a>
        //             ),
        //         },

        //         {
        //             key: "2",
        //             label: (
        //                 <a href="#price">
        //                     <Button type="text" size="large">
        //                         Pricing
        //                     </Button>
        //                 </a>
        //             ),
        //         },
        //         {
        //             key: "3",
        //             label: (
        //                 <Button type="text" size="large" onClick={goDoc}>
        //                     Docs
        //                 </Button>
        //             ),
        //         },
        //         {
        //             key: "4",
        //             label: (
        //                 <Button type="primary" size="large" onClick={goConsole}>
        //                     Console
        //                 </Button>
        //             ),
        //         },
        //     ]);
        // }
        setDropdownMenus([
            {
                key: "1",
                label: (
                    <a href="#features">
                        <Button type="text" size="large">
                            Why Ocelot Pay
                        </Button>
                    </a>
                ),
            },

            {
                key: "2",
                label: (
                    <a href="#price">
                        <Button type="text" size="large">
                            Pricing
                        </Button>
                    </a>
                ),
            },
            {
                key: "3",
                label: (
                    <Button type="text" size="large" onClick={goDoc}>
                        Docs
                    </Button>
                ),
            },
            {
                key: "4",
                label: (
                    <Button type="primary" size="large" onClick={goConsole}>
                        Console
                    </Button>
                ),
            },
        ]);
    }, [goConsole, goDoc]);

    useEffect(() => {
        window.addEventListener("click", closeDropdownMenu);
        return () => {
            window.removeEventListener("click", closeDropdownMenu);
        };
    }, [closeDropdownMenu]);

    return (
        <StyledContainer style={{ maxWidth: isAtDocPage ? "100vw" : "1200px" }}>
            <div className="logo-block" onClick={goHome}>
                <img src={Logo} alt="" className="logo" />
                <span className="text">Ocelot Pay</span>
            </div>
            <div className="nav-items">
                {!isAtDocPage ? (
                    <a href="#features">
                        <Button type="text" size="large">
                            Why Ocelot Pay
                        </Button>
                    </a>
                ) : null}
                {!isAtDocPage ? (
                    <a href="#price">
                        <Button type="text" size="large">
                            Pricing
                        </Button>
                    </a>
                ) : null}
                {!currentPath?.includes("get-start") ? (
                    <Button type="text" size="large" onClick={goGetStart}>
                        GetStart
                    </Button>
                ) : null}

                {!currentPath?.includes("doc") ? (
                    <Button type="text" size="large" onClick={goDoc}>
                        Docs
                    </Button>
                ) : null}

                <Button type="primary" size="large" onClick={goConsole}>
                    Console
                </Button>
            </div>
            {isAtDocPage ? null : (
                <Dropdown
                    className="dropdown-menu"
                    trigger={["click"]}
                    menu={{ items: dropdownMenus }}
                    open={isDropdownMenuOpen}
                >
                    {isDropdownMenuOpen ? (
                        <CloseOutlined />
                    ) : (
                        <MenuOutlined
                            onClick={e => {
                                e.stopPropagation();
                                openDropdownMenu();
                            }}
                        />
                    )}
                </Dropdown>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "ocelot-header" })`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;

    .logo-block {
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: opacity var(--apple-duration-fast) var(--apple-ease);

        &:hover {
            opacity: 0.7;
        }

        .logo {
            width: 28px;
            height: 28px;
            margin-right: 8px;
            border-radius: 6px;
        }

        .text {
            color: var(--apple-text-primary);
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.02em;
        }
    }

    .nav-items {
        display: flex;
        align-items: center;
        gap: 4px;

        @media screen and (max-width: 800px) {
            display: none;
        }

        a {
            text-decoration: none;
        }

        .ant-btn-text {
            color: var(--apple-text-secondary) !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            border-radius: var(--apple-radius-sm) !important;
            padding: 6px 14px !important;
            transition: all var(--apple-duration-fast) var(--apple-ease) !important;

            &:hover {
                color: var(--apple-text-primary) !important;
                background: var(--apple-gray-200) !important;
            }
        }

        .ant-btn-primary {
            background: var(--apple-blue) !important;
            border: none !important;
            border-radius: 980px !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            padding: 6px 18px !important;
            height: 32px !important;
            transition: all var(--apple-duration-fast) var(--apple-ease) !important;

            &:hover {
                background: var(--apple-blue-hover) !important;
                transform: scale(1.02);
            }

            &:active {
                background: var(--apple-blue-active) !important;
                transform: scale(0.98);
            }
        }
    }

    .dropdown-menu {
        display: none;
        @media screen and (max-width: 800px) {
            display: block;
        }

        .anticon {
            font-size: 18px;
            color: var(--apple-text-secondary);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all var(--apple-duration-fast) var(--apple-ease);

            &:hover {
                background: var(--apple-gray-200);
                color: var(--apple-text-primary);
            }
        }
    }
`;

export default OcelotHeader;
