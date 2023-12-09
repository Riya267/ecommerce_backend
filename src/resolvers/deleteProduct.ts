import logger from "../config/winston";
import prisma from "../prismaClient";

export const deleteProduct = async (args, context) => {
  try {
    const deletedProduct = await prisma.products.delete({
      where: {
        id: args.id,
      },
    });

    if (!deletedProduct) {
      throw new Error(`Product with id ${args.id} not found`);
    }

    logger.info('Product deleted successfully', { deletedProduct });

    return deletedProduct;
  } catch (error) {
    logger.error('Error deleting product:', { error });
    throw error;
  }
};