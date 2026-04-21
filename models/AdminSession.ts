import { Model, Schema, Types, model, models } from "mongoose";

export type AdminSessionRecord = {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
};

const AdminSessionSchema = new Schema<AdminSessionRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

export const AdminSessionModel =
  (models.AdminSession as Model<AdminSessionRecord>) ||
  model<AdminSessionRecord>("AdminSession", AdminSessionSchema);
