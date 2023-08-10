import { styled } from "styled-components";
import SubPanelTitleWithBackIcon from "../../../component/SubPanelTitleWithBackIcon";

const ProjectEdit = () => {
    return (
        <StyledContainer>
            <SubPanelTitleWithBackIcon title="Test Edit" />
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "project-edit-container" })``;

export default ProjectEdit;
