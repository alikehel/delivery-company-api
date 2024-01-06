// TODO: Fix this
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// import fs from "fs";
import PdfPrinter from "pdfmake";
import handleArabicCharacters from "../../../utils/handleArabicCharacters";
import { orderReform } from "../order.model";

// TODO
export const generateReceipts = async (orders: (typeof orderReform)[]) => {
    const fonts = {
        Cairo: {
            normal: "static/fonts/Cairo-VariableFont_slntwght.ttf",
            bold: "static/fonts/Cairo-VariableFont_slntwght.ttf",
            italics: "static/fonts/Cairo-VariableFont_slntwght.ttf",
            bolditalics: "static/fonts/Cairo-VariableFont_slntwght.ttf"
        }
    };

    const printer = new PdfPrinter(fonts);

    // Generate the docDefinition dynamically based on the provided orders data
    const docDefinition = {
        pageSize: "A4" as const,
        watermark: {
            text: handleArabicCharacters("شركة البرق"),
            color: "red",
            opacity: 0.03,
            bold: true,
            italics: false
        },
        content: orders.map((order) => {
            return [
                {
                    image: order.company.logo,
                    width: 80
                },
                { text: "\n" },
                // { text: handleArabicCharacters("تفاصيل الإيصال"), style: "header" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*"],
                        body: [
                            [
                                handleArabicCharacters("التوقيع"),
                                handleArabicCharacters("رقم الهاتف"),
                                handleArabicCharacters("اسم العميل")
                            ],
                            [
                                "",
                                order.client?.phone || "",
                                order.client?.name || ""
                            ]
                        ]
                    }
                },
                { text: "\n" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*"],
                        body: [
                            [
                                handleArabicCharacters("التاريخ"),
                                handleArabicCharacters("رقم الوصل")
                            ],
                            [
                                handleArabicCharacters(
                                    order.createdAt.toLocaleDateString()
                                ),
                                order.receiptNumber.toString()
                            ]
                        ]
                    }
                },
                { text: "\n" },
                // { text: handleArabicCharacters("تفاصيل العميل"), style: "header" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*"],
                        body: [
                            [
                                handleArabicCharacters("العنوان"),
                                handleArabicCharacters("ارقام الهاتف"),
                                handleArabicCharacters("اسم المستلم")
                            ],
                            [
                                order.recipientAddress || "",
                                order.recipientPhones.map((phone, i) => {
                                    return i ===
                                        order.recipientPhones.length - 1
                                        ? phone
                                        : phone + " - ";
                                }) || "",
                                order.recipientName
                            ]
                        ]
                    }
                },
                { text: "\n" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*", "*", "*"],
                        body: [
                            [
                                handleArabicCharacters("المبلغ مع التوصيل"),
                                handleArabicCharacters("الكمية"),
                                handleArabicCharacters("النوع")
                            ],
                            [
                                order.totalCost.toString(),
                                order.quantity.toString(),
                                order.deliveryType || ""
                            ]
                        ]
                    }
                },
                { text: "\n" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*"],
                        body: [
                            [handleArabicCharacters("ملاحظات")],
                            [order.notes || ""]
                        ]
                    }
                },
                { text: "\n" },
                {
                    layout: "lightHorizontalLines",
                    table: {
                        headerRows: 1,
                        widths: ["*"],
                        body: [
                            [handleArabicCharacters("التسجيل")],
                            [handleArabicCharacters("الشركة مسجلة قانونياً")],
                            [
                                handleArabicCharacters(
                                    "الشركه مسؤوله عن توصيل الطلبات فقط"
                                )
                            ],
                            [
                                handleArabicCharacters(
                                    "يسقط حق المطالبة بالوصل بعد مرور شهر من تاريخ الوصل"
                                )
                            ]
                        ]
                    }
                },
                { text: "\n" },
                {
                    qr: order.id.toString(),
                    pageBreak: "after" as const
                }
            ];
        }),
        defaultStyle: {
            font: "Cairo",
            alignment: "right" as const,
            fontSize: 12
            // direction: "rtl" // Right-to-left text direction for Arabic
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: 10
                // alignment: "right" as const
            }
        }
        // direction: "rtl" // Right-to-left text direction for Arabic
    };

    const options = {};

    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    // if (!fs.existsSync("storage/receipts")) {
    //     fs.mkdirSync("storage/receipts", { recursive: true });
    // }

    // pdfDoc.pipe(
    //     fs.createWriteStream(
    //         `storage/receipts/receipt-${orders.receiptNumber.toString()}.pdf`
    //     )
    // );
    // pdfDoc.end();

    return pdfDoc;
};
