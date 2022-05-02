import { createContext, useContext } from "react";

const ShopContext = createContext({});

const ShopProvider = ({ shop, children }) => {
  const shopData = shop;

  return (
    <ShopContext.Provider value={shopData}>{children}</ShopContext.Provider>
  );
};

const useShop = () => {
  const shopData = useContext(ShopContext);

  return shopData;
};

export { ShopProvider, useShop };
