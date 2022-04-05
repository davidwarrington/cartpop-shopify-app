import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Button,
  Layout,
  Page,
  TextField,
  PageActions,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { PAGE_STATES } from "../../constants";
import { NameCard } from "../../components/NameCard";
import { ProductsCard } from "../../components/ProductsCard";
import { CustomerCard } from "../../components/CustomerCard";
import { OrderCard } from "../../components/OrderCard";
import { CheckoutLinkCard } from "../../components/CheckoutLinkCard";

const EditLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetchFunction = authenticatedFetch(app);

  const [toast, setToast] = useState(null);
  const [pageState, setPageState] = useState(
    id ? PAGE_STATES.loading : PAGE_STATES.not_found
  );
  const [link, setLink] = useState(null);

  async function getLinks() {
    if (pageState !== PAGE_STATES.loading) {
      setPageState(PAGE_STATES.loading);
    }

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

  const handleDelete = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    // Send delete request to api
    const apiRes = await fetchFunction(`/api/links/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    // Check if delete failed
    if (!apiRes) {
      setToast({
        show: true,
        content: "Failed to create link. Please try again or contact support",
        error: true,
      });
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully deleted",
    });

    // Redirect to home
    navigate(`/`);
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
      {toast && toast.show ? (
        <Toast content={toast.content} onDismiss={() => setToast({})} />
      ) : null}
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
        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                destructive: true,
                loading: pageState === PAGE_STATES.submitting,
                onAction: handleDelete,
              },
            ]}
          ></PageActions>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default EditLink;
