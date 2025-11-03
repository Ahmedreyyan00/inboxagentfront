import Api from "@/lib/Api";
import { setInvoice } from "@/redux/slice/invoiceSlice";

export const fetchInvoiceData = async (dispatch: any, page: number = 1, limit: number = 10) => {
  try {
    const response = await Api.getInvoiceData(page, limit);
    dispatch(setInvoice(response.data));
  } catch (error: any) {
    console.log(error);
  }
};
