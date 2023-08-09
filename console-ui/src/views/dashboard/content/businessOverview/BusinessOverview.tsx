import { styled } from "styled-components";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import NoApps from "../../../../componets/NoApps";

const BusinessOverview = () => {
    return (
        <StyledContainer>
            <PanelTitle title="Analyse" />
            <div className="no-app">
                <NoApps />
            </div>
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "business-overview" })`
    height: 100%;
    .no-app {
        margin-top: 200px;
    }
`;

export default BusinessOverview;
