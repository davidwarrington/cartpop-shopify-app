import { useEffect, useState } from "react";
import { Card, Button, Layout, Page, TextField } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { PAGE_STATES } from "../../constants";
import { NameCard } from "../../components/NameCard";
import { ProductsCard } from "../../components/ProductsCard";
import { CustomerCard } from "../../components/CustomerCard";
import { OrderCard } from "../../components/OrderCard";
import { CheckoutLinkCard } from "../../components/CheckoutLinkCard";

const EditLink = () => {
  const app = useAppBridge();
  const { id } = useParams();

  const [pageState, setPageState] = useState(
    id ? PAGE_STATES.loading : PAGE_STATES.not_found
  );
  const [link, setLink] = useState(null);

  async function getLinks() {
    if (pageState !== PAGE_STATES.loading) {
      setPageState(PAGE_STATES.loading);
    }

    const fetchFunction = authenticatedFetch(app);
    const apiRes = await fetchFunction(`/api/links/${id}`).then((res) =>
      res.json()
    );

    if (!apiRes) {
      setPageState(PAGE_STATES.not_found);
      return;
    }

    setLink(apiRes);
    setPageState(PAGE_STATES.idle);
  }

  useEffect(() => {
    getLinks();
  }, []);

  if (pageState === PAGE_STATES.loading) {
    return <SkeletonLinkPage />;
  }

  if (pageState === PAGE_STATES.not_found) {
    return (
      <Page narrowWidth>
        <Card sectioned title="Could not find specified link">
          <Button url="/">Go home</Button>
        </Card>
      </Page>
    );
  }

  return (
    <Page breadcrumbs={[{ content: "Home", url: "/" }]} title="Edit link">
      <TitleBar title="Edit link" />

      <Layout>
        <Layout.Section>
          <NameCard name={link.name} setName={null} />
          <ProductsCard products={link.products || []} setProducts={null} />
          <CustomerCard customer={link.customer || {}} setCustomer={null} />
          <OrderCard order={link.order || {}} setOrder={null} />
          <Card sectioned title="Customer url">
            <TextField
              labelHidden
              label="Checkout link"
              prefix="https://example.com/"
              value={link.alias || ""}
              //onChange
              connectedRight={
                <Button onClick={() => alert("TODO:")}>Copy</Button>
              }
            />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned title="Visibility">
            // TODO:
          </Card>
          <CheckoutLinkCard
            products={link.products || []}
            customer={link.customer || {}}
            order={link.order || {}}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default EditLink;
