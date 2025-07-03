import { toast } from "react-toastify";

export const handleApiStatus = (status: "success" | "error", message: string, error?: any): void => {
  if (status === "success") {
    console.log(message);
    toast.success(message);
  } else if (status === "error") {
    console.error(message, error?.message || error);
    toast.error(`${message}: ${error?.message || "An unexpected error occurred"}`);
  }
};
