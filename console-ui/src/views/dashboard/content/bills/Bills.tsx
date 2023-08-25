import { styled } from "styled-components";
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

        console.log(payIframeRef?.current);

        setTimeout(() => {
            if (!payIframeRef?.current) {
                console.error("payment iframe has not been init");
                return;
            }
            BuyWithCrypto.request(
                { method: "request_payment", params: { valueInUSD: totalAmount, defaultTokenCode: "usdt-polygon" } },
                payIframeRef.current
            );
        }, 100);
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
            <Modal title="" open={isPaymentModalOpen} onCancel={() => setIsPaymentModalOpen(false)}>
                <iframe src={paymentUrl} ref={payIframeRef} title="payment" />
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

const StyledContainer = styled.div.attrs({ className: "bills-content" })``;

export default Bills;
