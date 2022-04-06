import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Layout,
  Page,
  PageActions,
  TextStyle,
  RadioButton,
  Heading,
  Stack,
  Link,
  Subheading,
  DisplayText,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";

import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { PAGE_STATES } from "../../constants";
import { NameCard } from "../../components/NameCard";
import { ProductsCard } from "../../components/ProductsCard";
import { CustomerCard } from "../../components/CustomerCard";
import { OrderCard } from "../../components/OrderCard";
import { CheckoutLinkCard } from "../../components/CheckoutLinkCard";
import { userLoggedInFetch } from "../../helpers";

const EditLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [toast, setToast] = useState(null);
  const [pageState, setPageState] = useState(
    id ? PAGE_STATES.loading : PAGE_STATES.not_found
  );
  const [link, setLink] = useState(null);
  const [linkActive, setActive] = useState(false);
  const [linkName, setName] = useState(null);
  const [linkAlias, setAlias] = useState(null);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  const [order, setOrder] = useState({});

  const pageTitle = linkName || (link && link._id) || "Edit link";

  async function getLinks() {
    if (pageState !== PAGE_STATES.loading) {
      setPageState(PAGE_STATES.loading);
    }

    try {
      const linkRes = await fetchFunction(`/api/links/${id}`).then((res) =>
        res.json()
      );

      if (!linkRes) {
        throw `Link not found`;
      }

      setLink(linkRes);
      setActive(linkRes.active);
      setName(linkRes.name);
      setAlias(linkRes.alias);
      setProducts(linkRes.products);
      setCustomer(linkRes.customer);
      setOrder(linkRes.order);
      setPageState(PAGE_STATES.idle);
    } catch (e) {
      console.warn(e);
      setPageState(PAGE_STATES.not_found);
    }
  }

  useEffect(() => {
    getLinks();
  }, [id]);

  const handleUpdate = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    let apiRes = null;
    try {
      // Edit link
      apiRes = await fetchFunction(`/api/links/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: linkName,
          active: linkActive,
          alias: linkAlias,
          products,
          customer,
          order,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    } catch (err) {
      console.warn(err);
    }

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
  }, [linkName, linkActive, linkAlias, products, customer, order]);

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

  const handleCopy = useCallback(async () => {
    setPageState(PAGE_STATES.submitting);

    // Send copy request to api
    const apiRes = await fetchFunction(`/api/links/${id}/copy`, {
      method: "PUT",
    }).then((res) => res.json());

    // Check if copy failed
    if (!apiRes || !apiRes.id) {
      setToast({
        show: true,
        content: "Failed to copy link. Please try again or contact support",
        error: true,
      });
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully copied",
    });

    // Redirect to link edit page
    const newLinkId = apiRes.id;
    navigate(`/links/${newLinkId}`);
  }, []);

  if (pageState === PAGE_STATES.not_found) {
    return (
      <Page narrowWidth>
        <Card sectioned title="Could not find specified link">
          <Button url="/">Go home</Button>
        </Card>
      </Page>
    );
  }

  if (!link || pageState === PAGE_STATES.loading) {
    return <SkeletonLinkPage />;
  }

  return (
    <Page
      breadcrumbs={[{ content: "Home", url: "/" }]}
      title={pageTitle}
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
                onAction: handleCopy,
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
      <TitleBar title={pageTitle} />
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <Layout>
        <Layout.Section>
          {link.isEnabled || link.analytics?.clicks ? (
            <Card title="Analytics" sectioned>
              <Stack vertical spacing="extraTight">
                <Subheading>
                  <TextStyle variation="subdued">Clicks</TextStyle>
                </Subheading>
                <DisplayText size="small">{link.analytics.clicks}</DisplayText>
              </Stack>
            </Card>
          ) : null}
          <NameCard id={link._id} name={linkName} setName={setName} />
          <ProductsCard products={products} setProducts={setProducts} />
          <CustomerCard customer={customer} setCustomer={setCustomer} />
          <OrderCard order={order} setOrder={setOrder} />
          <CheckoutLinkCard
            link={link}
            alias={linkAlias}
            setAlias={setAlias}
            products={products}
            customer={customer}
            order={order}
          />
        </Layout.Section>
        <Layout.Section secondary>
          <Card
            sectioned
            title={
              <Stack alignment="center">
                <Heading>Visibility</Heading>
                {linkActive ? (
                  <Badge status="success">Live</Badge>
                ) : (
                  <Badge>Disabled</Badge>
                )}
              </Stack>
            }
          >
            <RadioButton
              label="Enabled"
              helpText="Customers will be able to check out with this link."
              checked={linkActive}
              id="disabled"
              name="visibility"
              onChange={(newValue) => setActive(newValue)}
            />
            <RadioButton
              label="Disabled"
              helpText="Customers will not be able to check out with this link."
              id="optional"
              name="visibility"
              checked={!linkActive}
              onChange={(newValue) => setActive(newValue)}
            />
          </Card>
          <Stack vertical alignment="center">
            <Stack.Item />
            <Stack.Item>
              Learn more about{" "}
              <Link
                external
                url="https://help.shopify.com/en/manual/products/details/checkout-link"
              >
                checkout links
              </Link>
            </Stack.Item>
          </Stack>
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
