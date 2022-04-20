import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  FormLayout,
  Stack,
  TextField,
  Modal,
  Subheading,
  TextStyle,
  Icon,
  TextContainer,
  Heading,
  Link,
} from "@shopify/polaris";
import {
  DiscountsMajor,
  NoteMajor,
  PaymentsMajor,
  ReferralMajor,
  TickMinor,
} from "@shopify/polaris-icons";
import { asChoiceField } from "@shopify/react-form";
import { iconStyles } from "../constants";
import { CardGrid } from "./CardGrid";

export function OrderCard({ order, attributes }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModalVisibility = useCallback(() => {
    setShowModal((status) => !status);
  }, []);

  const hasOrderInfo =
    attributes.fields.length ||
    Object.keys(order).some((key) =>
      (order[key].value && order[key].value.length !== 0) || order[key].checked
        ? true
        : false
    );

  console.log(order.discountCode);

  return (
    <>
      <Card
        title={!hasOrderInfo ? "Order information" : ""}
        primaryFooterAction={
          !hasOrderInfo
            ? {
                content: "Add",
                onAction: toggleModalVisibility,
                accessibilityLabel: "Add order information",
              }
            : null
        }
      >
        {hasOrderInfo ? (
          <Card.Section subdued>
            <Stack distribution="equalSpacing" alignment="center">
              <Heading element="h2">Order information</Heading>
              <Button removeUnderline onClick={toggleModalVisibility} plain>
                Edit order info
              </Button>
            </Stack>
          </Card.Section>
        ) : null}
        {hasOrderInfo ? (
          <>
            {order.note.value ||
            order.discountCode.value ||
            order.ref.value ||
            order.useShopPay.value ||
            attributes.length ? (
              <Card.Section>
                <CardGrid>
                  {order.discountCode.value ? (
                    <Stack alignment="center" spacing="tight" wrap={false}>
                      <div style={iconStyles}>
                        <Icon source={DiscountsMajor} color="base" />
                      </div>
                      <Stack.Item fill>
                        <Stack vertical spacing="none">
                          <Subheading>
                            <TextStyle variation="subdued">
                              Discount code
                            </TextStyle>
                          </Subheading>
                          <Stack.Item>{order.discountCode.value}</Stack.Item>
                        </Stack>
                      </Stack.Item>
                    </Stack>
                  ) : null}
                  {order.note.value ? (
                    <Stack alignment="center" spacing="tight" wrap={false}>
                      <div style={iconStyles}>
                        <Icon source={NoteMajor} color="base" />
                      </div>
                      <Stack.Item fill>
                        <Stack vertical spacing="none">
                          <Subheading>
                            <TextStyle variation="subdued">
                              Order note
                            </TextStyle>
                          </Subheading>
                          <Stack.Item>
                            <TextContainer>
                              {order.note.value && order.note.value.length > 50
                                ? order.note.value.substring(0, 50) + "..."
                                : order.note.value}
                            </TextContainer>
                          </Stack.Item>
                        </Stack>
                      </Stack.Item>
                    </Stack>
                  ) : null}
                  {order.ref.value ? (
                    <Stack alignment="center" spacing="tight" wrap={false}>
                      <div style={iconStyles}>
                        <Icon source={ReferralMajor} color="base" />
                      </div>
                      <Stack.Item fill>
                        <Stack vertical spacing="none">
                          <Subheading>
                            <TextStyle variation="subdued">
                              Referral code
                            </TextStyle>
                          </Subheading>
                          <Stack.Item>{order.ref.value}</Stack.Item>
                        </Stack>
                      </Stack.Item>
                    </Stack>
                  ) : null}
                  {order.useShopPay.value ? (
                    <Stack alignment="center" spacing="tight" wrap={false}>
                      <div style={iconStyles}>
                        <Icon source={PaymentsMajor} color="base" />
                      </div>
                      <Stack vertical spacing="none">
                        <Stack spacing="extraTight">
                          <Icon color="success" source={TickMinor} />
                          <Stack.Item>Redirect to Shop Pay</Stack.Item>
                        </Stack>
                      </Stack>
                    </Stack>
                  ) : null}
                </CardGrid>
              </Card.Section>
            ) : null}
            {attributes && attributes.fields.length ? (
              <Card.Section
                title={
                  <Subheading>
                    <TextStyle variation="subdued">
                      Order note attributes
                    </TextStyle>
                  </Subheading>
                }
              >
                {attributes.fields.map((attribute, attributeIndex) => (
                  <Card.Subsection key={attributeIndex}>
                    <TextStyle variation="strong">
                      {attribute.label.value || (
                        <TextStyle variation="negative">
                          Missing attribute label
                        </TextStyle>
                      )}
                      :
                    </TextStyle>{" "}
                    {attribute.value.value || (
                      <TextStyle variation="negative">
                        Missing attribute value
                      </TextStyle>
                    )}
                  </Card.Subsection>
                ))}
              </Card.Section>
            ) : null}
          </>
        ) : (
          <Card.Section>
            <TextStyle variation="subdued">
              No order information included on checkout link.
            </TextStyle>
          </Card.Section>
        )}
      </Card>
      <Modal
        open={showModal}
        onClose={toggleModalVisibility}
        title="Order information"
        secondaryActions={[
          {
            content: "Edit and close",
            onAction: toggleModalVisibility,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              showCharacterCount
              type="text"
              label="Discount code"
              maxLength={255}
              spellCheck={false}
              helpText="Automatically applied at checkout."
              clearButton
              onClearButtonClick={() => order.discountCode.onChange(null)}
              {...order.discountCode}
            />
            <TextField
              showCharacterCount
              type="text"
              label="Note"
              multiline={3}
              maxLength={5000}
              helpText="Order notes are shown on the order details page."
              {...order.note}
            />
            <TextField
              type="text"
              label="Ref"
              spellCheck={false}
              helpText={
                <>
                  Not visible to customers. Shown as the referral code in the{" "}
                  <Link
                    external
                    url="https://help.shopify.com/en/manual/orders/conversion-summary"
                  >
                    Conversion summary
                  </Link>{" "}
                  section on the details page.
                </>
              }
              clearButton
              onClearButtonClick={() => order.ref.onChange(null)}
              {...order.ref}
            />
          </FormLayout>
        </Modal.Section>
        <Modal.Section>
          <FormLayout>
            <Subheading>Order attributes</Subheading>
            {attributes.fields && attributes.fields.length ? (
              attributes.fields.map((attribute, attributeIndex) => (
                <Stack alignment="trailing" key={attributeIndex}>
                  <TextField
                    requiredIndicator
                    label="Label"
                    value={attribute.label.value}
                    onChange={attribute.label.onChange}
                  />
                  <TextField
                    requiredIndicator
                    label="Value"
                    value={attribute.value.value}
                    onChange={attribute.value.onChange}
                  />
                  <Button
                    accessibilityLabel="Remove attribute"
                    onClick={() => attributes.removeItem(attributeIndex)}
                  >
                    Remove
                  </Button>
                </Stack>
              ))
            ) : (
              <TextStyle variation="subdued">
                No order attributes specified.
              </TextStyle>
            )}

            <Button
              primary
              onClick={attributes.addItem}
              disabled={attributes.fields && attributes.fields.length === 10}
            >
              {!attributes.fields || attributes.fields.length !== 10
                ? "Add attribute"
                : "10/10 attributes reached"}
            </Button>
          </FormLayout>
        </Modal.Section>
        <Modal.Section>
          <FormLayout>
            <Checkbox
              label="Redirect to Shop Pay"
              helpText={
                <>
                  Automatically redirect a customer to{" "}
                  <Link external url="https://shop.app/what-shop-does">
                    Shop Pay
                  </Link>
                  .
                </>
              }
              {...asChoiceField(order.useShopPay)}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </>
  );
}
