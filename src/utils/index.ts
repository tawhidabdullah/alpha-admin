import getDeliveryChargeTotal from './getDeliveryChargeTotal';

const allRoles = [
  'getCatalogue',
  'postCatalogue',
  'getDelivery',
  'postDelivery',
  'getOrder',
  'postOrder',
  'getBlog',
  'postBlog',
  'getPage',
  'postPage',
  'analytics',
  'accounts',
  'getDealer',
  'postDealer',
];

const isAccess = (role, adminRoles) => {
  if (!adminRoles || !adminRoles[0]) return false;
  if (adminRoles.includes('superAdmin')) return true;
  return adminRoles.includes(role);
};

export { getDeliveryChargeTotal, isAccess };
