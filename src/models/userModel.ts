import { Schema, model,Types } from 'mongoose';


interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isDisabled: boolean;
  createdDate: Date;
  updatedDate: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDisabled: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

const User = model<IUser>('User', userSchema);
export { User, IUser };
