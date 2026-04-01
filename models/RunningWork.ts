import { Model, Schema, model, models } from "mongoose";

export type RunningWorkRecord = {
  project: string;
  client: string;
  location: string;
  status: string;
  progress: number;
  budget: number;
};

const RunningWorkSchema = new Schema<RunningWorkRecord>(
  {
    project: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    budget: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
);

export const RunningWorkModel =
  (models.RunningWork as Model<RunningWorkRecord>) ||
  model<RunningWorkRecord>("RunningWork", RunningWorkSchema);
