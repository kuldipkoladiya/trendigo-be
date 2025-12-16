import { ProductCategories } from 'models';

export async function getProductCategoriesById(id, options = {}) {
  const productCategories = await ProductCategories.findById(id, options.projection, options);
  return productCategories;
}

export async function getOne(query, options = {}) {
  const productCategories = await ProductCategories.findOne(query, options.projection, options);
  return productCategories;
}

export async function getProductCategoriesList(filter = {}) {
  return ProductCategories.find(filter).populate({
    path: 'parentCategoryId',
    select: 'value isSubCategory',
  });
}

export async function getProductCategoriesListWithPagination(filter, options = {}) {
  const productCategories = await ProductCategories.paginate(filter, options);
  return productCategories;
}

export async function createProductCategories(body = {}) {
  const productCategories = await ProductCategories.create(body);
  return productCategories;
}

export async function updateProductCategories(filter, body, options = {}) {
  const productCategories = await ProductCategories.findOneAndUpdate(filter, body, options);
  return productCategories;
}

export async function updateManyProductCategories(filter, body, options = {}) {
  const productCategories = await ProductCategories.updateMany(filter, body, options);
  return productCategories;
}

export async function removeProductCategories(filter) {
  const productCategories = await ProductCategories.findOneAndRemove(filter);
  return productCategories;
}

export async function removeManyProductCategories(filter) {
  const productCategories = await ProductCategories.deleteMany(filter);
  return productCategories;
}

export async function aggregateProductCategories(query) {
  const productCategories = await ProductCategories.aggregate(query);
  return productCategories;
}

// export async function aggregateProductCategoriesWithPagination(query, options = {}) {
//   const aggregate = ProductCategories.aggregate();
//   query.map((obj) => {
//     aggregate._pipeline.push(obj);
//   });
//   const productCategories = await ProductCategories.aggregatePaginate(aggregate, options);
//   return productCategories;
// }
