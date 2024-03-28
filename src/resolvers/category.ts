import logger from '../config/winston'
import prisma from '../prismaClient'
import ApiError from '../utils/ApiError'
import httpStatus from 'http-status'

export const getCategories = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.categories.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all getCategories data')

    return response
  } catch (error) {
    logger.error('Error in getCategories query:', { error })
    throw new ApiError(
      'Error in getCategories query',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const createCategory = async (args: {
  categoryInfo: { Category: string }
}) => {
  try {
    const response = await prisma.categories.create({
      data: args.categoryInfo,
    })

    logger.info('Retrieved all createCategory data')

    return response
  } catch (error) {
    logger.error('Error in createCategory query:', { error })
    throw new ApiError(
      'Error in createCategory query',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const updateCategory = async (args: {
  id: string
  CategoryInfo: { Category: string }
}) => {
  try {
    const updatedCategory = await prisma.categories.update({
      where: {
        id: args.id,
      },
      data: args.CategoryInfo,
    })

    if (!updatedCategory) {
      throw new Error(`Category with id ${args.id} not found`)
    }

    logger.info('Category updated successfully')

    return updatedCategory
  } catch (error) {
    logger.error('Error updating Category:', { error })
    throw new ApiError(
      'Error updating Category',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const deleteCategory = async (args: { id: string }) => {
  try {
    const deletedCategory = await prisma.categories.delete({
      where: {
        id: args.id,
      },
    })

    if (!deletedCategory) {
      throw new Error(`Category with id ${args.id} not found`)
    }

    logger.info('Category deleted successfully')

    return true
  } catch (error) {
    logger.error('Error deleting Category:', { error })
    throw new ApiError(
      'Error deleting Category',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}
