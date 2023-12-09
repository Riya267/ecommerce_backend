import logger from "../config/winston";
import prisma from "../prismaClient";

export const createProduct = async (args, context) => {
  try {
    const newProduct = await prisma.products.create({
      data: args.productInfo,
    });
    
    logger.info('New product created successfully', { newProduct });
    
    return newProduct;
  } catch (error) {
    logger.error('Error creating product:', { error });
      throw error;
  }
};
