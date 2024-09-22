import { ToastOptions, toast } from "react-toastify";

export const Notification = (
  message: string,
  type: "error" | "success" | "warning"
) => {
  const options: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warning":
      return toast.warning(message, options);
    default:
      return null;
  }
};
