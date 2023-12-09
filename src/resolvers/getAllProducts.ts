import logger from "../config/winston";
import prisma from "../prismaClient"

export const getAllProducts = async (args, context) => {
    try {
      const skip = (args.page - 1) * args.limit;
      const response = await prisma.products.findMany({
        take: args.limit,
        skip,
      });
  
      logger.info('Retrieved all product data:', { response });
  
      return response;
    } catch (error) {
      logger.error('Error in getAllProducts query:', { error });
      throw error;
    }
};