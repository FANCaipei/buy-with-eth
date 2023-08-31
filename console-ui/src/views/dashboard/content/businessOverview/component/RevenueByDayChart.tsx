import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

const RevenueByDayChart = ({ chartData }: { chartData: Array<{ dateStr: string; value: number }> }) => {
    const [chartOption, setChartOption] = useState<any>({});

    useEffect(() => {
        if (!chartData) {
            return;
        }

        const timeAxisData = chartData?.map(item => item.dateStr) ?? [];
        const valueData = chartData?.map(item => item.value) ?? [];

        const tempOption = {
            xAxis: {
                type: "category",
                axisTick: {
                    show: false,
                },
                data: timeAxisData,
            },
            yAxis: {
                type: "value",
                name: "Revenue in USD",
            },
            tooltip: {
                show: true,
                formatter: (params: any) => {
                    return params?.value?.toFixed(4);
                },
            },
            series: [
                {
                    data: valueData,
                    type: "line",
                },
            ],
        };

        setChartOption(tempOption);
    }, [chartData]);

    return (
        <StyledContainer>
            <ReactECharts option={chartOption} />
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export default RevenueByDayChart;
