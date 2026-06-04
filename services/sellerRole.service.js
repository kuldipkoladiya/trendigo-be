import { SellerRole } from '../models';

export async function createRole(body = {}) {
  const role = await SellerRole.create(body);
  return role;
}

export async function getRoleList(filter, options = {}) {
  const role = await SellerRole.find(filter, options.projection, options);
  return role;
}

export async function getOneRole(filter, options = {}) {
  return SellerRole.findOne(filter, options.projection, options);
}

export async function updateRole(filter, body, options = {}) {
  const role = await SellerRole.findOneAndUpdate(filter, body, options);
  return role;
}

export async function deleteRole(filter, options = {}) {
  const role = await SellerRole.findOneAndDelete(filter, options);
  return role;
}
