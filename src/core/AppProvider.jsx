import { AppProvider as PolarisProvider } from "@shopify/polaris";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import { Outlet } from "react-router";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import GraphQLProvider from "./GraphQLProvider";
import Link from "./Link";
import RoutePropagator from "./RoutePropagator";
import { ShopProvider } from "./ShopProvider";

const AppProvider = () => {
  //const {search} = useLocation();

  return (
    <PolarisProvider i18n={polarisTranslations} linkComponent={Link}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <GraphQLProvider>
          <ShopProvider shop={new URL(location).searchParams.get("shop")}>
            <Outlet />
            <RoutePropagator />
          </ShopProvider>
        </GraphQLProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

export default AppProvider;
