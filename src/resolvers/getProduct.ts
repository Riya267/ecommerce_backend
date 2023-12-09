import logger from "../config/winston";
import prisma from "../prismaClient"

export const getProduct = async (args, context) => {
    try {
      const response = await prisma.products.findUnique({
        where: {
          id: args.id,
        },
      });
  
      logger.info('Retrieved product data:', { response });
  
      return response;
    } catch (error) {
      logger.error('Error in getProduct query:', { error });
      throw error;
    }
  };