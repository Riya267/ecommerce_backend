import { expect } from 'chai'
import { createFilter, deleteFilter, getFilters, updateFilter } from '../src/resolvers/filter'
import * as sinon from 'sinon'
import prismaClient from '../src/prismaClient'
import filters from '../_mocks_/filter.json'
import httpStatus from 'http-status'
import ApiError from '../src/utils/ApiError'

describe('Filters', () => {
  const expectedProperties = [
    'id',
    'Title',
    'Values'
  ]

  describe('getFilters', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.filters.findMany = stub.resolves(filters)
    })

    it('should return an array of filters along with expected properties', async () => {
      const args = { page: 1, limit: 2 }
      const result = await getFilters(args)
      expect(
        stub.calledOnceWithExactly({
          take: args.limit,
          skip: (args.page - 1) * args.limit,
        }),
      ).to.be.true
      expect(result).to.be.an('array').that.is.not.empty
      expect(result).to.have.lengthOf.at.most(2)
      expect(result).to.deep.equal(filters)
      expect(result[0]).to.include.all.keys(expectedProperties)
    })

    it('should throw an ApiError if an error occurs', async () => {
      const args = { page: 0, limit: 0 }
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await getFilters(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in getFilters query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('createFilter', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.filters.create = stub.resolves(filters[0])
    })

    const args = {
      filterInfo: {
          Title: "Usage",
          Values: "Casual, Ethnic, Sports, Formal, Smart Casual, Party"
      }
    }

    it('should create a new product', async () => {
      const newProductData = {
        id: '6573525c281667bf58d4d807',
        ...args.filterInfo,
      }
      const createStub = stub.resolves(newProductData)

      const result = await createFilter(args)

      expect(result).to.deep.equal(newProductData)
      expect(createStub.calledOnceWithExactly({ data: args.filterInfo })).to.be
        .true
    })

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await createFilter(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in createFilters query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('updateFilter', () => {
    let stub = sinon.stub()

    const args = {
      id: '6573525c281667bf58d4d807',
      filterInfo: {
          Title: "Usage",
          Values: "Casual, Ethnic, Sports, Formal, Smart Casual, Party"
      }
    }

    it('should update an existing product', async () => {
      const updatedProductData = {
        id: '6573525c281667bf58d4d807',
        filterInfo: {
          Title: "Usage",
          Values: "Casual, Ethnic, Sports, Formal, Smart Casual, Party, Misc"
      },
      };
      prismaClient.filters.update = stub.resolves(updatedProductData);

      const result = await updateFilter(args);

      expect(result).to.deep.equal(updatedProductData);
      expect(stub.calledOnceWithExactly({ where: { id: args.id }, data: args.filterInfo })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await updateFilter(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error updating filter`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await updateFilter(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal('Error updating filter');
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('deleteFilter', () => {
    let stub = sinon.stub()

    beforeEach(() => {
      prismaClient.filters.delete = stub.resolves({})
    });

    const args = {
      id: '6573525c281667bf58d4d804',
    };

    it('should delete an existing product', async () => {
      const result = await deleteFilter(args);

      expect(result).to.be.true;
      expect(stub.calledOnceWithExactly({ where: { id: args.id } })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await deleteFilter(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting filter`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await deleteFilter(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting filter`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
