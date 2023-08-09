import { styled } from "styled-components";
import PropTypes from "prop-types";

const PanelTitle = ({ title }: { title: string }) => {
    return <StyledContainer>{title}</StyledContainer>;
};

PanelTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

const StyledContainer = styled.div.attrs({ className: "panel-title-container" })`
    font-size: 36px;
    /* font-weight: bold; */
    color: rgb(27, 58, 87);
    padding: 0px 0;
`;

export default PanelTitle;
