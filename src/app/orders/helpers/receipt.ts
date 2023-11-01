import { Prisma } from "@prisma/client";
import { createCanvas } from "canvas";
import fs from "fs";
import handlebars from "handlebars";
import pdf from "html-pdf";
import jsbarcode from "jsbarcode";
// import path from "path";
import QRCode from "qrcode";

// Function to generate the PDF receipt
const generateBarcode = async (orderID: string) => {
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(1, 1);
        jsbarcode(canvas, orderID, {
            lineColor: "#000",
            width: 2,
            height: 30,
            displayValue: false
        });
        canvas.toDataURL("image/png", (err, png) => {
            if (err) {
                reject(err);
            } else {
                resolve(png);
            }
        });
    });
};
// Order with all select and include options
export const generateReceipt = async (
    order: Prisma.OrderGetPayload<{
        include: {
            client: boolean;
            tenant: boolean;
        };
    }>
) => {
    const templatePath = "./templates/receipt.hbs";
    const template = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(
        template
        // {
        // allowProtoMethodsByDefault: true,
        // allowProtoPropertiesByDefault: true
        // }
    );
    // const date = new Date(order.createdAt);

    const qr = await QRCode.toString(
        `${order.receiptNumber.toString()}`,
        {
            errorCorrectionLevel: "H",
            type: "svg"
        },
        function (err, data) {
            if (err) throw err;
            return data;
        }
    );

    const barcode = await generateBarcode(order.receiptNumber.toString());

    const html = compiledTemplate({
        logo: "order.tenant.logo",
        id: order.receiptNumber.toString(),
        recipient_name: order.recipientName,
        recipient_phone: order.recipientPhone,
        client_name: order.client.name,
        client_phone: order.client.phone,
        date: order.createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        }),
        address: `${order.recipientAddress}`,
        quantity: order.quantity ? order.quantity : "",
        type: order.deliveryType ? order.deliveryType : "",
        notes: order.notes ? order.notes : "",
        total: order.totalCost.toLocaleString(),
        tenant: order.tenant,
        registration: "order.tenant.registration",
        qr,
        barcode
    });

    pdf.create(html, {
        format: "A5"
    }).toFile(
        `storage/receipts/receipt-${order.receiptNumber.toString()}.pdf`,
        (err, res) => {
            if (err) return console.log(err);
            return res.filename;
        }
    );
};
