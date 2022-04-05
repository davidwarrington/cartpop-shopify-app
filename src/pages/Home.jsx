import { useEffect, useState } from "react";
import { Banner, Button, Layout, Link, Page } from "@shopify/polaris";
import { useAppBridge, TitleBar } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { CheckoutLinkCard } from "../components/CheckoutLinkCard";
import { ProductsCard } from "../components/ProductsCard";
import { CustomerCard } from "../components/CustomerCard";
import { OrderCard } from "../components/OrderCard";

const Home = () => {
  const app = useAppBridge();

  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  const [order, setOrder] = useState({});

  async function getLinks() {
    const fetchFunction = authenticatedFetch(app);
    const apiRes = await fetchFunction("/api/links").then((res) => res.json());
    console.log("apiRes", apiRes);
  }

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <Page>
      {/* Empty TitleBar to reset when navigating from other pages like Settings */}
      <TitleBar />
      <Layout>
        <Layout.Section fullWidth>
          Links here...
          <br />
          <Banner>
            Made in New York City by{" "}
            <Link url="https://www.checkoutpromotions.com" external>
              Checkout Promotions
            </Link>
            .
          </Banner>
        </Layout.Section>
        <Layout.Section fullWidth>
          <Button url="/links/new">New link</Button>
          <Button url="/links/123">123 Link</Button>
          <Button url="/settings">Settings</Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
