import mongoose, { Document } from 'mongoose';
import { bookSchema, IBook } from '../schema/book.schema';

export const Book = mongoose.model<IBook>('Book', bookSchema);