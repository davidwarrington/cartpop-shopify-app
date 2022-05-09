import { parseGid } from "@shopify/admin-graphql-api-utilities";
import { ResourcePicker, TitleBar, Toast } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  Card,
  ChoiceList,
  FooterHelp,
  Frame,
  Link,
  List,
  Page,
  Stack,
  Tabs,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { useDynamicList, useField } from "@shopify/react-form";
import { useCallback, useEffect, useState } from "react";

import { useShop } from "../../core/ShopProvider";
import { ProductList } from "../../components/ProductList";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import { RequireSubscription } from "../../components/RequireSubscription";
import { LinkTabs } from "../../components/LinkTabs";

const pageTitle = "Dynamic links";

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
      <TitleBar title={pageTitle} />
      <Page
        title={pageTitle}
        subtitle="Generate checkout links on demand using any valid product."
      >
        <Stack vertical>
          <LinkTabs />
          <Card>
            <RequireSubscription title="Please upgrade to Pro to unlock dynamic links.">
              {/* <Tabs
                tabs={[
                  { id: "product", content: "Product" },
                  // { id:"customer", content: "Customer" },
                  // { id:"order", content: "Order" },
                ]}
                selected={selectedTab}
                onSelect={handleTabChange}
              /> */}
              <Card.Section>
                <LinkUrl url={url} toast={toast} setToast={setToast} />
              </Card.Section>
              <Card.Section flush>
                {selectedTab === 0 ? (
                  <ProductLink
                    url={url}
                    setUrl={setUrl}
                    shopDomain={shopDomain}
                  />
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
            </RequireSubscription>
          </Card>
        </Stack>
        {toast && toast.show ? (
          <Toast
            content={toast.content}
            onDismiss={() => setToast({})}
            error={toast.error}
          />
        ) : null}
      </Page>
      <FooterHelp>
        Learn more about{" "}
        <Link
          onClick={() => {
            if (Beacon) {
              Beacon("article", "626575876c886c75aabe9b5d", {
                type: "modal",
              });
            }
          }}
        >
          Dynamic Payment Links
        </Link>
        .
      </FooterHelp>
    </Frame>
  );
};

export default DynamicLink;

const ProductLink = ({ shopDomain, url, setUrl }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [advancedSettings, setSettings] = useState([]);

  const handleChoiceListChange = useCallback((value) => setSettings(value), []);

  const discount = useField(null);
  const email = useField(null);
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

      let generatedUrl = `https://${shopDomain.replace(
        "https://",
        ""
      )}/a/cart?products=${productString}`;
      if (discount && discount.value) {
        generatedUrl += `&discount=${discount.value}`;
      }
      if (email && email.value) {
        generatedUrl += `&email=${email.value}`;
      }
      if (advancedSettings.includes("payment")) {
        generatedUrl += `&payment=shop_pay`;
      }

      setUrl(generatedUrl);
    } else {
      setUrl(null);
    }
  }, [products, discount, email, advancedSettings]);

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
    <div>
      <Stack distribution="fillEvenly" spacing="none">
        <Stack.Item>
          <div
            style={{
              borderRight: "1px solid #e1e3e5",
            }}
          >
            <Card.Section>
              <ProductList lineItems={products} lineProperty={false} />
            </Card.Section>
            <Card.Section>
              <Button
                fullWidth={url ? true : false}
                onClick={togglePicker}
                primary={!products.fields || !products.fields.length}
              >
                {products.fields && products.fields.length
                  ? "Select another product"
                  : "Select a product"}
              </Button>
            </Card.Section>
            {url ? (
              <Card.Section title="Additional settings">
                <ChoiceList
                  allowMultiple
                  title="Additional settings"
                  titleHidden
                  choices={[
                    {
                      label: "Discount or Gift card code",
                      value: "discount",
                      renderChildren: (isSelected) =>
                        isSelected && <TextField type="text" {...discount} />,
                    },
                    {
                      label: "Customer email",
                      value: "email",
                      renderChildren: (isSelected) =>
                        isSelected && <TextField type="email" {...email} />,
                    },
                    {
                      label: "Redirect to Shop Pay",
                      value: "payment",
                    },
                  ]}
                  selected={advancedSettings}
                  onChange={handleChoiceListChange}
                />
              </Card.Section>
            ) : null}
          </div>
        </Stack.Item>
        {url ? (
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
    </div>
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
    <Card.Section subdued title="Generated QR Code">
      <QRCodeGenerator generatedUrl={url} />
    </Card.Section>
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
        <ButtonGroup spacing="extraTight">
          <Button primary onClick={handleCopyCheckoutLink} disabled={!url}>
            Copy link
          </Button>
        </ButtonGroup>
      }
    />
  );
};
