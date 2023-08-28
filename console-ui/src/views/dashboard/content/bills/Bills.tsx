import { createGlobalStyle, styled } from "styled-components";
import { BuyWithCrypto } from "payWithCrypto";
import useFirebaseAuth from "../../../../common/zustand/useFirebaseAuth";
import PanelTitle from "../../../../componets/dashboard/PanelTitle";
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import FirebaseManager from "../../../../common/firebase/FirebaseManager";
import { Button, Modal } from "antd";

const Bills = () => {
    const { user } = useFirebaseAuth() as any;
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [unpaiedBills, setUnpaiedBills] = useState<Array<any>>([]);
    const [paymentUrl, setPaymentUrl] = useState<string>();
    const payIframeRef = useRef<HTMLIFrameElement>(null);

    const getUnpaiedBills = useCallback(async () => {
        if (!user?.uid) {
            return;
        }
        setIsLoadingData(true);
        try {
            const q = query(
                collection(FirebaseManager.firestore, `invoices/${user.uid}/invoices`),
                where("paied", "!=", true)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setUnpaiedBills([]);
                setIsLoadingData(false);
                return;
            }
            const tempBills: Array<any> = [];
            querySnapshot.forEach(doc => {
                if (doc.exists()) {
                    tempBills.push({ ...doc.data(), id: doc.id });
                }
            });
            setUnpaiedBills(tempBills);
        } catch (error) {
            // do nothing
            console.error(error);
        }
        setIsLoadingData(false);
    }, [user?.uid]);

    const payBills = useCallback((bills: Array<any>) => {
        let totalAmount = 0;
        bills.forEach(bill => {
            totalAmount += bill?.bill ?? 0;
        });

        setIsPaymentModalOpen(true);

        setTimeout(async () => {
            if (!payIframeRef?.current) {
                console.error("payment iframe has not been init");
                return;
            }
            try {
                const payResult = await BuyWithCrypto.request(
                    {
                        method: "request_payment",
                        params: { valueInUSD: totalAmount, defaultTokenCode: "usdt-polygon" },
                    },
                    payIframeRef.current
                );
                console.log("pay reslt: ", payResult);
            } catch (error) {
                console.error(error);
            }
        }, 0);
    }, []);

    useEffect(() => {
        getUnpaiedBills();
    }, [getUnpaiedBills]);

    useEffect(() => {
        const generatePaymentUrl = () => {
            const url = BuyWithCrypto.generatePaymentUrl({});
            setPaymentUrl(url);
        };
        const cid = BuyWithCrypto.onReady(generatePaymentUrl);

        return () => {
            if (cid) {
                BuyWithCrypto.cancelOnReadyCallback(cid);
            }
        };
    }, []);

    return (
        <StyledContainer>
            <GlobalStyle />
            <Modal
                title=""
                footer={null}
                open={isPaymentModalOpen}
                onCancel={() => setIsPaymentModalOpen(false)}
                className="pay-modal"
                forceRender={true}
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
            {unpaiedBills?.map(bill => (
                <div
                    key={bill.id}
                    onClick={() => {
                        payBills([bill]);
                    }}
                >
                    <span>{bill?.id}: </span> <span>- {bill?.paymentCount} -</span> <span>${bill?.bill}</span>{" "}
                    <Button type="primary">Pay</Button>
                </div>
            ))}
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

const StyledContainer = styled.div.attrs({ className: "bills-content" })``;

export default Bills;
