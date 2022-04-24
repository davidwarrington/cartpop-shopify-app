import { Stack, TextContainer, TextStyle } from "@shopify/polaris";

//import ProductImagePlaceholder from "../assets/placeholder-product-image.png";
import { Product } from "./Product";

export function ProductList({ lineItems, lineProperty = true }) {
  // Return message when no product is selected
  if (!lineItems || !lineItems.fields || !lineItems.fields.length) {
    return (
      <Stack vertical>
        <TextContainer>
          <TextStyle variation="subdued">
            No products selected.{" "}
            <TextStyle variation="strong">
              At least one product is required.
            </TextStyle>
          </TextStyle>
        </TextContainer>
      </Stack>
    );
  }

  // Return product list
  return lineItems.fields.map((lineItem, lineIndex) => (
    <Product
      key={lineIndex}
      lineIndex={lineIndex}
      lineItem={lineItem}
      lineItems={lineItems}
      lineProperty={lineProperty}
    />
  ));
}
