import toast from "react-hot-toast";

type ToastOptions = {
  duration?: number;
  id?: string;
};

export const appToast = {
  success(message: string, options?: ToastOptions) {
    return toast.success(message, options);
  },
  error(message: string, options?: ToastOptions) {
    return toast.error(message, options);
  },
  loading(message: string, options?: ToastOptions) {
    return toast.loading(message, options);
  },
  dismiss(id?: string) {
    toast.dismiss(id);
  },
};

