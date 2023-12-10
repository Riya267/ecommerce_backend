import logger from '../config/winston'
import prisma from '../prismaClient'

export const getFilters = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.filters.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all filters data:', { response })

    return response
  } catch (error) {
    logger.error('Error in getFilters query:', { error })
    throw error
  }
}

export const createFilters = async (args: {
  filterInfo: {
    Title: string
    Values: string
  }
}) => {
  try {
    const response = await prisma.filters.create({
      data: args.filterInfo,
    })

    logger.info('Retrieved all createFilters data:', { response })

    return response
  } catch (error) {
    logger.error('Error in createFilters query:', { error })
    throw error
  }
}

export const updatefilter = async (args: {
  id: string
  filterInfo: {
    Title: string
    Values: string
  }
}) => {
  try {
    const updatedfilter = await prisma.filters.update({
      where: {
        id: args.id,
      },
      data: args.filterInfo,
    })

    if (!updatedfilter) {
      throw new Error(`filter with id ${args.id} not found`)
    }

    logger.info('filter updated successfully', { updatedfilter })

    return updatedfilter
  } catch (error) {
    logger.error('Error updating filter:', { error })
    throw error
  }
}

export const deletefilter = async (args: { id: string }) => {
  try {
    const deletedfilter = await prisma.filters.delete({
      where: {
        id: args.id,
      },
    })

    if (!deletedfilter) {
      throw new Error(`filter with id ${args.id} not found`)
    }

    logger.info('filter deleted successfully', { deletedfilter })

    return true
  } catch (error) {
    logger.error('Error deleting filter:', { error })
    throw error
  }
}
