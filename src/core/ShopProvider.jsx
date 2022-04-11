import { useAppBridge } from "@shopify/app-bridge-react";
import { createContext, useEffect, useContext, useState } from "react";
import { userLoggedInFetch } from "../helpers";

const ShopContext = createContext({});

const ShopProvider = ({ shop, children }) => {
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [shopData, setShopData] = useState({ shop });

  useEffect(async () => {
    // Get current shop data from api
    const resData = await fetchFunction(`/api/shop`).then((res) => res.json());
    /*
            {
                shop,
                shopifyPlan,
                subscription,
                storefrontAccessToken
            }
        */
    setShopData(resData);
  }, []);

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
