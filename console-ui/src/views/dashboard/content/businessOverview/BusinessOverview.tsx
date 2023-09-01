import { styled } from "styled-components";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import NoApps from "../../../../componets/NoApps";
import useProtectedPath from "../../../../common/hooks/useProtectedPath";
import useFirebaseAuth from "../../../../common/zustand/useFirebaseAuth";
import { useCallback, useEffect, useState } from "react";
import FirebaseManager from "../../../../common/firebase/FirebaseManager";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Select, Spin, TimeRangePickerProps, message, DatePicker } from "antd";
import dayjs, { Dayjs, UnitType } from "dayjs";
import PanelItemCard from "./component/PanelItemCard";
import BigNumber from "./component/BigNumber";
import TokenDistributionPieChart from "./component/TokenDistributionPieChart";
import RevenueByDayChart from "./component/RevenueByDayChart";
import AvgPrice from "./component/AvgPrice";

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
];

const handlePaymentRecordsData = (
    records: Array<any>,
    rangeDays: Array<string>
): {
    totalRevenue: number;
    tokenDistributionPieChartData: Array<{ value: number; name: string; color: string }>;
    revenueByDayChartData: Array<{ dateStr: string; value: number }>;
    avgPrices: Array<{ avgPrice: number; tokenSymbol: string; color: string }>;
} => {
    const tokenColors: { [key: string]: string } = {
        eth: "#6DC41F",
        matic: "#805AD5",
        "usdt-polygon": "#239CFF",
        "usdt-eth": "#06AED4",
    };
    let totalRevenue = 0;
    const tokenDistributionData: { [key: string]: { value: number; name: string; color: string } } = {
        eth: { value: 0, name: "ETH", color: tokenColors["eth"] },
        matic: { value: 0, name: "MATIC", color: tokenColors["matic"] },
        "usdt-polygon": { value: 0, name: "USDT Polygon", color: tokenColors["usdt-polygon"] },
        "usdt-eth": { value: 0, name: "USDT Ethereum", color: tokenColors["usdt-eth"] },
    };
    const revenueByDayData: { [key: string]: { dateStr: string; value: number } } = {};
    const avgPricesData: {
        [key: string]: { tokenSymbol: string; totalPrice: number; count: number; color: string };
    } = {
        eth: { tokenSymbol: "ETH", color: tokenColors["eth"], totalPrice: 0, count: 0 },
        matic: { tokenSymbol: "MATIC", color: tokenColors["matic"], totalPrice: 0, count: 0 },
        "usdt-polygon": {
            tokenSymbol: "USDT Polygon",
            color: tokenColors["usdt-polygon"],
            totalPrice: 0,
            count: 0,
        },
        "usdt-eth": {
            tokenSymbol: "USDT Ethereum",
            color: tokenColors["usdt-eth"],
            totalPrice: 0,
            count: 0,
        },
    };

    rangeDays.forEach(dayStr => {
        revenueByDayData[dayStr] = {
            dateStr: dayStr,
            value: 0,
        };
    });

    records.forEach(item => {
        // -1 means get price failed, can't calculate value in usd
        const valueInUSD = item.recordValueInUSD === -1 ? 0 : item.recordValueInUSD;
        totalRevenue += valueInUSD;
        // token distribution data
        switch (item.tokenSymbol) {
            case "USDT":
                if (item.chainId === "0x1") {
                    tokenDistributionData["usdt-eth"].value += item.recordValueInUSD;
                    avgPricesData["usdt-eth"].totalPrice += item.recordValueInUSD;
                    avgPricesData["usdt-eth"].count += 1;
                }
                if (item.chainId === "0x89") {
                    tokenDistributionData["usdt-polygon"].value += item.recordValueInUSD;
                    avgPricesData["usdt-polygon"].totalPrice += item.recordValueInUSD;
                    avgPricesData["usdt-polygon"].count += 1;
                }
                break;
            case "ETH":
                tokenDistributionData["eth"].value += item.recordValueInUSD;
                avgPricesData["eth"].totalPrice += item.recordValueInUSD;
                avgPricesData["eth"].count += 1;
                break;
            case "MATIC":
                tokenDistributionData["matic"].value += item.recordValueInUSD;
                avgPricesData["matic"].totalPrice += item.recordValueInUSD;
                avgPricesData["matic"].count += 1;
                break;
            default:
                break;
        }
        // revenue by day data
        if (item.recordTimestamp) {
            const dateStr = dayjs(item.recordTimestamp).format("DD/MM");

            if (revenueByDayData[dateStr]) {
                revenueByDayData[dateStr].value += valueInUSD;
            } else {
                revenueByDayData[dateStr] = {
                    dateStr: dateStr,
                    value: valueInUSD,
                };
            }
        }
        // ...
    });
    return {
        totalRevenue: totalRevenue,
        tokenDistributionPieChartData: Object.keys(tokenDistributionData).map(key => tokenDistributionData[key]),
        revenueByDayChartData: Object.keys(revenueByDayData).map(key => revenueByDayData[key]),
        avgPrices: Object.keys(avgPricesData).map(key => {
            let avg = 0;
            if (avgPricesData[key].count !== 0) {
                avg = avgPricesData[key].totalPrice / avgPricesData[key].count;
            }

            return {
                avgPrice: avg,
                tokenSymbol: avgPricesData[key].tokenSymbol,
                color: avgPricesData[key].color,
            };
        }),
    };
};

