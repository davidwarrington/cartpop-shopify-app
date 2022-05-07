import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  FormLayout,
  Heading,
  Stack,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { asChoiceField } from "@shopify/react-form";
import { ProductList } from "./ProductList";

export function ProductsCard({ products, settings }) {
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
        {settings && settings.destination.value === "landing_page" ? (
          <Card.Section title="Landing page settings">
            <FormLayout>
              <Checkbox
                label="Customer can edit product variant"
                {...asChoiceField(settings.canEditVariant)}
              />
              <Checkbox
                label="Customer can edit quantity"
                {...asChoiceField(settings.canEditQuantity)}
              />
            </FormLayout>
          </Card.Section>
        ) : null}
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
