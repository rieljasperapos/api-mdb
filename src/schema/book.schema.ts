import { Schema } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  publishYear: number;
  image: Buffer;
  [key: string]: any;
}

export const bookSchema: Schema<IBook> = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: Buffer,
    }
  },
  {
    timestamps: true,
  }
);
