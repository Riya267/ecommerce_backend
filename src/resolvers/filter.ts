import logger from '../config/winston'
import prisma from '../prismaClient'
import ApiError from '../utils/ApiError'
import httpStatus from 'http-status'

export const getFilters = async (args: { page: number; limit: number }) => {
  try {
    const skip = (args.page - 1) * args.limit
    const response = await prisma.filters.findMany({
      take: args.limit,
      skip,
    })

    logger.info('Retrieved all filters data:')

    return response
  } catch (error) {
    logger.error('Error in getFilters query:', { error })
    throw new ApiError(
      'Error in getFilters query',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const createFilter = async (args: {
  filterInfo: {
    Title: string
    Values: string
  }
}) => {
  try {
    const response = await prisma.filters.create({
      data: args.filterInfo,
    })

    logger.info('Retrieved all createFilters data')

    return response
  } catch (error) {
    logger.error('Error in createFilters query:', { error })
    throw new ApiError(
      'Error in createFilters query',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const updateFilter = async (args: {
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

    logger.info('filter updated successfully')

    return updatedfilter
  } catch (error) {
    logger.error('Error updating filter:', { error })
    throw new ApiError(
      'Error updating filter',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}

export const deleteFilter = async (args: { id: string }) => {
  try {
    const deletedfilter = await prisma.filters.delete({
      where: {
        id: args.id,
      },
    })

    if (!deletedfilter) {
      throw new Error(`filter with id ${args.id} not found`)
    }

    logger.info('filter deleted successfully')

    return true
  } catch (error) {
    logger.error('Error deleting filter:', { error })
    throw new ApiError(
      'Error deleting filter',
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  }
}
