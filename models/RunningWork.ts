import { Model, Schema, model, models } from "mongoose";

type RunningWorkRecord = {
  project: string;
  client: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string;
  expectedEndDate: string;
  totalAmount: number;
  advancePaid: number;
  receivedAmount: number;
  remainingAmount: number;
  warrantyMonths: number;
};

const RunningWorkSchema = new Schema<RunningWorkRecord>(
  {
    project: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    budget: { type: Number, required: true, min: 0 },
    startDate: { type: String, required: true, trim: true },
    expectedEndDate: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    advancePaid: { type: Number, required: true, min: 0, default: 0 },
    receivedAmount: { type: Number, required: true, min: 0, default: 0 },
    remainingAmount: { type: Number, required: true, min: 0, default: 0 },
    warrantyMonths: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const RunningWorkModel =
  (models.RunningWork as Model<RunningWorkRecord>) ||
  model<RunningWorkRecord>("RunningWork", RunningWorkSchema);
