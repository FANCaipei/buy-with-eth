import { createGlobalStyle, styled } from "styled-components";
import { OcelotPay } from "ocelot-pay-sdk/lib";
import useFirebaseAuth from "../../../../common/zustand/useFirebaseAuth";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import FirebaseManager from "../../../../common/firebase/FirebaseManager";
import { Button, Modal, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const CalcMonthStartEndTime = (billId: string): { startTimestamp: number; endTimestamp: number } | null => {
    const dateTime = dayjs(billId);
    return {
        startTimestamp: dateTime.startOf("month").toDate().getTime(),
        endTimestamp: dateTime.endOf("month").toDate().getTime(),
    };
};

const Bills = () => {
    const { user } = useFirebaseAuth() as any;
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoadingUnpaidData, setIsLoadingUnpaidData] = useState<boolean>(false);
    const [isLoadingHistoryData, setIsLoadingHistoryData] = useState<boolean>(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [unpaidBills, setUnpaidBills] = useState<Array<any>>([]);
    const [totalUnpaid, setTotalUnpaid] = useState<number>();
    const [historyBills, setHistoryBills] = useState<Array<any>>([]);
    const [paymentUrl, setPaymentUrl] = useState<string>();
    const payIframeRef = useRef<HTMLIFrameElement>(null);

    const goOverview = useCallback(
        (startTimestamp: number, endTimestamp: number) => {
            navigate("/dashboard/overview", {
                state: {
                    fromTimestamp: startTimestamp,
                    toTimestamp: endTimestamp,
                },
            });
        },
        [navigate]
    );

    const [historyPaiedTableColumns] = useState([
        {
            title: "Period",
            dataIndex: "id",
            render: (text: any) => {
                const times = CalcMonthStartEndTime(text);
                const navFn = () => {
                    if (!times) {
                        return;
                    }
                    goOverview(times.startTimestamp, times.endTimestamp);
                };

                return (
                    <span onClick={navFn} style={{ color: "rgb(22, 119, 255)", cursor: "pointer" }}>
                        {text}
                    </span>
                );
            },
        },
        {
            title: "Total Successful Payment",
            dataIndex: "paymentCount",
        },
        {
            title: "Bill Paied",
            dataIndex: "bill",
            render: (text: any) => <span>${text}</span>,
        },
    ]);

    const [unpaidTableColumns] = useState([
        {
            title: "Period",
            dataIndex: "id",
            render: (text: any) => {
                const times = CalcMonthStartEndTime(text);
                const navFn = () => {
                    if (!times) {
                        return;
                    }
                    goOverview(times.startTimestamp, times.endTimestamp);
                };

                return (
                    <span onClick={navFn} style={{ color: "rgb(22, 119, 255)", cursor: "pointer" }}>
                        {text}
                    </span>
                );
            },
        },
        {
            title: "Total Successful Payment",
            dataIndex: "paymentCount",
        },
        {
            title: "Bill",
            dataIndex: "bill",
            render: (text: any) => <span>${text}</span>,
        },
    ]);

    const getUnpaidBills = useCallback(async () => {
        if (!user?.uid) {
            return;
        }
        setIsLoadingUnpaidData(true);
        try {
            const q = query(
                collection(FirebaseManager.firestore, `invoices/${user.uid}/invoices`),
                where("paied", "!=", true)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setUnpaidBills([]);
                setTotalUnpaid(0);
                setIsLoadingUnpaidData(false);
                return;
            }
            const tempBills: Array<any> = [];
            let tempTotal: number = 0;
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempTotal += doc.data().bill;
                    tempBills.push({ ...doc.data(), id: doc.id });
                }
            });
            setTotalUnpaid(parseFloat(tempTotal.toFixed(2)));
            setUnpaidBills(tempBills);
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsLoadingUnpaidData(false);
    }, [user?.uid]);

    const getHistoryBills = useCallback(async () => {
        if (!user?.uid) {
            return;
        }
        setIsLoadingHistoryData(true);
        try {
            const q = query(
                collection(FirebaseManager.firestore, `invoices/${user.uid}/invoices`),
                where("paied", "==", true)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setHistoryBills([]);
                setIsLoadingHistoryData(false);
                return;
            }
            const tempBills: Array<any> = [];
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempBills.push({ ...doc.data(), id: doc.id });
                }
            });
            setHistoryBills(tempBills);
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsLoadingHistoryData(false);
    }, [user?.uid]);

    const payBills = useCallback(
        (bills: Array<any>) => {
            let totalAmount = 0;
            bills.forEach(bill => {
                totalAmount += bill?.bill ?? 0;
            });

            const billPeriods = bills.map(item => item.id);

            if (totalAmount <= 0) {
                return;
            }

            setIsPaymentModalOpen(true);

            setTimeout(async () => {
                if (!payIframeRef?.current) {
                    console.error("payment iframe has not been init");
                    return;
                }
                try {
                    const payResult = await OcelotPay.request(
                        {
                            method: "request_payment",
                            params: {
                                valueInUSD: totalAmount,
                                defaultTokenCode: "usdt-polygon",
                                extraInfo: `${user?.uid}#${JSON.stringify(billPeriods)}`,
                            },
                        },
                        payIframeRef.current
                    );
                    console.log("pay result: ", payResult);
                    if (payResult?.receiptId) {
                        setTimeout(() => {
                            getUnpaidBills();
                            getHistoryBills();
                        }, 1000);
                        // try {
                        //     const result = await FirebaseManager.serverCallFunctions.payBills({
                        //         receiptId: payResult?.receiptId,
                        //         periods: billPeriods,
                        //         paymentType: "crypto",
                        //     });
                        //     if (result?.data?.success) {
                        //         // success
                        //         getUnpaidBills();
                        //         getHistoryBills();
                        //         setIsPaymentModalOpen(false);
                        //     } else {
                        //         // TODO: show receiptId and verify link
                        //         message.error("Unknown error");
                        //     }
                        // } catch (error: any) {
                        //     console.error(error);
                        //     // TODO: show receiptId and verify link
                        //     message.error(error?.message);
                        // }
                    } else {
                        // some thing wrong
                        messageApi.error("Payment failed");
                    }
                } catch (error: any) {
                    console.error(error);

                    if (error?.receiptId) {
                        // transaction maybe validat on chain but not saved on server
                        // TODO: show receiptId and verify link
                    } else {
                        messageApi.error("Payment failed");
                    }
                }
                // setIsPaymentModalOpen(false);
            }, 0);
        },
        [getUnpaidBills, getHistoryBills, messageApi, user?.uid]
    );

    useEffect(() => {
        getUnpaidBills();
    }, [getUnpaidBills]);

    useEffect(() => {
        getHistoryBills();
    }, [getHistoryBills]);

    useEffect(() => {
        const generatePaymentUrl = () => {
            const url = OcelotPay.generatePaymentUrl({});
            setPaymentUrl(url);
        };
        const cid = OcelotPay.onReady(generatePaymentUrl);

        return () => {
            if (cid) {
                OcelotPay.cancelOnReadyCallback(cid);
            }
        };
    }, []);

    return (
        <StyledContainer>
            {contextHolder}
            <GlobalStyle />
            <Modal
                title=""
                footer={null}
                open={isPaymentModalOpen}
                onCancel={() => setIsPaymentModalOpen(false)}
                className="pay-modal"
                forceRender={true}
                maskClosable={false}
            >
                <iframe
                    src={paymentUrl}
                    ref={payIframeRef}
                    title="payment"
                    style={{
                        width: "100%",
                        height: "600px",
                        border: "none",
                    }}
                />
            </Modal>
            <PanelTitle title="Bills" />
            <div className="title">Unpaid Bills</div>
            <Table
                columns={unpaidTableColumns}
                dataSource={unpaidBills}
                pagination={false}
                loading={isLoadingUnpaidData}
                footer={() =>
                    unpaidBills.length ? (
                        <div className="unpaid-table-footer">
                            <div className="text">
                                <span>Total: </span>
                                <span>${totalUnpaid}</span>
                            </div>

                            <Button
                                type="primary"
                                onClick={() => {
                                    payBills(unpaidBills);
                                }}
                            >
                                Pay Bills
                            </Button>
                        </div>
                    ) : null
                }
                rowKey="id"
            />

            <div className="title">History Bills</div>
            <Table
                columns={historyPaiedTableColumns}
                dataSource={historyBills}
                rowKey="id"
                loading={isLoadingHistoryData}
            />
        </StyledContainer>
    );
};

const GlobalStyle = createGlobalStyle`
    .pay-modal{
        .ant-modal-content{
            padding: 0;
            border-radius: 12px;

            .ant-modal-body{
                border-radius: 12px;

                iframe{
                    border-radius: 12px;
                }
            }
        }
    }
`;

const StyledContainer = styled.div.attrs({ className: "bills-content" })`
    .title {
        margin-top: 40px;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 500;
        /* padding: 0 20px; */
    }

    .ant-table-footer {
        .unpaid-table-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .text {
                font-size: 16px;
            }
        }
    }
`;

export default Bills;
