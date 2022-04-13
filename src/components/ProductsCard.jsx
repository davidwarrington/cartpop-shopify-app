import { useCallback, useState } from "react";
import { Button, Card, Heading, Stack } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { ProductList } from "./ProductList";

export function ProductsCard({ products }) {
  const [showPicker, setShowPicker] = useState(false);

  const togglePickerShow = useCallback(() => {
    setShowPicker(true);
  }, []);

  const togglePickerHide = useCallback(() => {
    setShowPicker(false);
  }, []);

  // Set all selected products (overrides existing)
  const handleProductSelection = useCallback(({ selection }) => {
    // TODO: prevent overwriting Quantity
    products.onChange(selection);
    togglePickerHide();
  }, []);

  // Remove variant at specified indexes
  const handleVariantRemove = useCallback(
    (productIndex, variantIndex) => {
      if (productIndex < 0 || variantIndex < 0) {
        return;
      }

      const cachedProducts = [...products.value];
      cachedProducts[productIndex] &&
        cachedProducts[productIndex].variants[variantIndex] &&
        cachedProducts[productIndex].variants.splice(variantIndex, 1);

      if (
        !cachedProducts[productIndex].variants ||
        cachedProducts[productIndex].variants.length === 0
      ) {
        cachedProducts.splice(productIndex, 1);
      }

      if (!cachedProducts || !cachedProducts.length) {
        return products.onChange([]);
      }

      return products.onChange(cachedProducts);
    },
    [products]
  );

  // Change variant quantity
  const handleVariantQuantity = useCallback(
    (productIndex, variantIndex, newQuantity) => {
      if (productIndex < 0 || variantIndex < 0) {
        return;
      }

      const cachedProducts = [...products.value];

      // We need to make sure the indexes are valid
      if (
        !cachedProducts[productIndex] ||
        !cachedProducts[productIndex].variants ||
        !cachedProducts[productIndex].variants.length ||
        !cachedProducts[productIndex].variants[variantIndex]
      ) {
        return;
      }

      cachedProducts[productIndex].variants[variantIndex].quantity =
        newQuantity > 0 ? newQuantity : 1;

      return products.onChange(cachedProducts);
    },
    [products]
  );

  const hasProducts = products && products.value.length;

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
                Edit products
              </Button>
            </Stack>
          </Card.Section>
        ) : null}
        <Card.Section>
          <ProductList
            products={products.value}
            handleVariantRemove={handleVariantRemove}
            handleVariantQuantity={handleVariantQuantity}
          />
        </Card.Section>
      </Card>
      {/* Learn more: https://shopify.dev/apps/tools/app-bridge/react-components/resourcepicker */}
      <ResourcePicker
        open={showPicker}
        // We use Product since the ProductVariant resource picker has terrible UX
        resourceType="Product"
        // Populated with the current selection
        initialSelectionIds={
          products && products.value.length
            ? products.value.map((product) => {
                return {
                  id: product.id,
                  variants: product.variants,
                };
              })
            : []
        }
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
