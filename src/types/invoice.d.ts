export interface IInvoice {
  status: string;
  supplierName: string;
  amount: string;
  invoiceDate: Date;
  dueDate: Date;
  user: mongoose.Schema.Types.ObjectId;
  subject: string;
  emailId?: string; // Gmail email ID to prevent processing the same email twice
  emailSent?: boolean; // Track if invoice has been sent to accountant
  createdAt: Date;
  updatedAt: Date;
  s3Url: string;
  _id: string;
  filename: string;
  parsedAmount: number;
  currency: string;
  }
