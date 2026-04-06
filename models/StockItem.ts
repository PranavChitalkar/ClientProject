import { Model, Schema, model, models } from "mongoose";

type StockItemRecord = {
  item: string;
  available: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: "Healthy" | "Low stock";
};

const StockItemSchema = new Schema<StockItemRecord>(
  {
    item: { type: String, required: true, trim: true },
    available: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, required: true, trim: true, default: "units" },
    reorderLevel: { type: Number, required: true, min: 0, default: 0 },
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
