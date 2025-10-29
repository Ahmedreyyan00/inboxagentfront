import toast from "react-hot-toast";

export const toastWarn = (message: string) => {
  toast(message, {
    icon: "⚠️",
    style: {
      background: "#fffbe6",
      color: "#664d03",
      border: "1px solid #ffecb5",
    },
  });
};
