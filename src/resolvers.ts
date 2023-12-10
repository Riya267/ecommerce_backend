import {createProduct, deleteProduct, getAllProducts, getProduct, updateProduct} from './resolvers/product';
import {getCategories, createCategory, updateCategory, deleteCategory} from './resolvers/category';
import {getFilters, createFilters, updatefilter, deletefilter} from './resolvers/filter';

export default {
    Query: {
      getProduct : async (_, args, ) => {
        const product = await getProduct(args);
        return product;
      },
      getAllProducts : async (_, args, ) => {
        const products = await getAllProducts(args);
        return products;
      },
      getCategories : async (_, args, ) => {
        const categories= await getCategories(args);
        return categories;
      },
      getFilters : async (_, args, ) => {
        const filters = await getFilters(args);
        return filters;
      },
    },
    Mutation: {
      createProduct : async (_, args, ) => {
        const product = await createProduct(args);
        return product;
      },
      updateProduct : async (_, args, ) => {
        const product = await updateProduct(args);
        return product;
      },
      deleteProduct : async (_, args, ) => {
        const product = await deleteProduct(args);
        return product;
      },
      createCategory : async (_, args, ) => {
        const category = await createCategory(args);
        return category;
      },
      updateCategory : async (_, args, ) => {
        const category = await updateCategory(args);
        return category;
      },
      deleteCategory : async (_, args, ) => {
        const category = await deleteCategory(args);
        return category;
      },
      createFilters : async (_, args, ) => {
        const filter = await createFilters(args);
        return filter;
      },
      updatefilter : async (_, args, ) => {
        const filter = await updatefilter(args);
        return filter;
      },
      deletefilter : async (_, args, ) => {
        const filter = await deletefilter(args);
        return filter;
      },
    }
}