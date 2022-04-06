import { useCallback, useState } from "react";
import { Layout, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";

import { CheckoutLinkCard } from "../../components/CheckoutLinkCard";
import { ProductsCard } from "../../components/ProductsCard";
import { CustomerCard } from "../../components/CustomerCard";
import { OrderCard } from "../../components/OrderCard";
import { NameCard } from "../../components/NameCard";
import { PAGE_STATES } from "../../constants";
import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { userLoggedInFetch } from "../../helpers";

const NewLink = () => {
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [toast, setToast] = useState(null);
  const [pageState, setPageState] = useState(PAGE_STATES.idle);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  const [order, setOrder] = useState({});
  const [linkName, setName] = useState(null);

  const canSubmit = products && products.length;
  const pageTitle = linkName || "Create checkout link";

  const handleSubmit = useCallback(async () => {
    setPageState(PAGE_STATES.loading);

    const payload = {
      name: linkName,
      products,
      customer,
      order,
    };

    let apiRes = null;
    try {
      // Create link
      apiRes = await fetchFunction(`/api/links`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    } catch (err) {
      console.warn(err);
    }

    // Make sure successful API
    if (!apiRes || !apiRes.id) {
      setPageState(PAGE_STATES.idle);
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
      content: "Link successfully created!",
    });

    // Redirect to link edit page
    const newLinkId = apiRes.id;
    navigate(`/links/${newLinkId}`);
  }, [linkName, products, customer, order]);

  if (pageState === PAGE_STATES.loading) {
    return <SkeletonLinkPage />;
  }

  return (
    <Page
      title={pageTitle}
      breadcrumbs={[
        {
          content: "Home",
          url: "/",
          // TODO: warn about lost changes
        },
      ]}
      primaryAction={{
        content: "Create link",
        disabled: !canSubmit || pageState === PAGE_STATES.submitting,
        onAction: handleSubmit,
        loading: pageState === PAGE_STATES.loading,
      }}
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
          <NameCard name={linkName} setName={setName} />
          <ProductsCard products={products} setProducts={setProducts} />
          <CustomerCard customer={customer} setCustomer={setCustomer} />
          <OrderCard order={order} setOrder={setOrder} />
        </Layout.Section>
        <Layout.Section secondary>
          <CheckoutLinkCard
            products={products}
            customer={customer}
            order={order}
          />
        </Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  );
};

export default NewLink;
