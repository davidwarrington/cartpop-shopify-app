import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  Layout,
  Link,
  Page,
  TextField,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";
import { CheckoutLinkCard } from "../../components/CheckoutLinkCard";
import { ProductsCard } from "../../components/ProductsCard";
import { CustomerCard } from "../../components/CustomerCard";
import { OrderCard } from "../../components/OrderCard";
import { NameCard } from "../../components/NameCard";

const NewLink = () => {
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});
  const [order, setOrder] = useState({});
  const [linkName, setName] = useState(null);

  const canSubmit = linkName && products && products.length;
  const pageTitle = linkName || "New link";

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
        content: "Save",
        disabled: !canSubmit,
      }}
    >
      <TitleBar title={pageTitle} />
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
      </Layout>
    </Page>
  );
};

export default NewLink;
