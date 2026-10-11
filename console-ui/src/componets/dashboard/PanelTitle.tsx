import { styled } from "styled-components";
import PropTypes from "prop-types";

const PanelTitle = ({ title }: { title: string }) => {
    return <StyledContainer>{title}</StyledContainer>;
};

PanelTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

const StyledContainer = styled.div.attrs({ className: "panel-title-container" })`
    font-size: 32px;
    font-weight: 600;
    color: var(--apple-text-primary);
    letter-spacing: -0.03em;
    padding: 0;
`;

export default PanelTitle;
