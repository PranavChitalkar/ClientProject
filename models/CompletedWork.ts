import { Model, Schema, model, models } from "mongoose";

export type CompletedWorkRecord = {
  project: string;
  client: string;
  completedOn: string;
  value: number;
};

const CompletedWorkSchema = new Schema<CompletedWorkRecord>(
  {
    project: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    completedOn: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
);

export const CompletedWorkModel =
  (models.CompletedWork as Model<CompletedWorkRecord>) ||
  model<CompletedWorkRecord>("CompletedWork", CompletedWorkSchema);
