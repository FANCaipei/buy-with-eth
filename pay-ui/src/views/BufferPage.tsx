import { Spin } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const BufferPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("next path & params: ", state.nextPath, state.nextParams);
        if (state.nextPath) {
            navigate(state.nextPath, {
                replace: true,
                state: state.nextParams,
            });
        }
    }, [navigate, state.nextParams, state.nextPath]);

    return (
        <StyledContainer>
            <Spin spinning={true} />
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "buffer-page" })`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default BufferPage;
