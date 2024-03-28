import { expect } from 'chai'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../src/resolvers/product'
import * as sinon from 'sinon'
import prismaClient from '../src/prismaClient'
import products from '../_mocks_/products.json'
import httpStatus from 'http-status'
import ApiError from '../src/utils/ApiError'

describe('Products', () => {
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

  describe('getProduct', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.products.findUnique = stub.resolves(products[0])
    })

    it('should return an object of product', async () => {
      const args = { id: '6573525c281667bf58d4d804' }
      const result = await getProduct(args)
      expect(result).to.be.an('object').that.is.not.empty
      expect(result).to.deep.equal(products[0])
      expect(result).to.include.all.keys(expectedProperties)
      expect(stub.calledOnceWithExactly({ where: { id: args.id } })).to.be.true
    })

    it('should throw an ApiError if an error occurs', async () => {
      const args = { id: 'incorrect_id' }
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await getProduct(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in getProduct query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('getAllProducts', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.products.findMany = stub.resolves(products)
    })

    it('should return an array of products along with expected properties', async () => {
      const args = { page: 1, limit: 2 }
      const result = await getAllProducts(args)
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
        await getAllProducts(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error in getAllProducts query')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('createProduct', () => {
    let stub = sinon.stub()
    beforeEach(() => {
      prismaClient.products.create = stub.resolves(products[0])
    })
    const args = {
      productInfo: {
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
        ...args.productInfo,
      }
      const createStub = stub.resolves(newProductData)

      const result = await createProduct(args)

      expect(result).to.deep.equal(newProductData)
      expect(createStub.calledOnceWithExactly({ data: args.productInfo })).to.be
        .true
    })

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error')
      stub.rejects(error)

      try {
        await createProduct(args)
        expect.fail('Expected an error to be thrown')
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError)
        expect(err.message).to.equal('Error creating product')
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR)
      }
    })
  })

  describe('updateProduct', () => {
    let stub = sinon.stub()

    const args = {
      id: 'dummy_id',
      productInfo: {
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
    };

    it('should update an existing product', async () => {
      const updatedProductData = {
        id: 'dummy_id',
        ...args.productInfo,
      };
      prismaClient.products.update = stub.resolves(updatedProductData);

      const result = await updateProduct(args);

      expect(result).to.deep.equal(updatedProductData);
      expect(stub.calledOnceWithExactly({ where: { id: args.id }, data: args.productInfo })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await updateProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error updating product`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await updateProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal('Error updating product');
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('deleteProduct', () => {
    let stub = sinon.stub()

    beforeEach(() => {
      prismaClient.products.delete = stub.resolves({})
    });

    const args = {
      id: '6573525c281667bf58d4d804',
    };

    it('should delete an existing product', async () => {
      const result = await deleteProduct(args);

      expect(result).to.be.true;
      expect(stub.calledOnceWithExactly({ where: { id: args.id } })).to.be.true;
    });

    it('should throw an ApiError if the response is null', async () => {
      stub.resolves(null);

      try {
        await deleteProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting product`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw an ApiError if an error occurs', async () => {
      const error = new Error('Database error');
      stub.rejects(error);

      try {
        await deleteProduct(args);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ApiError);
        expect(err.message).to.equal(`Error deleting product`);
        expect(err.statusCode).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