const BusinessOverview = () => {
    useProtectedPath();
    const { user } = useFirebaseAuth() as any;
    const [allProjects, setAllProjects] = useState<any>();
    const [allPaymentRecords, setAllPaymentRecords] = useState<Array<any>>([]);
    const [totalReceiveValue, setTotalReceiveValue] = useState<number>();
    const [selectedProjectId, setSelectedProjectId] = useState<any>();
    const [rangeDates, setRangeDates] = useState<RangeValue>([dayjs().add(-7, "day"), dayjs()]);
    const [resultRangeDates, setResultRangeDates] = useState<RangeValue>(null);
    const [isFetchingProjects, setIsFetchingProjects] = useState<boolean>(false);
    const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    // chart datas
    const [tokenDistriPieChartData, setTokenDistriPieChartData] =
        useState<Array<{ value: number; name: string; color: string }>>();
    const [revenueByDayChartData, setRevenueByDayChartData] = useState<Array<{ dateStr: string; value: number }>>();
    const [avgPriceData, setAvgPriceData] = useState<Array<{ avgPrice: number; tokenSymbol: string; color: string }>>();

    const getPaymentRecords = useCallback(
        async (projectId: string, dateRange: RangeValue) => {
            console.log("fetching records...");
            ["hour", "minute", "second", "millisecond"].forEach((unit: string) => {
                dateRange?.[0]?.set(unit as UnitType, 0);
                dateRange?.[1]?.set(unit as UnitType, 0);
            });

            const startTimestamp = dateRange?.[0]?.toDate()?.getTime();
            const endTimestamp = dateRange?.[1]?.add(1, "day")?.toDate()?.getTime();

            if (!user?.uid || !projectId || !startTimestamp || !endTimestamp) {
                return;
            }
            if (startTimestamp >= endTimestamp) {
                return;
            }

            const rangeDays = [];
            let dayTimestamp = startTimestamp;
            while (dayTimestamp < endTimestamp) {
                rangeDays.push(dayjs(dayTimestamp).format("DD/MM"));
                dayTimestamp += 24 * 60 * 60 * 1000;
            }

            const timeStartCondition = where("recordTimestamp", ">=", startTimestamp);
            const timeEndCondition = where("recordTimestamp", "<=", endTimestamp);

            let q = null;
            if (projectId === "all") {
                // query all project
                q = query(
                    collection(FirebaseManager.firestore, `paymentRecords/${user.uid}/paymentRecords`),
                    timeStartCondition,
                    timeEndCondition
                );
            } else {
                q = query(
                    collection(FirebaseManager.firestore, `paymentRecords/${user.uid}/paymentRecords`),
                    timeStartCondition,
                    timeEndCondition,
                    where("appId", "==", projectId)
                );
            }

            setIsLoadingRecords(true);
            try {
                const snapshots = await getDocs(q);
                const tempRecords: Array<any> = [];
                snapshots.forEach(doc => {
                    if (doc.exists()) {
                        tempRecords.push({ ...doc.data(), id: doc.id });
                    }
                });
                setAllPaymentRecords(tempRecords);

                const handledResult = handlePaymentRecordsData(tempRecords, rangeDays);
                setTotalReceiveValue(handledResult.totalRevenue);
                setTokenDistriPieChartData(handledResult.tokenDistributionPieChartData);
                setRevenueByDayChartData(handledResult.revenueByDayChartData);
                setAvgPriceData(handledResult.avgPrices);
                // set other chart datas
            } catch (error) {
                console.error(error);
                messageApi.error("Fetch data failed");
            }
            setIsLoadingRecords(false);
        },
        [user?.uid, messageApi]
    );

    const onProjectSelected = useCallback((selectedId: any) => {
        setSelectedProjectId(selectedId);
    }, []);

    const getAllProjects = useCallback(async () => {
        if (!user?.uid) {
            return;
        }
        setIsFetchingProjects(true);
        try {
            const q = query(collection(FirebaseManager.firestore, `userAppConfigs/${user.uid}/apps`));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setAllProjects([]);
                setIsFetchingProjects(false);
                return Promise.reject();
            }
            const tempData: Array<any> = [];
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempData.push({ ...doc.data(), id: doc.id });
                }
            });
            setAllProjects(tempData);
            setSelectedProjectId(tempData[0]?.id);
            setIsFetchingProjects(false);
            return Promise.resolve(tempData[0]?.id);
        } catch (error) {
            messageApi.error("Get projects failed");
            setAllProjects([]);
            setIsFetchingProjects(false);
            return Promise.reject();
        }
    }, [user?.uid, messageApi]);

    const onDateRangeChange = useCallback((dates: null | [Dayjs | null, Dayjs | null]) => {
        // console.log(dates);
        setResultRangeDates(dates);
    }, []);

    const onRangeOpenChange = useCallback((open: boolean) => {
        if (open) {
            setRangeDates([null, null]);
        } else {
            setRangeDates(null);
        }
    }, []);

    const disableDate = useCallback(
        (current: Dayjs) => {
            let earliestDate = dayjs("2020-01-01");
            let latestDate = rangeDates?.[1] ?? dayjs();
            if (rangeDates?.[0]) {
                earliestDate = rangeDates[0];
                latestDate = latestDate.isBefore(earliestDate.add(31, "day"))
                    ? latestDate
                    : earliestDate.add(31, "day");
            }
            if (rangeDates?.[1]) {
                latestDate = rangeDates[1];
                earliestDate = rangeDates[1].add(-31, "day");
            }

            return current.isBefore(earliestDate) || current.isAfter(latestDate);
        },
        [rangeDates]
    );

    useEffect(() => {
        getAllProjects();
    }, [getAllProjects]);

    // auto fetch records data whenever filter changes
    useEffect(() => {
        getPaymentRecords(selectedProjectId, resultRangeDates);
    }, [getPaymentRecords, selectedProjectId, resultRangeDates]);

    return (
        <StyledContainer>
            {contextHolder}
            <PanelTitle title="Analyse" />
            {!allProjects?.length && !isFetchingProjects ? (
                <div className="no-app">
                    <NoApps />
                </div>
            ) : (
                <div className="content">
                    <Spin spinning={isFetchingProjects || isLoadingRecords}>
                        <div className="filters-block">
                            <Select
                                className="project-select"
                                value={selectedProjectId}
                                onChange={onProjectSelected}
                                options={[
                                    {
                                        value: "all",
                                        label: "All Projects",
                                    },
                                    ...(allProjects?.map((item: any) => {
                                        return {
                                            value: item.id,
                                            label: item.name,
                                        };
                                    }) ?? []),
                                ]}
                            />
                            <RangePicker
                                value={rangeDates || resultRangeDates}
                                presets={rangePresets}
                                disabledDate={disableDate}
                                onCalendarChange={val => {
                                    setRangeDates(val);
                                }}
                                onChange={onDateRangeChange}
                                changeOnBlur
                                onOpenChange={onRangeOpenChange}
                            />
                        </div>
                        <div className="charts-panel">
                            <div className="panel-line">
                                <PanelItemCard title="Revenue" style={{ width: "30%" }}>
                                    <BigNumber
                                        totalRevenue={totalReceiveValue ?? 0}
                                        recordsCount={allPaymentRecords?.length}
                                    />
                                </PanelItemCard>
                                <PanelItemCard
                                    title="Revenue by day"
                                    titleTooltip="In token price at the time of payment"
                                    style={{ flexGrow: "1" }}
                                >
                                    <RevenueByDayChart chartData={revenueByDayChartData ?? []} />
                                </PanelItemCard>
                            </div>
                            <div className="panel-line">
                                <PanelItemCard
                                    title="Revenue by token"
                                    style={{ width: "45%" }}
                                    titleTooltip="Revenue in USD distribution by token type"
                                >
                                    <TokenDistributionPieChart chartData={tokenDistriPieChartData} />
                                </PanelItemCard>
                                <PanelItemCard
                                    title="Average payment price"
                                    style={{ width: "45%" }}
                                    titleTooltip="Token average price(at the payment moment)"
                                >
                                    <AvgPrice avgPrices={avgPriceData ?? []} />
                                </PanelItemCard>
                            </div>
                        </div>
                    </Spin>
                </div>
            )}
        </StyledContainer>
    );
};

const StyledContainer = styled.div.attrs({ className: "business-overview" })`
    height: 100%;
    .no-app {
        margin-top: 100px;
    }

    .content {
        .filters-block {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 8px;

            .project-select {
                min-width: 120px;
                margin-right: 10px;
            }
        }
        .charts-panel {
            margin-top: 20px;
            width: 100%;

            .panel-line {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
            }
        }
    }
`;

export default BusinessOverview;
