import { useEffect, useState } from "react";
import { Card, Button, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";

const EditLink = () => {
  const app = useAppBridge();

  const linkId = 1; // TODO:

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getLinks() {
    if (!loading) {
      setLoading(true);
    }

    //const fetchFunction = authenticatedFetch(app);
    // const apiRes = await fetchFunction(`/api/links/${linkId}`)
    //     .then((res) => res.json());
    //console.log("apiRes", apiRes);

    //setLink(apiRes.link)

    setLoading(false);
  }

  useEffect(() => {
    getLinks();
  }, []);

  if (loading) {
    return <SkeletonLinkPage />;
  }

  if (!link) {
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
          <ProductsCard products={link.products} setProducts={null} />
          <CustomerCard customer={link.customer} setCustomer={null} />
          <OrderCard order={link.order} setOrder={null} />
        </Layout.Section>
        <Layout.Section secondary>
          <CheckoutLinkCard
            products={link.products}
            customer={link.customer}
            order={link.order}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default EditLink;
