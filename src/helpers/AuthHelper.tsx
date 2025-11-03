import axiosInstance from "@/api/axiosInstance";
import { clearUser, setUser } from "@/redux/slice/userSlice";
import { LoginPayload, SignUpPayload } from "@/type/Login.model";
import { toastWarn } from "@/Utils/toastCustom";
import toast from "react-hot-toast";
import { fetchInvoiceData } from "./InvoiceHelper";
import Api from "@/lib/Api";


export const handleSignup = async (
  { fullName, email, password }: SignUpPayload,
  confirmPassword: string,
  setLoading: any
) => {
  if (
    email === "" ||
    password === "" ||
    confirmPassword === "" ||
    fullName === ""
  ) {
    toastWarn("Please enter all the fields");
    return false;
  }

  if (password !== confirmPassword) {
    toastWarn("Passwords should match");
    return false;
  }
  setLoading(true);
  try {
    const response = await axiosInstance.post("/api/auth/signup", {
      fullName,
      email,
      password,
    });

    if (response.data.success) {
      toast.success("Signed up successfully!");
      return true;
    } else {
      toast.error("Sign up failed");
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Signup failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

export const handleDashboardAuth = async (
  token: any,
  setLoading: any,
  router: any,
  dispatch: any
) => {
  if (!token) {
    console.log("no token so pushing to login");

    router.push("/login");
    toastWarn("Please Login");
    return false;
  }
  setLoading(true);
  try {
    const response = await Api.getProfile();
    console.log("Profile response:", response);

    if (response.data.success) return true;
    router.push("/login");
    return false;
  } catch (error: any) {
    // Don't show error or redirect immediately if it's a 401 - could be timing issue
    if (
      error?.response?.status === 401 ||
      error?.message?.includes("No authorization token found")
    ) {
      console.warn(
        "Profile API call failed, possibly due to session timing:",
        error.message
      );
      return false; // Return false but don't redirect
    }

    // For other errors, show error and redirect
    toast.error(error?.response?.data?.message || "Authentication failed");
    localStorage.removeItem("token");
    router.push("/login");
    dispatch(clearUser());
    return false;
  }
};
