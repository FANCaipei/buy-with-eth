import axios from "axios";
import Configs from "../config";

// const sendBillingEmail = async (billPeriod: string, billAmount: number, targetEmailAddr: string): Promise<void> => {
//     await axios.post<any>(
//         "https://api.brevo.com/v3/smtp/email",
//         {
//             sender: {
//                 name: Configs.EmailName,
//                 email: Configs.EmailDomain,
//             },
//             to: [
//                 {
//                     email: targetEmailAddr,
//                 },
//             ],
//             subject: `Bill for ${billPeriod}`,
//             htmlContent: `<html><head></head><body>
//         <p>Your bill for ${billPeriod} is created, go <strong><a href="${Configs.BillConsoleHref}" target="_blank">console</a></strong> for detail and paying.</p>
//         <p>Please pay this bill in 7 days, or your project will be disabled</p>
//         <p style="text-align: center; font-size: 36px; font-weight: bold">$${billAmount}</p>
//         </body></html>`,
//         },
//         {
//             headers: {
//                 Accept: "application/json",
//                 "api-key": Configs.BrevoEmailApiKey,
//             },
//         }
//     );
//     return;
// };

const sendBillingEmailWithTemplate = async (
    billPeriod: string,
    billAmount: number,
    targetEmailAddr: string
): Promise<void> => {
    await axios.post<any>(
        "https://api.brevo.com/v3/smtp/email",
        {
            to: [
                {
                    email: targetEmailAddr,
                },
            ],
            templateId: 1,
            params: {
                billPeriod: billPeriod,
                billAmount: billAmount,
                consoleHref: Configs.BillConsoleHref,
            },
        },
        {
            headers: {
                Accept: "application/json",
                "api-key": Configs.BrevoEmailApiKey,
            },
        }
    );
    return;
};

export { sendBillingEmailWithTemplate };
