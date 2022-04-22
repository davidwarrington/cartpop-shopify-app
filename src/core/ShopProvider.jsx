import { useAppBridge } from "@shopify/app-bridge-react";
import { Page, Spinner } from "@shopify/polaris";
import { createContext, useEffect, useContext, useState } from "react";
import { userLoggedInFetch } from "../helpers";

const ShopContext = createContext({});

const ShopProvider = ({ shop, children }) => {
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [submitting, setSubmitting] = useState(true);
  const [shopData, setShopData] = useState({ shop });

  useEffect(async () => {
    setSubmitting(true);
    // Get current shop data from api
    const resData = await fetchFunction(`/api/shop`).then((res) => res.json());
    /*
        {
            settings,
            scopes,
            shop,
            primaryDomain,
            shopifyPlan,
            subscription,
        }
    */
    setSubmitting(false);
    setShopData(resData);
  }, []);

  if (submitting) {
    <Page>
      <Spinner />
    </Page>;
  }

  return (
    <ShopContext.Provider value={{ shopData, setShopData }}>
      {children}
    </ShopContext.Provider>
  );
};

const useShop = () => {
  const { shopData, setShopData } = useContext(ShopContext);

  return { shopData, setShopData };
};

export { ShopProvider, useShop };
