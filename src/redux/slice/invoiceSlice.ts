import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvoiceData {
  success: boolean;
  data: FilteredInvoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilteredInvoice {
  status: string;
  supplierName: string;
  amount: number;
  invoiceDate: string;
  clientId: string;
  dueDate?: string;
}

interface InvoiceState {
  invoiceData: InvoiceData;
}

const initialState: InvoiceState = {
  invoiceData: {} as any,
};

const InvoiceSlice = createSlice({
  name: "Invoice",
  initialState,
  reducers: {
    setInvoice: (state, action: PayloadAction<InvoiceData>) => {
      state.invoiceData = action.payload;
    },
  },
});

export const { setInvoice } = InvoiceSlice.actions;
export default InvoiceSlice.reducer;
