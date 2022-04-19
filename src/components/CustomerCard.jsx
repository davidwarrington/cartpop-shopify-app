import { useCallback, useState } from "react";
import {
  Button,
  Card,
  FormLayout,
  Heading,
  Icon,
  Modal,
  Stack,
  Subheading,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import {
  CustomersMajor,
  EmailMajor,
  LocationMajor,
} from "@shopify/polaris-icons";
import { iconStyles } from "../constants";
import { CardGrid } from "./CardGrid";

export function CustomerCard({ customer }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModalVisibility = useCallback(() => {
    setShowModal((status) => !status);
  }, []);

  const hasCustomerInfo = Object.keys(customer).some((key) =>
    customer[key].value ? true : false
  );

  return (
    <>
      <Card
        title={!hasCustomerInfo ? "Customer information" : ""}
        primaryFooterAction={
          !hasCustomerInfo
            ? {
                content: "Add",
                onAction: toggleModalVisibility,
                accessibilityLabel: "Add customer information",
              }
            : null
        }
      >
        {hasCustomerInfo ? (
          <Card.Section subdued>
            <Stack distribution="equalSpacing" alignment="center">
              <Heading element="h2">Customer information</Heading>
              <Button removeUnderline onClick={toggleModalVisibility} plain>
                Edit customer
              </Button>
            </Stack>
          </Card.Section>
        ) : null}
        {hasCustomerInfo ? (
          <Card.Section>
            <CardGrid>
              {customer.email.value ? (
                <Stack alignment="center" spacing="tight" wrap={false}>
                  <div style={iconStyles}>
                    <Icon source={EmailMajor} color="base" />
                  </div>
                  <Stack.Item fill>
                    <Stack vertical spacing="none">
                      <Subheading>
                        <TextStyle variation="subdued">Email</TextStyle>
                      </Subheading>
                      <Stack.Item>
                        <span style={{ overflowWrap: "break-word" }}>
                          {customer.email.value}
                        </span>
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                </Stack>
              ) : null}
              {customer.first_name.value || customer.last_name.value ? (
                <Stack alignment="center" spacing="tight" wrap={false}>
                  <div style={iconStyles}>
                    <Icon source={CustomersMajor} color="base" />
                  </div>
                  <Stack vertical spacing="none">
                    <Subheading>
                      <TextStyle variation="subdued">Name</TextStyle>
                    </Subheading>
                    <Stack.Item>
                      {customer.first_name.value + " "}
                      {customer.last_name.value}
                    </Stack.Item>
                  </Stack>
                </Stack>
              ) : null}
              {customer.address1.value ||
              customer.address2.value ||
              customer.city.value ||
              customer.province.value ||
              customer.zipcode.value ? (
                <Stack alignment="center" spacing="tight" wrap={false}>
                  <div style={iconStyles}>
                    <Icon source={LocationMajor} color="base" />
                  </div>
                  <Stack vertical spacing="none">
                    <Subheading>
                      <TextStyle variation="subdued">
                        Shipping address
                      </TextStyle>
                    </Subheading>
                    <Stack.Item>
                      {customer.address1.value}
                      {customer.address2.value &&
                        ", " + customer.address2.value}
                      {customer.city.value && ", " + customer.city.value}
                      {customer.province.value &&
                        ", " + customer.province.value}
                    </Stack.Item>
                    <Stack.Item>
                      {customer.zipcode.value && customer.zipcode.value}
                      {customer.country.value && ", " + customer.country.value}
                    </Stack.Item>
                  </Stack>
                </Stack>
              ) : null}
            </CardGrid>
          </Card.Section>
        ) : (
          <Card.Section>
            <TextStyle variation="subdued">
              No customer specific information included on checkout link.
            </TextStyle>
          </Card.Section>
        )}
      </Card>
      <Modal
        open={showModal}
        onClose={toggleModalVisibility}
        title="Customer information"
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
              type="email"
              label="Email"
              placeholder="example@example.com"
              {...customer.email}
            />
            <Stack distribution="fillEvenly">
              <TextField
                type="text"
                label="First name"
                placeholder="Sample"
                {...customer.first_name}
              />
              <TextField
                type="text"
                label="Last name"
                placeholder="customer"
                {...customer.last_name}
              />
            </Stack>
          </FormLayout>
        </Modal.Section>
        <Modal.Section>
          <FormLayout>
            <Subheading>Shipping address</Subheading>
            <TextField
              type="text"
              label="Address line 1"
              {...customer.address1}
            />
            <TextField
              type="text"
              label="Address line 2"
              {...customer.address2}
            />
            <Stack distribution="fillEvenly">
              <TextField
                type="text"
                label="City"
                placeholder="New York"
                {...customer.city}
              />
              <TextField
                label="State/Province"
                placeholder="New York"
                {...customer.province}
              />
              <TextField
                label="Zipcode"
                placeholder="10022"
                {...customer.zipcode}
              />
            </Stack>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </>
  );
}
