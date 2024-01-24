import mongoose from 'mongoose';
import { userSchema, IUser } from '../schema/user.schema';

export const User = mongoose.model<IUser>('User', userSchema);