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

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
];

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
    const [messageApi, contextHolder] = message.useMessage();

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

            try {
                const snapshots = await getDocs(q);
                const tempRecords: Array<any> = [];
                let tempTotalValue = 0;
                snapshots.forEach(doc => {
                    if (doc.exists()) {
                        tempTotalValue += doc.data().recordValueInUSD;
                        tempRecords.push({ ...doc.data(), id: doc.id });
                    }
                });
                console.log("records: ", tempRecords);
                setTotalReceiveValue(tempTotalValue);
                setAllPaymentRecords(snapshots.docs);
            } catch (error) {
                console.error(error);
                messageApi.error("Fetch data failed");
            }
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
                    <Spin spinning={isFetchingProjects}>
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
                            {totalReceiveValue}
                            count: {allPaymentRecords?.length}
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

            .project-select {
                min-width: 120px;
                margin-right: 10px;
            }
        }
    }
`;

export default BusinessOverview;
