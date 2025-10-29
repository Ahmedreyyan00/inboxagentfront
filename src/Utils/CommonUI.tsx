import { ButtonType } from "@/type/CommonUITypes";

export const Button = ({
  text,
  type = "button",
  bTakeFullWidth = false,
  bgRGBColor,
}: ButtonType) => {
  return (
    <button
      type={type}
      className={`${bTakeFullWidth ? "w-full" : ""} rounded-md ${
        bTakeFullWidth ? "w-full" : ""
      }  bg-[${bgRGBColor}] py-2 text-white hover:bg-neutral-800`}
    >
      {text}
    </button>
  );
};
