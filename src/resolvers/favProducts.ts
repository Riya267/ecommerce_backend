import logger from '../config/winston'
import prisma from '../prismaClient'
import ApiError from '../utils/ApiError'
import httpStatus from 'http-status'

export const getFavProducts = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.favouriteProducts.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all Favourite Products data:')

    return response
  } catch (error) {
    logger.error('Error in getFavProducts query:', { error })
    throw new ApiError(
      'Error in getFavProducts query',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const createFavProduct = async (args: {
  favProductInfo: ProductInfo
}) => {
  try {
    const newProduct = await prisma.favouriteProducts.create({
      data: args.favProductInfo,
    })

    logger.info('New product added in Favourite Products successfully')

    return newProduct
  } catch (error) {
    logger.error('Error creating createFavProduct:', { error })
    throw new ApiError(
      'Error creating createFavProduct',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const deleteFavProduct = async (args: { id: string }) => {
  try {
    const deletedProduct = await prisma.favouriteProducts.delete({
      where: {
        id: args.id,
      },
    })

    if (!deletedProduct) {
      throw new Error(`Product with id ${args.id} not found`)
    }

    logger.info('Favourite Product deleted successfully')

    return true
  } catch (error) {
    logger.error('Error deleting deleteFavProduct:', { error })
    throw new ApiError(
      'Error deleting deleteFavProduct',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}
