export const getShop = () => {
  return new URL(location).searchParams.get("shop");
};

export const getIdFromGid = (type, gid) => {
  if (!gid || !type) return gid;

  return gid.replace(`gid://shopify/${type}/`, "");
};
