import {
    FiCheck,
    FiAlertCircle,
    FiX
} from "react-icons/fi";

import toast from "react-hot-toast";

export default function CustomToast({ t, type, message }) {
    const isSuccess = type === "success";

    const closeToast = () => {
        toast.dismiss(t.id);
    };

    return (
        <div className={`${t.visible ? "toast-enter" : "toast-leave"} w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden`}>

            <div className="flex items-start gap-3 p-4">

                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                    {isSuccess ? (
                        <FiCheck size={22} strokeWidth={3} />
                    ) : (
                        <FiAlertCircle size={21} />
                    )}
                </div>

                {/* Text */}
                <div {...t.ariaProps} className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900">
                        {isSuccess ? "Success" : "Error"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {message}
                    </p>
                </div>

                {/* Close */}
                <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={closeToast}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <FiX size={18} />
                </button>

            </div>

            {/* Bottom Line */}
            <div className={`h-[3px] ${isSuccess ? "bg-green-500" : "bg-red-500"}`} />

        </div>
    );
}