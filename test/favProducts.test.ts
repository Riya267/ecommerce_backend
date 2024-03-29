import { expect } from 'chai'
import {
  createFavProduct,
  deleteFavProduct,
  getFavProducts
} from '../src/resolvers/favProducts'
import * as sinon from 'sinon'
import prismaClient from '../src/prismaClient'
import products from '../_mocks_/products.json'
import httpStatus from 'http-status'
import ApiError from '../src/utils/ApiError'

describe('Favourite Products', () => {
  const expectedProperties = [
    'id',
    'Gender',
    'Category',
    'SubCategory',
    'ProductType',
    'Colour',
    'Usage',
    'ProductTitle',
    'ImageURL',
    'UnitPrice',
  ]

  describe('getFavProducts', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.favouriteProducts.findMany = stub.resolves(products)
    })

    it('should return an array of Favourite Products along with expected properties', async () => {
      const args = { page: 1, limit: 2 }
      const result = await getFavProducts(args)
      expect(
        stub.calledOnceWithExactly({
          take: args.limit,
          skip: (args.page - 1) * args.limit,
        }),
      ).to.be.true
      expect(result).to.be.an('array').that.is.not.empty
      expect(result).to.have.lengthOf.at.most(2)
      expect(result).to.deep.equal(products)
      expect(result[0]).to.include.all.keys(expectedProperties)
    })

    it('should throw an ApiError if an error occurs', async () => {
      const args = { page: 0, limit: 0 }
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await getFavProducts(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in getFavProducts query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('createFavProduct', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.favouriteProducts.create = stub.resolves(products[0])
    })
    const args = {
      favProductInfo: {
        ProductId: 12346,
        Gender: 'Girls',
        Category: 'Apparel',
        SubCategory: 'Topwear',
        ProductType: 'Tops',
        Colour: 'Pink',
        Usage: 'Casual',
        ProductTitle: 'Dummy Girls Pink Top',
        ImageURL: 'http://example.com/image1.jpg',
        UnitPrice: 15,
      },
    }

    it('should create a new product', async () => {
      const newProductData = {
        id: '6573525c281667bf58d4d807',
        ...args.favProductInfo,
      }
      const createStub = stub.resolves(newProductData)

      const result = await createFavProduct(args)

      expect(result).to.deep.equal(newProductData)
      expect(createStub.calledOnceWithExactly({ data: args.favProductInfo })).to.be
        .true
    })

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await createFavProduct(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error creating createFavProduct')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('deleteFavProduct', () => {
    let stub = sinon.stub()

    beforeEach(() => {
      prismaClient.favouriteProducts.delete = stub.resolves({})
    });

    const args = {
      id: '6573525c281667bf58d4d804',
    };

    it('should delete an existing favourite product', async () => {
      const result = await deleteFavProduct(args);

      expect(result).to.be.true;
      expect(stub.calledOnceWithExactly({ where: { id: args.id } })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await deleteFavProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting deleteFavProduct`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await deleteFavProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting deleteFavProduct`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
