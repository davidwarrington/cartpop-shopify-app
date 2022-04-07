import { Redirect } from "@shopify/app-bridge/actions";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

export const getShop = () => {
  return new URL(location).searchParams.get("shop");
};

export const capitalize = (string) => {
  if (!string || string.length === 1) return string;

  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
};

export const getIdFromGid = (type, gid) => {
  if (!gid || !type) return gid;

  return gid.replace(`gid://shopify/${type}/`, "");
};

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
