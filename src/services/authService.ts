import { Request, Response } from 'express';
import { User, IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Finds user and validates credentials, then sends a JWT token based on the user's ID
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user: IUser | null = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ userId: user._id.toString() }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

interface ServiceReturn {
  success: boolean;
  message: string;
  data: IUser | null;
}
// Method to return service response
const serviceReturn = (success: boolean, message: string, data: any) => {
  return {
    success,
    message,
    data
  };
};

// Method to add user
export const register = async (name: string, email: string, password:string): Promise<ServiceReturn> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return serviceReturn(false, 'Email already in use', null);
  }

  const hashedPassword = await bcrypt.hash(password,10); 

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    createdDate: new Date(),
    updatedDate: new Date(),
  });
  try {
    const savedUser: IUser = await newUser.save();
    return serviceReturn(true, 'User created successfully', savedUser);
  } catch (error) {
    return serviceReturn(false, 'User registration failed', null);
  }
};

// add a flag with response of service method
// {
//   success: boolean,
//   message?: string,
//   data?: any
// }