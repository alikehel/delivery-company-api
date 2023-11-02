import { Prisma } from "@prisma/client";
// import fs from "fs";
import PdfPrinter from "pdfmake";

export const handleArabicCharacters = (message: string) => {
    let arabic = [];
    let english = [];

    const regex = new RegExp(
        "[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]"
    );

    arabic = message.split(" ").filter((e) => regex.test(e));
    english = message.split(" ").filter((e) => !regex.test(e));
    return `${english.join(" ")} ${arabic.reverse().join("  ")}`;
};

export const generateReceipt = async (
    order: Prisma.OrderGetPayload<{
        include: {
            client: boolean;
            tenant: boolean;
        };
    }>
) => {
    const fonts = {
        Cairo: {
            normal: "fonts/Cairo-VariableFont_slntwght.ttf",
            bold: "fonts/Cairo-VariableFont_slntwght.ttf",
            italics: "fonts/Cairo-VariableFont_slntwght.ttf",
            bolditalics: "fonts/Cairo-VariableFont_slntwght.ttf"
        }
    };

    const printer = new PdfPrinter(fonts);

    // Generate the docDefinition dynamically based on the provided order data
    const docDefinition = {
        pageSize: "A4" as const,
        watermark: {
            text: handleArabicCharacters("شركة البرق"),
            color: "red",
            opacity: 0.03,
            bold: true,
            italics: false
        },
        content: [
            {
                image: "assets/albarq-logo.png",
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
                        ["", order.client.phone || "", order.client.name]
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
                            handleArabicCharacters("رقم الهاتف"),
                            handleArabicCharacters("اسم المستلم")
                        ],
                        [
                            order.recipientAddress || "",
                            order.recipientPhone || "",
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
            { qr: order.receiptNumber.toString() }
        ],
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
    //         `storage/receipts/receipt-${order.receiptNumber.toString()}.pdf`
    //     )
    // );
    // pdfDoc.end();

    return pdfDoc;
};
