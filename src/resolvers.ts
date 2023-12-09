import { createProduct } from "./resolvers/createProduct";
import { deleteProduct } from "./resolvers/deleteProduct";
import { getAllProducts } from "./resolvers/getAllProducts";
import { getProduct } from "./resolvers/getProduct";
import { updateProduct } from "./resolvers/updateProduct";

export default {
    Query: {
      getProduct : async (_, args, { context }) => {
        const product = await getProduct(args, context);
        return product;
      },
      getAllProducts : async (_, args, { context }) => {
        const products = await getAllProducts(args, context);
        return products;
      },
    },
    Mutation: {
      createProduct : async (_, args, { context }) => {
        const product = await createProduct(args, context);
        return product;
      },
      updateProduct : async (_, args, { context }) => {
        const product = await updateProduct(args, context);
        return product;
      },
      deleteProduct : async (_, args, { context }) => {
        const product = await deleteProduct(args, context);
        return product;
      },
    }
}