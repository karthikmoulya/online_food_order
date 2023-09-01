import isExpression, { Request, Response, NextFunction } from 'express';
import { createVendorInput } from '../dtos';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <createVendorInput>req.body;

  const existingVendor = await FindVendor('', email);

  if (existingVendor !== null) {
    return res.json({ message: 'A Vendor is exist with this email ID' });
  }

  //genearte a salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  //excrypt the password using the salt

  const createVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createVendor);
};

export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: 'vendors data not available' });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorID = req.params.id;

  const vendor = await await FindVendor(vendorID);

  if (vendor !== null) {
    return res.json(vendor);
  }

  return res.json({ message: 'vendors data not available' });
};
