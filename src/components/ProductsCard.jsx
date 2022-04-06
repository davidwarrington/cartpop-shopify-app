import { useCallback, useState } from "react";
import { Button, Card, DisplayText, Heading, Stack } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { ProductList } from "./ProductList";

export function ProductsCard({ products, setProducts }) {
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
    setProducts(selection);
    togglePickerHide();
  }, []);

  // Remove variant at specified indexes
  const handleVariantRemove = useCallback((productIndex, variantIndex) => {
    if (productIndex < 0 || variantIndex < 0) {
      return;
    }

    return setProducts((products) => {
      const cachedProducts = [...products];
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
        return [];
      }

      return cachedProducts;
    });
  }, []);

  // Change variant quantity
  const handleVariantQuantity = useCallback(
    (productIndex, variantIndex, newQuantity) => {
      if (productIndex < 0 || variantIndex < 0) {
        return;
      }

      return setProducts((products) => {
        const cachedProducts = [...products];

        // We need to make sure the indexes are valid
        if (
          !cachedProducts[productIndex] ||
          !cachedProducts[productIndex].variants ||
          !cachedProducts[productIndex].variants.length ||
          !cachedProducts[productIndex].variants[variantIndex]
        ) {
          return cachedProducts;
        }

        cachedProducts[productIndex].variants[variantIndex].quantity =
          newQuantity;
        return cachedProducts;
      });
    },
    []
  );

  const hasProducts = products && products.length;

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
              <DisplayText>
                <Heading element="h2">Products</Heading>
              </DisplayText>
              <Button removeUnderline onClick={togglePickerShow} plain>
                Edit products
              </Button>
            </Stack>
          </Card.Section>
        ) : null}
        <Card.Section>
          <ProductList
            products={products}
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
          products && products.length
            ? products.map((product) => {
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
