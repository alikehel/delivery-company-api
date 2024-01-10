import {
    // Role,
    AdminRole,
    ClientRole,
    // AccountType,
    DeliveryType,
    EmployeeRole,
    Governorate,
    OrderStatus,
    Permission,
    ReportStatus,
    ReportType
} from "@prisma/client";

export const localizeOrderStatus = (text: OrderStatus): string => {
    switch (text) {
        case "REGISTERED":
            return "تم تسجيل الطلب";
        case "READY_TO_SEND":
            return "جاهز للارسال";
        case "WITH_DELIVERY_AGENT":
            return "بالطريق مع المندوب";
        case "DELIVERED":
            return "تم تسليم الطلب";
        case "REPLACED":
            return "استبدال الطلب";
        case "PARTIALLY_RETURNED":
            return "راجع جزئى";
        case "RETURNED":
            return "راجع كلي";
        case "POSTPONED":
            return "مؤجل";
        case "CHANGE_ADDRESS":
            return "تغيير العنوان";
        case "RESEND":
            return "اعاده الارسال";
        case "WITH_RECEIVING_AGENT":
            return "عند مندوب الاستلام";
        case "PROCESSING":
            return "قيد المعالجه";
        default:
            return text;
    }
};

export const localizeDeliveryType = (text: DeliveryType): string => {
    switch (text) {
        case "NORMAL":
            return "توصيل عادي";
        case "REPLACEMENT":
            return "استبدال";
        default:
            return text;
    }
};

export const localizeReportStatus = (text: ReportStatus): string => {
    switch (text) {
        case "UNPAID":
            return "لم يتم التحاسب";
        case "PAID":
            return "تم التحاسب";
        default:
            return text;
    }
};

export const localizeRole = (text: AdminRole | EmployeeRole | ClientRole): string => {
    switch (text) {
        case "COMPANY_MANAGER":
            return "مدير الشركه";
        case "ACCOUNT_MANAGER":
            return "مدير الحسابات";
        case "ACCOUNTANT":
            return "محاسب";
        case "DELIVERY_AGENT":
            return "مندوب توصيل";
        case "RECEIVING_AGENT":
            return "مندوب استلام";
        case "BRANCH_MANAGER":
            return "مدير فرع";
        case "EMERGENCY_EMPLOYEE":
            return "موظف طوارئ";
        case "DATA_ENTRY":
            return "مدخل بيانات";
        case "REPOSITORIY_EMPLOYEE":
            return "موظف مخزن";
        case "INQUIRY_EMPLOYEE":
            return "موظف استعلامات";
        case "CLIENT_ASSISTANT":
            return "مساعد عميل";
        case "CLIENT":
            return "عميل";
        case "SUPER_ADMIN":
            return "سوبر ادمن";
        case "ADMIN":
            return "ادمن";
        default:
            return text;
    }
};

export const localizePermission = (text: Permission): string => {
    switch (text) {
        case "ADD_ORDER_TO_DELIVERY_AGENT":
            return "احالة الطلبات الي المندوب";
        case "ADD_PAGE":
            return "اضافة صفحة";
        case "ADD_ORDER":
            return "اضافة طلبية";
        case "ADD_CLIENT":
            return "اضافة عميل";
        case "EDIT_CLIENT_NAME":
            return "تعديل اسم عميل";
        case "EDIT_ORDER_TOTAL_AMOUNT":
            return "تعديل المبلغ الكلي للعملية";
        case "CHANGE_ORDER_STATUS":
            return "تغيير الحالة";
        case "CHANGE_CLOSED_ORDER_STATUS":
            return "تغيير حالة الطلبية المغلقة";
        case "LOCK_ORDER_STATUS":
            return "قفل حالة الطلبية";
        case "DELETE_PRICES":
            return "مسح الاسعار";
        case "DELETE_ORDERS":
            return "مسح الطلبيات";
        case "DELETE_REPORTS":
            return "مسح الكشوفات";
        case "DELETE_COMPANY_REPORTS":
            return "مسح كشوفات الشركات";
        case "DELETE_REPOSITORIES_REPORTS":
            return "مسح كشوفات المخازن";
        case "DELETE_GOVERNMENT_REPORTS":
            return "مسح كشوفات المحافظات";
        case "DELETE_DELIVERY_AGENT_REPORTS":
            return "مسح كشوفات المندوبين";
        default:
            return text;
    }
};

export const localizeGovernorate = (text: Governorate): string => {
    switch (text) {
        case "AL_ANBAR":
            return "الانبار";
        case "BABIL":
            return "بابل";
        case "BAGHDAD":
            return "بغداد";
        case "BASRA":
            return "البصرة";
        case "DHI_QAR":
            return "ذي قار";
        case "AL_QADISIYYAH":
            return "القادسية";
        case "DIYALA":
            return "ديالى";
        case "DUHOK":
            return "دهوك";
        case "ERBIL":
            return "اربيل";
        case "KARBALA":
            return "كربلاء";
        case "KIRKUK":
            return "كركوك";
        case "MAYSAN":
            return "ميسان";
        case "MUTHANNA":
            return "المثنى";
        case "NAJAF":
            return "النجف";
        case "NINAWA":
            return "نينوى";
        case "SALAH_AL_DIN":
            return "صلاح الدين";
        case "SULAYMANIYAH":
            return "السليمانية";
        case "WASIT":
            return "واسط";
        default:
            return text;
    }
};

export const localizeReportType = (text: ReportType): string => {
    switch (text) {
        case "COMPANY":
            return "شركة";
        case "REPOSITORY":
            return "مخزن";
        case "GOVERNORATE":
            return "محافظة";
        case "DELIVERY_AGENT":
            return "مندوب";
        case "BRANCH":
            return "فرع";
        case "CLIENT":
            return "عميل";
        default:
            return text;
    }
};
