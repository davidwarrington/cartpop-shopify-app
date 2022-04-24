import { parseGid } from "@shopify/admin-graphql-api-utilities";
import { ResourcePicker, TitleBar, Toast } from "@shopify/app-bridge-react";
import {
  Button,
  Card,
  FooterHelp,
  Frame,
  Heading,
  Link,
  List,
  Page,
  Stack,
  Tabs,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { useDynamicList } from "@shopify/react-form";
import { useCallback, useEffect, useState } from "react";
import { ProductList } from "../../components/ProductList";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import { useShop } from "../../core/ShopProvider";

const pageTitle = "Generate a dynamic payment link";

const DynamicLink = () => {
  const { shopData } = useShop();
  const shopDomain = shopData && (shopData.primaryDomain || shopData.shop);

  const [selectedTab, setTab] = useState(0);
  const [url, setUrl] = useState(null);
  const [toast, setToast] = useState(null);

  const handleTabChange = useCallback((tabIndex) => {
    setTab(tabIndex);
  }, []);

  return (
    <Frame>
      <TitleBar
        title={pageTitle}
        breadcrumbs={[{ content: "Dashboard", url: "/" }]}
      />
      <Page
        title={pageTitle}
        subtitle="Dynamic payment links accept any valid product."
        breadcrumbs={[{ content: "Dashboard", url: "/" }]}
      >
        <Card>
          <Tabs
            tabs={[
              { id: "product", content: "Product" },
              // { id:"customer", content: "Customer" },
              // { id:"order", content: "Order" },
            ]}
            selected={selectedTab}
            onSelect={handleTabChange}
          />
          <Card.Section>
            <LinkUrl url={url} toast={toast} setToast={setToast} />
          </Card.Section>
          <Card.Section flush>
            {selectedTab === 0 ? (
              <ProductLink url={url} setUrl={setUrl} shopDomain={shopDomain} />
            ) : null}
            {selectedTab === 1 ? <OrderLink /> : null}
            {selectedTab === 2 ? <CustomerLink /> : null}
          </Card.Section>
          <Card.Section subdued title="Supported url parameters">
            <List>
              <List.Item>
                <TextStyle variation="strong">products=</TextStyle>
                <TextStyle variation="subdued">
                  variantId:quantity:sellingPlanId
                </TextStyle>
              </List.Item>
              <List.Item>
                <TextStyle variation="strong">email=</TextStyle>
                <TextStyle variation="subdued">email@example.com</TextStyle>
              </List.Item>
              <List.Item>
                <TextStyle variation="strong">payment=</TextStyle>
                <TextStyle variation="subdued">shop_pay</TextStyle>
              </List.Item>
              <List.Item>
                <TextStyle variation="strong">discount=</TextStyle>
                <TextStyle variation="subdued">FREESHIP</TextStyle>
              </List.Item>
            </List>
          </Card.Section>
        </Card>
        {toast && toast.show ? (
          <Toast
            content={toast.content}
            onDismiss={() => setToast({})}
            error={toast.error}
          />
        ) : null}
      </Page>
      <FooterHelp>
        Learn more about <Link>Dynamic Payment Links</Link>.
      </FooterHelp>
    </Frame>
  );
};

export default DynamicLink;

const ProductLink = ({ shopDomain, url, setUrl }) => {
  const [showPicker, setShowPicker] = useState(false);

  const products = useDynamicList([], (value) => value);

  useEffect(() => {
    if (products && products.fields && products.fields.length) {
      const productString = products.value
        .map((product) => {
          let lineItem = `${parseGid(product.variantInfo.id)}:${
            product.link_quantity || 1
          }`;
          if (product.link_selling_plan_id) {
            lineItem += `:${parseGid(product.link_selling_plan_id)}`;
          }
          return lineItem;
        })
        .join(",");
      setUrl(
        `https://${shopDomain.replace(
          "https://",
          ""
        )}/a/cart?products=${productString}`
      );
    } else {
      setUrl(null);
    }
  }, [products]);

  const togglePicker = useCallback(() => {
    setShowPicker((currentValue) => !currentValue);
  }, []);

  const togglePickerHide = useCallback(() => {
    setShowPicker(false);
  }, []);

  // Set all selected products (overrides existing)
  const handleProductSelection = useCallback(
    ({ selection }) => {
      selection.map((product) =>
        product.variants.map((variant) => {
          const image = variant.image || (product.images && product.images[0]);

          const lineItem = {
            ...variant,
            product: {
              ...variant.product,
              title: product.title,
              handle: product.handle,
              status: product.status,
              vendor: product.vendor,
            },
            image,
          };

          products.addItem({
            variantInfo: lineItem,
            link_quantity: "1",
            link_line_properties: [],
            link_selling_plan_id: null,
          });
        })
      );

      togglePickerHide();
    },
    [products]
  );

  return (
    <>
      <Stack distribution="fillEvenly" spacing="none">
        <Stack.Item>
          <Card.Section>
            <ProductList lineItems={products} lineProperty={false} />
          </Card.Section>
          <Card.Section>
            <Button
              fullWidth
              onClick={togglePicker}
              primary={!products.fields || !products.fields.length}
            >
              {products.fields && products.fields.length
                ? "Select another product"
                : "Select a product"}
            </Button>
          </Card.Section>
        </Stack.Item>
        {products.fields && products.fields.length ? (
          <Stack.Item>
            <LinkOutput url={url} />
          </Stack.Item>
        ) : null}
      </Stack>
      <ResourcePicker
        open={showPicker}
        // We use Product since the ProductVariant resource picker has terrible UX
        resourceType="Product"
        // Populated with the current selection
        // initialSelectionIds={
        //   products && products.fields.length
        //     ? products.fields.map((lineItem) => {
        //         const productId = lineItem.variantInfo
        //           && lineItem.variantInfo.value
        //           && lineItem.variantInfo.value.product.id;
        //         const variantId = lineItem.variantInfo
        //           && lineItem.variantInfo.value
        //           && lineItem.variantInfo.value.id;

        //         return {
        //           id: productId,
        //           variants: [variantId],
        //         };
        //       })
        //     : []
        // }
        showDraft={false}
        showHidden={false}
        showArchived={false}
        allowMultiple={true}
        onCancel={togglePickerHide}
        onSelection={handleProductSelection}
      />
    </>
  );
};

const OrderLink = () => {
  return <>Order links are coming soon.</>;
};

const CustomerLink = () => {
  return <>Customer links are coming soon.</>;
};

const LinkOutput = ({ url }) => {
  return (
    <div
      style={{
        borderLeft: "1px solid #e1e3e5",
      }}
    >
      <Card.Section subdued title="Generated QR Code">
        <QRCodeGenerator generatedUrl={url} />
      </Card.Section>
    </div>
  );
};

const LinkUrl = ({ url, setToast }) => {
  const handleCopyCheckoutLink = useCallback(() => {
    const textarea = document.getElementById("generated-link");

    if (!textarea) {
      setToast({
        show: true,
        content: "Failed to copy link. Please try again",
        error: true,
      });
      return;
    }

    // Select the text link contents and copy to clipboard
    textarea.select();
    document.execCommand("copy");

    // Show success message
    setToast({
      show: true,
      content: "Copied to clipboard",
    });
  }, []);

  return (
    <TextField
      id="generated-link"
      label="Generated payment link"
      labelHidden
      value={url}
      disabled={!url}
      selectTextOnFocus
      connectedRight={
        <Button primary onClick={handleCopyCheckoutLink} disabled={!url}>
          Copy link
        </Button>
      }
    />
  );
};
