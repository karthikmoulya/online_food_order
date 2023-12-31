import express, { Application } from 'express';

import path from 'path';

import {
  AdminRoue,
  CustomerRoute,
  ShoppingRoute,
  VendorRoute,
} from '../routes';

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/admin', AdminRoue);
  app.use('/vendor', VendorRoute);
  app.use('/customer', CustomerRoute);
  app.use(ShoppingRoute);

  return app;
};
