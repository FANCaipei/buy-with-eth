import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

const TokenDistributionPieChart = (chartData: any) => {
    const [chartOption, setChartOption] = useState();

    useEffect(() => {
        const tempOption = {};
    }, [chartData]);

    return (
        <StyledContainer>
            <ReactECharts option={chartOption} />
        </StyledContainer>
    );
};

const StyledContainer = styled.div``;

export default TokenDistributionPieChart;
