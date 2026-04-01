import { Model, Schema, model, models } from "mongoose";

export type OrderPaymentRecord = {
  orderId: string;
  client: string;
  totalAmount: number;
  advancePaid: number;
  receivedAmount: number;
  remainingAmount: number;
  paymentStatus: string;
};

const OrderPaymentSchema = new Schema<OrderPaymentRecord>(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    client: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, required: true, min: 0 },
    receivedAmount: { type: Number, required: true, min: 0 },
    remainingAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export const OrderPaymentModel =
  (models.OrderPayment as Model<OrderPaymentRecord>) ||
  model<OrderPaymentRecord>("OrderPayment", OrderPaymentSchema);
