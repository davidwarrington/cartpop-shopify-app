import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Layout,
  Page,
  TextField,
  PageActions,
  TextStyle,
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

  const handleUpdate = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    const apiRes = await fetchFunction(`/api/links/${id}`, {
      method: "PUT",
      payload: {
        // TODO:
      },
    }).then((res) => res.json());

    // Check if update failed
    if (apiRes !== true) {
      setToast({
        show: true,
        content: "Failed to update link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully updated",
    });

    setPageState(PAGE_STATES.idle);
  }, []);

  const handleDelete = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    // Send delete request to api
    const apiRes = await fetchFunction(`/api/links/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    // Check if delete failed
    if (apiRes !== true) {
      setToast({
        show: true,
        content: "Failed to create link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
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
    <Page
      breadcrumbs={[{ content: "Home", url: "/" }]}
      title="Edit link"
      subtitle={
        <TextStyle variation="subdued">
          Last updated on{" "}
          {new Date(link.updatedAt || link.createdAt).toLocaleString()}
        </TextStyle>
      }
      primaryAction={{
        content: "Save",
        disabled: pageState === PAGE_STATES.submitting,
        loading: pageState === PAGE_STATES.submitting,
        onAction: handleUpdate,
      }}
      secondaryActions={
        pageState !== PAGE_STATES.submitting
          ? [
              {
                content: "Duplicate",
                onAction: () => alert("TODO:"),
                disabled: false, // TODO:
              },
              {
                content: "Preview",
                onAction: () => alert("TODO:"),
              },
            ]
          : []
      }
    >
      <TitleBar title="Edit link" />
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <Layout>
        {link.isEnabled || link.analytics?.views ? (
          <Layout.Section fullWidth>
            <Card title="Analytics" sectioned>
              // TODO: add analytics card
            </Card>
          </Layout.Section>
        ) : null}
        <Layout.Section>
          <NameCard name={link.name} setName={null} />
          <ProductsCard products={link.products || []} setProducts={null} />
          <CustomerCard customer={link.customer || {}} setCustomer={null} />
          <OrderCard order={link.order || {}} setOrder={null} />
          <Card sectioned title="Customer url">
            <TextField
              labelHidden
              label="Customer checkout link"
              // TODO: replace example with primary domain
              // TODO: how do we get the correct proxy route since merchants can change this?
              prefix="https://example.com/a/cart/"
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
