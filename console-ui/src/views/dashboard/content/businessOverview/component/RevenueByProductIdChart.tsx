import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { Empty } from "antd";

const RevenueByProductIdChart = ({ chartData }: { chartData?: Array<{ productId: string; value: number }> }) => {
    const [chartOption, setChartOption] = useState<any>({});

    useEffect(() => {
        if (!chartData) {
            return;
        }
        const axisLables = chartData.map(item => item.productId);
        const valueData = chartData.map(item => item.value);
        const tempOption = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "0%",
                right: "0%",
                bottom: "0%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: axisLables,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    type: "bar",
                    barWidth: "60%",
                    data: valueData,
                },
            ],
        };

        setChartOption(tempOption);
    }, [chartData]);

    return (
        <StyledContainer>
            {chartData?.length ? (
                <ReactECharts option={chartOption} />
            ) : (
                <div className="empty-contianer">
                    <Empty />
                </div>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;

    .empty-contianer {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default RevenueByProductIdChart;
