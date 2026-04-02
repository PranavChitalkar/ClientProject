import { Model, Schema, model, models } from "mongoose";

type ProductProjectRecord = {
  title: string;
  client: string;
  location: string;
  summary: string;
};

type ProductRecord = {
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  size: string;
  weight: string;
  pricing: string;
  material: string;
  thickness: string;
  visibility: string;
  warranty: string;
  bestFor: string[];
  features: string[];
  realProjects: ProductProjectRecord[];
};

const ProductProjectSchema = new Schema<ProductProjectRecord>(
  {
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ProductSchema = new Schema<ProductRecord>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    pricing: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    thickness: { type: String, required: true, trim: true },
    visibility: { type: String, required: true, trim: true },
    warranty: { type: String, required: true, trim: true },
    bestFor: { type: [String], default: [] },
    features: { type: [String], default: [] },
    realProjects: { type: [ProductProjectSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export const ProductModel =
  (models.Product as Model<ProductRecord>) || model<ProductRecord>("Product", ProductSchema);
