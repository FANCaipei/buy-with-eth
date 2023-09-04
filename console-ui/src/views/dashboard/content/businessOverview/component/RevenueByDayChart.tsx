import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { Empty } from "antd";

const RevenueByDayChart = ({ chartData }: { chartData: Array<{ dateStr: string; value: number }> }) => {
    const [chartOption, setChartOption] = useState<any>({});

    useEffect(() => {
        if (!chartData) {
            return;
        }

        const timeAxisData = chartData?.map(item => item.dateStr) ?? [];
        const valueData = chartData?.map(item => item.value) ?? [];

        const tempOption = {
            grid: {
                top: 40,
                bottom: 20,
                right: 0,
                left: 20,
                containLabel: true,
            },
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
                    smooth: true,
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

export default RevenueByDayChart;
