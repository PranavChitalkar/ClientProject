import { Model, Schema, model, models } from "mongoose";

type StockItemRecord = {
  item: string;
  available: string;
  status: "Healthy" | "Low stock";
};

const StockItemSchema = new Schema<StockItemRecord>(
  {
    item: { type: String, required: true, trim: true },
    available: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["Healthy", "Low stock"],
      default: "Healthy",
    },
  },
  {
    timestamps: true,
  },
);

export const StockItemModel =
  (models.StockItem as Model<StockItemRecord>) || model<StockItemRecord>("StockItem", StockItemSchema);
