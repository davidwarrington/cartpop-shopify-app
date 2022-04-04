import { useEffect, useState } from "react";
import { Page, Layout, Link, Banner } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { CheckoutLinkCard } from "./CheckoutLinkCard";
import { ProductsCard } from "./ProductsCard";
import { CustomerCard } from "./CustomerCard";
import { OrderCard } from "./OrderCard";

export function HomePage() {
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
      <Layout>
        <Layout.Section>
          <ProductsCard products={products} setProducts={setProducts} />
          <CustomerCard customer={customer} setCustomer={setCustomer} />
          <OrderCard order={order} setOrder={setOrder} />
          <br />
          <Banner>
            Made in New York City by{" "}
            <Link url="https://www.checkoutpromotions.com" external>
              Checkout Promotions
            </Link>
            .
          </Banner>
        </Layout.Section>
        <Layout.Section secondary>
          <CheckoutLinkCard
            products={products}
            customer={customer}
            order={order}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
