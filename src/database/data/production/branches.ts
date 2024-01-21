import { Governorate, Prisma, PrismaClient } from "@prisma/client";
import { locations } from "./locations";

export const getData = (companyID: number) => {
    return [
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع بغداد",
            email: "",
            phone: "7822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن بغداد الرئيسي",
                            companyId: companyID
                        },
                        {
                            name: "مخزن المحافظات الرئيسي",
                            companyId: companyID
                        },
                        {
                            name: "مخزن فرع الكرادة",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "بغداد") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.BAGHDAD
                        }))
                }
            }
        },
        {
            governorate: Governorate.BABIL,
            name: "فرع الحلة",
            email: "Hillah@nahar.com",
            phone: "7822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الحلة الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "بابل") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.BABIL
                        }))
                }
            }
        },
        {
            governorate: Governorate.KARBALA,
            name: "فرع كربلاء",
            email: "karblaa@nahar.com",
            phone: "07822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن كربلاء الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "كربلاء") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.KARBALA
                        }))
                }
            }
        },
        {
            governorate: Governorate.NAJAF,
            name: "فرع النجف",
            email: "Najaf@nahar.com",
            phone: "7822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن النجف الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "النجف") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.NAJAF
                        }))
                }
            }
        },
        {
            governorate: Governorate.KIRKUK,
            name: "فرع كركوك",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن كركوك الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "كركوك") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.KIRKUK
                        }))
                }
            }
        },
        {
            governorate: Governorate.AL_QADISIYYAH,
            name: "فرع الديوانية",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الديوانية الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "القادسية") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.AL_QADISIYYAH
                        }))
                }
            }
        },
        {
            governorate: Governorate.DUHOK,
            name: "فرع دهوك",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن دهوك الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "دهوك") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.DUHOK
                        }))
                }
            }
        },
        {
            governorate: Governorate.ERBIL,
            name: "فرع اربيل",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن اربيل الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "أربيل") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.ERBIL
                        }))
                }
            }
        },
        {
            governorate: Governorate.SULAYMANIYAH,
            name: "فرع السليمانية",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن السليمانية الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "السليمانية") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.SULAYMANIYAH
                        }))
                }
            }
        },
        {
            governorate: Governorate.NINAWA,
            name: "فرع الموصل",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الموصل الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "نينوى") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.NINAWA
                        }))
                }
            }
        },
        {
            governorate: Governorate.SALAH_AL_DIN,
            name: "فرع صلاح الدين",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن صلاح الدين الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "صلاح الدين") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.SALAH_AL_DIN
                        }))
                }
            }
        },
        {
            governorate: Governorate.DIYALA,
            name: "فرع ديالى",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن ديالى الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "ديالى") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.DIYALA
                        }))
                }
            }
        },
        {
            governorate: Governorate.BASRA,
            name: "عبدالله فرع البصرة",
            email: "",
            phone: "07717858525",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن البصرة الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "البصرة") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.BASRA
                        }))
                }
            }
        },
        {
            governorate: Governorate.MAYSAN,
            name: "فرع العمارة",
            email: "",
            phone: "07822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن العمارة الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "ميسان") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.MAYSAN
                        }))
                }
            }
        },
        {
            governorate: Governorate.AL_ANBAR,
            name: "فرع الانبار",
            email: "",
            phone: "07822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الانبار الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "الانبار") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.AL_ANBAR
                        }))
                }
            }
        },
        {
            governorate: Governorate.WASIT,
            name: "فرع الكوت",
            email: "",
            phone: "07822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الكوت الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "واسط") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.WASIT
                        }))
                }
            }
        },
        {
            governorate: Governorate.MUTHANNA,
            name: "فرع السماوة",
            email: "",
            phone: "07822816693",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن السماوة الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "المثنى") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.MUTHANNA
                        }))
                }
            }
        },
        {
            governorate: Governorate.DHI_QAR,
            name: "فرع الناصرية(ذي قار)",
            email: "",
            phone: "07713642110",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن الناصرية الرئيسي",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "ناصرية شركات") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.DHI_QAR
                        }))
                }
            }
        },
        {
            governorate: Governorate.BASRA,
            name: "فرع البصرة شركات",
            email: "",
            phone: "10000000",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن حسام البصرة",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "بصرة شركات") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.BASRA
                        }))
                }
            }
        },
        {
            governorate: Governorate.BABIL,
            name: "فرع بابل شركات",
            email: "",
            phone: "10002000",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن بابل شركات",
                            companyId: companyID
                        }
                    ]
                }
            },
            locations: {
                createMany: {
                    data: locations
                        .filter((location) => {
                            if (location.governorate === "شركات بابل") {
                                return true;
                            }
                        })
                        .map((location) => ({
                            name: location.name,
                            companyId: companyID,
                            governorate: Governorate.BABIL
                        }))
                }
            }
        },
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع مدينة الصدر",
            email: "",
            phone: "900800700",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن مدينة الصدر",
                            companyId: companyID
                        }
                    ]
                }
            }
            // locations: {
            //     createMany: {
            //         data: locations
            //             .filter((location) => {
            //                 if (location.governorate === ) {
            //                     return true;
            //                 }
            //             })
            //             .map((location) => ({
            //                 name: location.name,
            //                 companyId: companyID,
            //                 governorate: Governorate.
            //             }))
            //     }
            // }
        },
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع حي العدل",
            email: "ll661288@gmail.com",
            phone: "90008000",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن حي العدل",
                            companyId: companyID
                        }
                    ]
                }
            }
            // locations: {
            //     createMany: {
            //         data: locations
            //             .filter((location) => {
            //                 if (location.governorate === ) {
            //                     return true;
            //                 }
            //             })
            //             .map((location) => ({
            //                 name: location.name,
            //                 companyId: companyID,
            //                 governorate: Governorate.
            //             }))
            //     }
            // }
        },
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع الاعظمية",
            email: "",
            phone: "400500700",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن فرع الاعظمية",
                            companyId: companyID
                        }
                    ]
                }
            }
            // locations: {
            //     createMany: {
            //         data: locations
            //             .filter((location) => {
            //                 if (location.governorate === ) {
            //                     return true;
            //                 }
            //             })
            //             .map((location) => ({
            //                 name: location.name,
            //                 companyId: companyID,
            //                 governorate: Governorate.
            //             }))
            //     }
            // }
        },
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع حي الجهاد",
            email: "",
            phone: "2233556677",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن حي الجهاد",
                            companyId: companyID
                        }
                    ]
                }
            }
            // locations: {
            //     createMany: {
            //         data: locations
            //             .filter((location) => {
            //                 if (location.governorate === ) {
            //                     return true;
            //                 }
            //             })
            //             .map((location) => ({
            //                 name: location.name,
            //                 companyId: companyID,
            //                 governorate: Governorate.
            //             }))
            //     }
            // }
        },
        {
            governorate: Governorate.BAGHDAD,
            name: "فرع الزعفرانية",
            email: "",
            phone: "00001111",
            companyId: companyID,
            repositories: {
                createMany: {
                    data: [
                        {
                            name: "مخزن زعفرانية",
                            companyId: companyID
                        }
                    ]
                }
            }
            // locations: {
            //     createMany: {
            //         data: locations
            //             .filter((location) => {
            //                 if (location.governorate === ) {
            //                     return true;
            //                 }
            //             })
            //             .map((location) => ({
            //                 name: location.name,
            //                 companyId: companyID,
            //                 governorate: Governorate.
            //             }))
            //     }
            // }
        }
    ] satisfies Prisma.BranchUncheckedCreateInput[];
};

export const createData = async (prisma: PrismaClient, companyID: number) => {
    const data = getData(companyID);
    // for (const branch of data) {
    //     await prisma.branch.create({
    //         data: branch
    //     });
    // }
    await prisma.$transaction(
        data.map((branch) =>
            prisma.branch.create({
                data: branch
            })
        )
    );
};
