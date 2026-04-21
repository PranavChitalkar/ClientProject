import { Model, Schema, model, models } from "mongoose";

export type AdminUserRecord = {
  email: string;
  passwordHash: string;
  resetCodeHash?: string;
  resetCodeExpiresAt?: Date;
};

const AdminUserSchema = new Schema<AdminUserRecord>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    resetCodeHash: { type: String },
    resetCodeExpiresAt: { type: Date },
  },
  { timestamps: true },
);

export const AdminUserModel =
  (models.AdminUser as Model<AdminUserRecord>) ||
  model<AdminUserRecord>("AdminUser", AdminUserSchema);
