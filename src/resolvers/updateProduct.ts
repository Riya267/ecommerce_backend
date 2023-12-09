import logger from "../config/winston";
import prisma from "../prismaClient";

export const updateProduct = async (args, context) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: args.id,
      },
      data: args.productInfo,
    });

    if (!updatedProduct) {
      throw new Error(`Product with id ${args.id} not found`);
    }

    logger.info('Product updated successfully', { updatedProduct });

    return updatedProduct;
  } catch (error) {
    logger.error('Error updating product:', { error });
    throw error;
  }
};
