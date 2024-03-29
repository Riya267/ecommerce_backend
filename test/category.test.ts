import { expect } from 'chai'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../src/resolvers/category'
import * as sinon from 'sinon'
import prismaClient from '../src/prismaClient'
import Categories from '../_mocks_/category.json'
import httpStatus from 'http-status'
import ApiError from '../src/utils/ApiError'

describe('Categories', () => {
  const expectedProperties = [
    'id',
    'Category'
  ]

  describe('getCategories', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.categories.findMany = stub.resolves(Categories)
    })

    it('should return an array of Categories along with expected properties', async () => {
      const args = { page: 1, limit: 2 }
      const result = await getCategories(args)
      expect(
        stub.calledOnceWithExactly({
          take: args.limit,
          skip: (args.page - 1) * args.limit,
        }),
      ).to.be.true
      expect(result).to.be.an('array').that.is.not.empty
      expect(result).to.have.lengthOf.at.most(2)
      expect(result).to.deep.equal(Categories)
      expect(result[0]).to.include.all.keys(expectedProperties)
    })

    it('should throw an ApiError if an error occurs', async () => {
      const args = { page: 0, limit: 0 }
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await getCategories(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in getCategories query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('createCategory', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.categories.create = stub.resolves(Categories[0])
    })

    const args = {
      categoryInfo: {
          Category: "Bottomwear"
      }
    }

    it('should create a new product', async () => {
      const newProductData = {
        id: '6573525c281667bf58d4d807',
        ...args.categoryInfo,
      }
      const createStub = stub.resolves(newProductData)

      const result = await createCategory(args)

      expect(result).to.deep.equal(newProductData)
      expect(createStub.calledOnceWithExactly({ data: args.categoryInfo })).to.be
        .true
    })

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await createCategory(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in createCategory query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('updateCategory', () => {
    let stub = sinon.stub()

    const args = {
      id: '6573525c281667bf58d4d807',
      CategoryInfo: {
          Category: "Bottomwear"
      }
    }

    it('should update an existing product', async () => {
      const updatedProductData = {
        id: '6573525c281667bf58d4d807',
        categoryInfo: {
          Category: "Socks"
        }
      };
      prismaClient.categories.update = stub.resolves(updatedProductData);

      const result = await updateCategory(args);

      expect(result).to.deep.equal(updatedProductData);
      expect(stub.calledOnceWithExactly({ where: { id: args.id }, data: args.CategoryInfo })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await updateCategory(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error updating Category`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await updateCategory(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal('Error updating Category');
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('deleteCategory', () => {
    let stub = sinon.stub()

    beforeEach(() => {
      prismaClient.categories.delete = stub.resolves({})
    });

    const args = {
      id: '6573525c281667bf58d4d804',
    };

    it('should delete an existing product', async () => {
      const result = await deleteCategory(args);

      expect(result).to.be.true;
      expect(stub.calledOnceWithExactly({ where: { id: args.id } })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await deleteCategory(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting Category`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await deleteCategory(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting Category`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
