import { Schema } from "mongoose";
import { IBook, bookSchema } from "./book.schema";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  books: IBook;
};

export const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    books: [bookSchema],
  },
  {
    timestamps: true,
  }
);