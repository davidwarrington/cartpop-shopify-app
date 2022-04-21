import { useCallback, useState } from "react";
import { Button, Card, Heading, Stack } from "@shopify/polaris";
import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { ProductList } from "./ProductList";
import { userLoggedInFetch } from "../helpers";

export function ProductsCard({ products }) {
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [showPicker, setShowPicker] = useState(false);

  const togglePickerShow = useCallback(() => {
    setShowPicker(true);
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
            product: variant.product,
            handle: product.handle,
            status: product.status,
            vendor: product.vendor,
            title: product.title,
            ...variant,
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

      // TODO: make api call to fetch product payload
      // const productsRes = await fetchFunction(`/api/products`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     variants: []
      //   }),
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // });

      // TODO: prevent overwriting Quantity
      togglePickerHide();
    },
    [products]
  );

  const hasProducts = products && products.fields && products.fields.length;

  return (
    <>
      <Card
        title={!hasProducts ? "Products" : ""}
        primaryFooterAction={
          !hasProducts
            ? {
                content: "Add",
                onAction: togglePickerShow,
                accessibilityLabel: "Add a product",
              }
            : null
        }
      >
        {hasProducts ? (
          <Card.Section subdued>
            <Stack distribution="equalSpacing" alignment="center">
              <Heading element="h2">Products</Heading>
              <Button removeUnderline onClick={togglePickerShow} plain>
                Add product
              </Button>
            </Stack>
          </Card.Section>
        ) : null}
        <Card.Section>
          <ProductList lineItems={products} />
        </Card.Section>
      </Card>
      {/* Learn more: https://shopify.dev/apps/tools/app-bridge/react-components/resourcepicker */}
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
}
