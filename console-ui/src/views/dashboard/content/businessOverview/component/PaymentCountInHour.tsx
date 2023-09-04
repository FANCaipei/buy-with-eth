import { styled } from "styled-components";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

const PaymentCountInHour = ({ chartData }: { chartData: Array<{ hourStr: string; value: number }> }) => {
    const [chartOption, setChartOption] = useState<any>({});

    useEffect(() => {
        if (!chartData) {
            return;
        }

        const timeAxisData = chartData?.map(item => item.hourStr).sort((a, b) => parseFloat(a) - parseFloat(b)) ?? [];
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
                name: "Payment count",
            },
            tooltip: {
                show: true,
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
            <ReactECharts option={chartOption} />
        </StyledContainer>
    );
};

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export default PaymentCountInHour;
