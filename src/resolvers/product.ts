import ApiError from '../utils/ApiError'
import logger from '../config/winston'
import prisma from '../prismaClient'
import httpStatus from 'http-status'

export const getProduct = async (args: { id: string }) => {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: args.id,
      },
    })

    logger.info('Retrieved product data')

    return response
  } catch (error) {
    logger.error('Error in getProduct query:', { error })
    throw new ApiError(
      'Error in getProduct query',
      error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[
        error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR
      ],
    )
  }
}

export const getAllProducts = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.products.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all product data:')

    return response
  } catch (error) {
    logger.error('Error in getAllProducts query:', { error })
    throw new ApiError(
      'Error in getAllProducts query',
      error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[
        error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR
      ],
    )
  }
}

export const createProduct = async (args: { productInfo: ProductInfo }) => {
  try {
    const newProduct = await prisma.products.create({
      data: args.productInfo,
    })

    logger.info('New product created successfully')

    return newProduct
  } catch (error) {
    logger.error('Error creating product:', { error })
    throw new ApiError(
      'Error creating product',
      error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[
        error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR
      ],
    )
  }
}

export const updateProduct = async (args: {
  id: string
  productInfo: ProductInfo
}) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: args.id,
      },
      data: args.productInfo,
    })

    if (!updatedProduct) {
      throw new Error(`Product with id ${args.id} not found`)
    }

    logger.info('Product updated successfully')

    return updatedProduct
  } catch (error) {
    logger.error('Error updating product:', { error })
    throw new ApiError(
      'Error updating product',
      error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[
        error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR
      ],
    )
  }
}

export const deleteProduct = async (args: { id: string }) => {
  try {
    const deletedProduct = await prisma.products.delete({
      where: {
        id: args.id,
      },
    })

    if (!deletedProduct) {
      throw new Error(`Product with id ${args.id} not found`)
    }

    logger.info('Product deleted successfully')

    return true
  } catch (error) {
    logger.error('Error deleting product:', { error })
    throw new ApiError(
      `Error deleting product`,
      error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[
        error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR
      ],
    )
  }
}
