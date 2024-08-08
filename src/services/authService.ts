import { Request, Response } from "express";
import { User, IUser } from "../models/userModel";
import { uploadToS3 } from "../services/s3Service";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

//Finds user and validates credentials, then sends a JWT token based on the user's ID
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user: IUser | null = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Method to add user
export const registerUser = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  let s3ProfilePictureUrl;

  if (req.file) {
    // Upload the file to S3 and get the URL
    s3ProfilePictureUrl = await uploadToS3(req.file);
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profilePictureUrl: s3ProfilePictureUrl ?? "../imgs/defaultPfp.jpg",
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  const savedUser: IUser = await newUser.save();
  res.status(201).json(savedUser);
};
