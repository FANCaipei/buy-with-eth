import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

const TokenDistributionPieChart = ({ chartData }: { chartData?: Array<any> }) => {
    const [chartOption, setChartOption] = useState<any>({});

    useEffect(() => {
        if (!chartData) {
            return;
        }
        const colors = chartData?.map((item: any) => item.color) ?? [];

        const tempOption = {
            tooltip: {
                trigger: "item",
            },
            legend: {
                orient: "horizontal",
                bottom: 0,
            },
            series: [
                {
                    type: "pie",
                    radius: "70%",
                    data: chartData,
                    color: colors,
                    label: {
                        show: false,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
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

export default TokenDistributionPieChart;
