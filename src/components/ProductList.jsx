import {
  Button,
  Card,
  Checkbox,
  Link,
  Select,
  Stack,
  Subheading,
  TextContainer,
  TextField,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteMinor, MobilePlusMajor } from "@shopify/polaris-icons";
import { useCallback } from "react";
import { useShop } from "../core/ShopProvider";
import { getIdFromGid } from "../helpers";

import ProductImagePlaceholder from "../assets/placeholder-product-image.png";

export function ProductList({ lineItems }) {
  const { shopData } = useShop();
  const shopDomain = shopData && shopData.shop;

  // Add empty product attribute
  const handleAttributeAdd = useCallback(
    (lineIndex) => {
      if (
        !lineItems.fields[lineIndex] ||
        !lineItems.fields[lineIndex].link_attributes
      ) {
        return;
      }

      if (!lineItems.fields[lineIndex].link_attributes) {
        lineItems.fields[lineIndex].link_attributes.onChange([
          { label: "", value: "" },
        ]);
      } else {
        lineItems.fields[lineIndex].link_attributes.onChange([
          ...lineItems.fields[lineIndex].link_attributes.value,
          { label: "", value: "" },
        ]);
      }
    },
    [lineItems]
  );

  // Remove product attribute
  const handleAttributeRemove = useCallback(
    (lineIndex, attributeIndex) => {
      const cachedAttributes =
        lineItems.fields[lineIndex].link_attributes.value;
      cachedAttributes.splice(attributeIndex, 1);

      lineItems.fields[lineIndex].link_attributes.onChange([
        ...cachedAttributes,
      ]);
    },
    [lineItems]
  );

  // Change value of product attribute
  const handleAttributeChange = useCallback(
    (lineIndex, attributeIndex, property, value) => {
      if (
        !property ||
        !lineItems.fields[lineIndex] ||
        !lineItems.fields[lineIndex].link_attributes ||
        !lineItems.fields[lineIndex].link_attributes.value[attributeIndex]
      ) {
        return;
      }

      const cachedAttributes =
        lineItems.fields[lineIndex].link_attributes.value;
      cachedAttributes[attributeIndex][property] = value;

      lineItems.fields[lineIndex].link_attributes.onChange([
        ...cachedAttributes,
      ]);
    },
    [lineItems]
  );

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
  return lineItems.fields.map((lineItem, lineIndex) => {
    const variant = lineItem.variantInfo.value;
    const image = variant.image && variant.image.originalSrc;

    return (
      <Card.Subsection key={variant.id}>
        <Stack wrap={false}>
          {image ? (
            <Thumbnail size="large" source={image} />
          ) : (
            <Thumbnail
              size="large"
              source={() => (
                <svg viewBox="0 0 20 20">
                  <path d="M2.5 1a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-15a1.5 1.5 0 0 0-1.5-1.5h-15zm5 3.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8.999 12.5h-13.002c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01l1.63 1.851 3.06-4.781a.5.5 0 0 1 .84.02l4.039 7.011c.18.34-.06.75-.44.75z"></path>
                </svg>
              )}
            />
          )}
          <Stack.Item fill>
            <Stack vertical spacing="">
              <Stack wrap={false}>
                <Stack.Item fill>
                  <Card.Subsection>
                    <Stack vertical>
                      <Stack vertical spacing="extraTight">
                        <TextStyle variation="strong">
                          {variant.product ? (
                            <Link
                              monochrome
                              url={`https://${shopDomain.replace(
                                "https://",
                                ""
                              )}/admin/products/${getIdFromGid(
                                "Product",
                                variant.product.id
                              )}/variants/${getIdFromGid(
                                "ProductVariant",
                                variant.id
                              )}`}
                              external
                            >
                              {variant.title}
                            </Link>
                          ) : null}
                        </TextStyle>
                        <Subheading>
                          <TextStyle variation="subdued">
                            {variant.title}
                          </TextStyle>
                        </Subheading>
                      </Stack>
                      {/* <Stack vertical spacing="none">
                        <Checkbox label="Add subscription" checked={false} />
                        <Select label="Subscription" labelInline options={[{ label: "Weekly"}]} />
                      </Stack> */}
                    </Stack>
                  </Card.Subsection>
                  {lineItem.link_attributes &&
                  lineItem.link_attributes.value.length ? (
                    <Card.Subsection>
                      <div style={{ maxWidth: "80%" }}>
                        <Stack vertical spacing="tight">
                          {lineItem.link_attributes.value.map(
                            (attribute, attributeIndex) => {
                              return (
                                <Stack
                                  alignment="trailing"
                                  wrap={false}
                                  spacing="extraTight"
                                >
                                  <Stack.Item fill>
                                    <TextField
                                      label="Label"
                                      labelHidden={attributeIndex > 0}
                                      value={attribute.label}
                                      onChange={(value) =>
                                        handleAttributeChange(
                                          lineIndex,
                                          attributeIndex,
                                          "label",
                                          value
                                        )
                                      }
                                      autoComplete="off"
                                    />
                                  </Stack.Item>
                                  <Stack.Item fill>
                                    <TextField
                                      label="Value"
                                      labelHidden={attributeIndex > 0}
                                      value={attribute.value}
                                      onChange={(value) =>
                                        handleAttributeChange(
                                          lineIndex,
                                          attributeIndex,
                                          "value",
                                          value
                                        )
                                      }
                                      autoComplete="off"
                                    />
                                  </Stack.Item>
                                  <Button
                                    onClick={() =>
                                      handleAttributeRemove(
                                        lineIndex,
                                        attributeIndex
                                      )
                                    }
                                    accessibilityLabel="Remove attribute"
                                    icon={DeleteMinor}
                                  />
                                </Stack>
                              );
                            }
                          )}
                        </Stack>
                      </div>
                    </Card.Subsection>
                  ) : null}
                </Stack.Item>
                <div style={{ maxWidth: "5.5rem" }}>
                  <TextField
                    label="Quantity"
                    type="number"
                    labelHidden
                    min={1}
                    value={lineItem.link_quantity.value || "1"}
                    onChange={lineItem.link_quantity.onChange}
                    autoComplete="off"
                  />
                </div>
              </Stack>

              <Stack distribution="equalSpacing">
                <Button
                  outline
                  icon={MobilePlusMajor}
                  onClick={() => handleAttributeAdd(lineIndex)}
                  disabled
                >
                  Add line property
                </Button>
                <Button
                  onClick={() => lineItems.removeItem(lineIndex)}
                  accessibilityLabel="Remove product"
                  destructive
                  outline
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          </Stack.Item>
        </Stack>
      </Card.Subsection>
    );
  });
}
