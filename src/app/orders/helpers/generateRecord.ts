import { Order } from "@prisma/client";
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

export const generateRecord = async (orders: Order[]) => {
    let counter = 0;

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
        pageOrientation: "landscape" as const,
        watermark: {
            text: handleArabicCharacters("شركة البرق"),
            color: "red",
            opacity: 0.03,
            bold: true,
            italics: false
        },
        defaultStyle: {
            font: "Cairo",
            alignment: "center" as const,
            fontSize: 10
            // direction: "rtl" // Right-to-left text direction for Arabic
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: 10
                // alignment: "right" as const
            },
            red: {
                color: "red"
            }
        },
        // direction: "rtl" // Right-to-left text direction for Arabic
        content: [
            {
                image: "assets/albarq-logo.png",
                width: 80
            },
            { text: "\n" },
            // table of orders
            {
                table: {
                    headerRows: 1,
                    // widths: [, , , , , , , , , ],
                    // wedths depends on header row length that are fixed
                    widths: [
                        "auto",
                        "auto",
                        "auto",
                        "auto",
                        "auto",
                        "*",
                        "auto",
                        "auto",
                        "auto",
                        "auto"
                    ],
                    body: [
                        [
                            {
                                text: handleArabicCharacters("الملاحظات"),
                                noWrap: true,
                                fillColor: "#5bc0de"
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("صافي العميل"),
                                noWrap: true
                                // style: "header"
                            },

                            {
                                text: handleArabicCharacters("مبلغ التوصيل"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("المبلغ المستلم"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("مبلغ الوصل"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("عنوان المستلم"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("هاتف المستلم"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("انشئ في"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("رقم الوصل"),
                                noWrap: true
                                // style: "header"
                            },
                            {
                                text: handleArabicCharacters("#"),
                                noWrap: true
                                // style: "header"
                            }
                        ],
                        ...orders.map((order) => [
                            {
                                text: handleArabicCharacters(
                                    "مسجد جامعة بغداد"
                                ),
                                style: "red",
                                fillColor: "#5bc0de"
                            },
                            {
                                text: handleArabicCharacters("عمر احمد" || ""),
                                fillColor: "#5bc0de"
                            },
                            {
                                text: handleArabicCharacters("500000" || "0")
                            },
                            {
                                text: handleArabicCharacters(
                                    order.paidAmount?.toString() || "0"
                                )
                            },
                            {
                                text: handleArabicCharacters(
                                    order.totalCost.toString()
                                )
                            },
                            {
                                text: handleArabicCharacters("مسجد جامعة بغداد")
                            },
                            {
                                text: handleArabicCharacters(
                                    order.recipientPhone
                                )
                            },
                            {
                                text: handleArabicCharacters(
                                    order.createdAt.toLocaleDateString()
                                )
                            },
                            {
                                text: handleArabicCharacters(
                                    order.receiptNumber.toString()
                                )
                            },
                            {
                                text: ++counter
                            }
                        ])
                    ]
                }
            }
        ]
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
