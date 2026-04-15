import { Model, Schema, model, models } from "mongoose";

type WebsiteWorkRecord = {
  id: string;
  title: string;
  client: string;
  location: string;
  image: string;
  productSlug: string;
  status: string;
  summary: string;
};

const WebsiteWorkSchema = new Schema<WebsiteWorkRecord>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    productSlug: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export const WebsiteWorkModel =
  (models.WebsiteWork as Model<WebsiteWorkRecord>) ||
  model<WebsiteWorkRecord>("WebsiteWork", WebsiteWorkSchema);
