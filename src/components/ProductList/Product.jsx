import { useCallback, useEffect } from "react";
import {
  Button,
  Caption,
  Card,
  Label,
  Link,
  Select,
  Spinner,
  Stack,
  Subheading,
  TextField,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteMinor, MobilePlusMajor } from "@shopify/polaris-icons";

import { useShop } from "../../core/ShopProvider";
import { getIdFromGid } from "../../helpers";
import { gql, useQuery } from "@apollo/client";
import {
  composeGid,
  nodesFromEdges,
  parseGid,
} from "@shopify/admin-graphql-api-utilities";

const GET_PRODUCT = gql`
  query ($variantId: ID!) {
    productVariant(id: $variantId) {
      id
      product {
        requiresSellingPlan
      }
      sellingPlanGroupCount
      sellingPlanGroups(first: 1) {
        edges {
          node {
            id
            name
            options
            sellingPlans(first: 5) {
              edges {
                node {
                  id
                  name
                  options
                  pricingPolicies {
                    ... on SellingPlanPricingPolicyBase {
                      adjustmentType
                      adjustmentValue {
                        ... on SellingPlanPricingPolicyPercentageValue {
                          percentage
                        }
                        ... on MoneyV2 {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function Product({ lineItem, lineIndex, lineItems }) {
  const { data, error, loading } = useQuery(GET_PRODUCT, {
    variables: {
      variantId: lineItem.variantInfo.value.id,
    },
  });
  const { shopData } = useShop();
  const shopDomain = shopData && shopData.shop;

  const variant = lineItem.variantInfo.value;
  const image = variant.image && variant.image.originalSrc;

  // Add empty product attribute
  const handleAttributeAdd = useCallback(
    (lineIndex) => {
      if (
        !lineItems.fields[lineIndex] ||
        !lineItems.fields[lineIndex].link_line_properties
      ) {
        return;
      }

      if (!lineItems.fields[lineIndex].link_line_properties) {
        lineItems.fields[lineIndex].link_line_properties.onChange([
          { label: "", value: "" },
        ]);
      } else {
        lineItems.fields[lineIndex].link_line_properties.onChange([
          ...lineItems.fields[lineIndex].link_line_properties.value,
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
        lineItems.fields[lineIndex].link_line_properties.value;
      cachedAttributes.splice(attributeIndex, 1);

      lineItems.fields[lineIndex].link_line_properties.onChange([
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
        !lineItems.fields[lineIndex].link_line_properties ||
        !lineItems.fields[lineIndex].link_line_properties.value[attributeIndex]
      ) {
        return;
      }

      const cachedAttributes =
        lineItems.fields[lineIndex].link_line_properties.value;
      cachedAttributes[attributeIndex][property] = value;

      lineItems.fields[lineIndex].link_line_properties.onChange([
        ...cachedAttributes,
      ]);
    },
    [lineItems]
  );

  // Change line item selling plan id
  const handleSellingPlanChange = useCallback(
    (lineIndex, value) => {
      if (
        !lineItems.fields[lineIndex] ||
        !lineItems.fields[lineIndex].link_selling_plan_id
      ) {
        return;
      }

      if (!value.length) {
        lineItems.fields[lineIndex].link_selling_plan_id.onChange(null);
        return;
      }

      lineItems.fields[lineIndex].link_selling_plan_id.onChange(value);
    },
    [lineItems]
  );

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
                            {variant.product.title || variant.title}
                          </Link>
                        ) : null}
                      </TextStyle>
                      {variant.title !== "Default Title" ? (
                        <Subheading>
                          <TextStyle variation="subdued">
                            {variant.title}
                          </TextStyle>
                        </Subheading>
                      ) : null}
                    </Stack>
                    <SellingPlanPicker
                      data={data}
                      loading={loading}
                      link_selling_plan_id={lineItem.link_selling_plan_id}
                    />
                  </Stack>
                </Card.Subsection>
                {lineItem.link_line_properties &&
                lineItem.link_line_properties.value.length ? (
                  <Card.Subsection>
                    <div style={{ maxWidth: "80%" }}>
                      <Stack vertical spacing="tight">
                        {lineItem.link_line_properties.value.map(
                          (attribute, attributeIndex) => {
                            return (
                              <Stack
                                alignment="trailing"
                                wrap={false}
                                spacing="extraTight"
                                key={attributeIndex}
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
                        <Caption>
                          <TextStyle variation="subdued">
                            Add an underscore `_` before the label to hide from
                            customers.
                          </TextStyle>
                        </Caption>
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
}

function SellingPlanPicker({ loading, data, link_selling_plan_id }) {
  const sellingPlanOptions = [];

  const sellingPlanGroups =
    (data &&
      data.productVariant &&
      nodesFromEdges(data.productVariant.sellingPlanGroups.edges)) ||
    null;
  const sellingPlans =
    (sellingPlanGroups &&
      sellingPlanGroups[0] &&
      sellingPlanGroups[0].sellingPlans &&
      nodesFromEdges(sellingPlanGroups[0].sellingPlans.edges)) ||
    null;
  const sellingPlanId =
    link_selling_plan_id && link_selling_plan_id.value
      ? parseGid(link_selling_plan_id.value)
      : null;
  const requiresSellingPlan =
    data &&
    data.productVariant.product &&
    data.productVariant.product.requiresSellingPlan;

  useEffect(() => {
    // If a product requires a selling plan,
    // but none is selected, select first plan id
    if (requiresSellingPlan && !sellingPlanId && sellingPlans) {
      link_selling_plan_id.onChange(sellingPlans[0].id);
    }
  }, [data]);

  if (loading) {
    if (sellingPlanId) {
      return (
        <Stack vertical spacing="extraTight">
          <Label>Subscription</Label>
          <Button loading={true} disclosure="select" />
        </Stack>
      );
    }
    return <Spinner size="small" />;
  }

  if (!data) {
    return null;
  }

  if (!sellingPlans) {
    return null;
  }

  if (!requiresSellingPlan) {
    sellingPlanOptions.unshift({ label: "None", value: "" });
  }
  sellingPlans.map((plan) =>
    sellingPlanOptions.push({ label: plan.name, value: plan.id })
  );

  return (
    <Select
      label={
        <Stack alignment="center" spacing="tight">
          <Stack.Item>Subscription</Stack.Item>
          {sellingPlanId ? <Caption>(ID: {sellingPlanId})</Caption> : null}
        </Stack>
      }
      options={sellingPlanOptions}
      value={sellingPlanId ? composeGid("SellingPlan", sellingPlanId) : ""}
      onChange={(value) => link_selling_plan_id.onChange(value)}
    />
  );
}
