import { Request, Response, NextFunction } from 'express';
import { CreateFoodInputs, EditVendorInput, VendorLoginInput } from '../dtos';
import { FindVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';
import { Food } from '../models';

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const exisitingVendor = await FindVendor('', email);

  if (exisitingVendor !== null) {
    //Valiodation and give access

    const savedPasssword = <string>exisitingVendor.password;
    const savedSalt = <string>exisitingVendor.salt;
    const validation = await ValidatePassword(
      password,
      savedPasssword,
      savedSalt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: <string>exisitingVendor.id,
        email: <string>exisitingVendor.email,
        foodType: <[string]>exisitingVendor.foodType,
        name: <string>exisitingVendor.name,
      });
      return res.json(signature);
    } else {
      return res.json({ message: 'Password is not valid' });
    }
  }

  return res.json({ message: 'Login Credential not valid' });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const exisitingVendor = await FindVendor(user._id);
    return res.json(exisitingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, name, address, phone } = <EditVendorInput>req.body;

  const user = req.user;

  if (user) {
    const exisitingVendor = await FindVendor(user._id);
    if (exisitingVendor !== null) {
      exisitingVendor.name = name;
      exisitingVendor.address = address;
      exisitingVendor.phone = phone;
      exisitingVendor.foodType = foodType;

      const savedResult = await exisitingVendor.save();

      return res.json(savedResult);
    }
  }
  return res.json({ message: 'Vendor information not found' });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);
      const result = await vendor.save();
      return res.json(result);
    }
  }
  return res.json({
    message: 'Something went wrong while udating Cover Image',
  });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const exisitingVendor = await FindVendor(user._id);
    if (exisitingVendor !== null) {
      exisitingVendor.serviceAvailable = !exisitingVendor.serviceAvailable;

      const savedResult = await exisitingVendor.save();

      return res.json(savedResult);
    }
  }
  return res.json({ message: 'Vendor information not found' });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodInputs
  >req.body;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createdFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });
      vendor.foods.push(createdFood);
      const result = await vendor.save();
      return res.json(result);
    }
  }

  return res.json({ message: 'Something went wrong with add food' });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: 'Foods information not found' });
};
