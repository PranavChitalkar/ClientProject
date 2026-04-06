import { Model, Schema, model, models } from "mongoose";

type CompletedWorkRecord = {
  project: string;
  client: string;
  completedOn: string;
  value: number;
  warrantyMonths: number;
  warrantyStartOn: string;
  warrantyValidTill: string;
};

const CompletedWorkSchema = new Schema<CompletedWorkRecord>(
  {
    project: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    completedOn: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    warrantyMonths: { type: Number, required: true, min: 0, default: 0 },
    warrantyStartOn: { type: String, required: true, trim: true },
    warrantyValidTill: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export const CompletedWorkModel =
  (models.CompletedWork as Model<CompletedWorkRecord>) ||
  model<CompletedWorkRecord>("CompletedWork", CompletedWorkSchema);
