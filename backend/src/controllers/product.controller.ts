import { Request, Response } from 'express';
import Product from '../models/product.model';

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, type, tier, price, features, downloadLinks, version, releaseDate } = req.body;

    const product = new Product({
      name,
      description,
      type,
      tier,
      price,
      features,
      downloadLinks,
      version,
      releaseDate,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export { getProducts, createProduct };