import logger from '../config/winston'
import prisma from '../prismaClient'

export const getCategories = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.categories.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all getCategories data:', { response })

    return response
  } catch (error) {
    logger.error('Error in getCategories query:', { error })
    throw error
  }
}

export const createCategory = async (args: {
  categoryInfo: { Category: string }
}) => {
  try {
    const response = await prisma.categories.create({
      data: args.categoryInfo,
    })

    logger.info('Retrieved all createCategory data:', { response })

    return response
  } catch (error) {
    logger.error('Error in createCategory query:', { error })
    throw error
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

    logger.info('Category updated successfully', { updatedCategory })

    return updatedCategory
  } catch (error) {
    logger.error('Error updating Category:', { error })
    throw error
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

    logger.info('Category deleted successfully', { deletedCategory })

    return true
  } catch (error) {
    logger.error('Error deleting Category:', { error })
    throw error
  }
}
