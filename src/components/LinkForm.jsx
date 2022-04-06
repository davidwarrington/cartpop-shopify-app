import { useState } from "react";
import { TitleBar, Toast } from "@shopify/app-bridge-react";
import {
  Badge,
  Card,
  Form,
  Heading,
  Layout,
  Page,
  PageActions,
  RadioButton,
  Stack,
  TextStyle,
  Link,
  Banner,
} from "@shopify/polaris";
import {
  useField,
  lengthLessThan,
  useForm,
  notEmpty,
  useChoiceField,
  submitSuccess,
  makeCleanFields,
} from "@shopify/react-form";

import { PAGE_STATES } from "../constants";
import { CheckoutLinkCard } from "./CheckoutLinkCard";
import { CustomerCard } from "./CustomerCard";
import { NameCard } from "./NameCard";
import { OrderCard } from "./OrderCard";
import { ProductsCard } from "./ProductsCard";
import SaveBar from "./SaveBar";

export function LinkForm({
  link,
  pageTitle,
  pageState,
  toast,
  handleUpdate,
  handleCopy,
  handlePreview,
  handleDelete,
}) {
  // TODO:
  const [linkActive, setActive] = useState(link.active);

  // TODO:
  const [linkAlias, setAlias] = useState(link.alias);

  const products = useField({
    value: link.products,
    validates: [
      //notEmpty("At least one selected product is required"),
    ],
  });

  const customer = {
    email: useField(""),
    first_name: useField(""),
    last_name: useField(""),
    address1: useField(""),
    address2: useField(""),
    city: useField(""),
    province: useField(""),
    zipcode: useField(""),
    country: useField(""),
  };

  const order = {
    note: useField({
      value: "",
      validates: [lengthLessThan("5000")],
    }),
    discountCode: useField({
      value: "",
      validates: [lengthLessThan("255")],
    }),
    ref: useField(""),
    useShopPay: useChoiceField(""),
    attributes: useField(""), // TODO:
  };

  const { fields, submit, submitting, dirty, reset, submitErrors, makeClean } =
    useForm({
      fields: {
        active: useField({
          value: false,
          // validates: [
          //   notEmpty('Title is required'),
          //   lengthMoreThan(3, 'Title must be more than 3 characters'),
          // ],
        }),
        alias: useField({
          value: link.alias,
          validates: [notEmpty("Link alias is required")],
        }),
        name: useField({
          value: link.name || "",
          validates: [notEmpty("Link name is required")],
        }),
        products,
        customer,
        order,
      },
      async onSubmit(form) {
        console.log("submit!", form);
        // TODO:
        //handleUpdate();

        const remoteErrors = []; // your API call goes here
        if (remoteErrors.length > 0) {
          return { status: "fail", errors: remoteErrors };
        }

        console.log("hello~");
        makeCleanFields();
        return submitSuccess();
        //return {status: 'success'};
      },
    });

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section fullWidth>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>;
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  const secondaryActions = [];
  if ((pageState !== PAGE_STATES.submitting && handleCopy) || handlePreview) {
    if (handleCopy) {
      secondaryActions.push({
        content: "Duplicate",
        onAction: handleCopy,
      });
    }

    if (handlePreview) {
      secondaryActions.push({
        content: "Preview",
        onAction: () =>
          alert(
            "TODO: Make link work while disabled. Append a special session key"
          ),
      });
    }
  }

  return (
    <Form onSubmit={submit}>
      <Page
        breadcrumbs={[{ content: "Home", url: "/" }]}
        title={pageTitle}
        subtitle={
          <TextStyle variation="subdued">
            Last updated on{" "}
            {new Date(link.updatedAt || link.createdAt).toLocaleString()}
          </TextStyle>
        }
        primaryAction={{
          content: "Save",
          disabled: !dirty || pageState === PAGE_STATES.submitting,
          loading: pageState === PAGE_STATES.submitting,
          onAction: submit,
        }}
        secondaryActions={secondaryActions}
      >
        <SaveBar
          showBar={dirty}
          message="Unsaved products"
          save={[submit]}
          discard={[reset]}
          showSaveLoading={submitting}
          // saveAction={{
          //   onAction: submit,
          //   loading: submitting,
          //   disabled: false,
          // }}
          // discardAction={{
          //   onAction: reset,
          // }}
        />
        <TitleBar title={pageTitle} />
        {toast && toast.show ? (
          <Toast
            content={toast.content}
            onDismiss={() => setToast({})}
            error={toast.error}
          />
        ) : null}
        <Layout>
          {errorBanner}
          {link.isEnabled || link.analytics?.views ? (
            <Layout.Section fullWidth>
              <Card title="Analytics" sectioned>
                // TODO: add analytics card
              </Card>
            </Layout.Section>
          ) : null}
          <Layout.Section>
            <NameCard name={fields.name} />
            <ProductsCard
              products={fields.products.value}
              onChange={fields.products.onChange}
            />
            <CustomerCard customer={fields.customer} />
            <OrderCard order={fields.order} />
            <CheckoutLinkCard
              link={link}
              alias={linkAlias}
              setAlias={setAlias}
              products={products}
              customer={customer}
              order={order}
            />
          </Layout.Section>
          <Layout.Section secondary>
            <Card
              sectioned
              title={
                <Stack alignment="center">
                  <Heading>Visibility</Heading>
                  {linkActive ? (
                    <Badge status="success">Live</Badge>
                  ) : (
                    <Badge>Disabled</Badge>
                  )}
                </Stack>
              }
            >
              <RadioButton
                label="Enabled"
                helpText="Customers will be able to check out with this link."
                checked={linkActive}
                id="disabled"
                name="visibility"
                onChange={(newValue) => setActive(newValue)}
              />
              <RadioButton
                label="Disabled"
                helpText="Customers will not be able to check out with this link."
                id="optional"
                name="visibility"
                checked={!linkActive}
                onChange={(newValue) => setActive(newValue)}
              />
            </Card>
            <Stack vertical alignment="center">
              <Stack.Item />
              <Stack.Item>
                Learn more about{" "}
                <Link
                  external
                  url="https://help.shopify.com/en/manual/products/details/checkout-link"
                >
                  checkout links
                </Link>
              </Stack.Item>
            </Stack>
          </Layout.Section>
          <Layout.Section>
            <PageActions
              primaryAction={{
                content: "Save",
                onAction: submit,
                loading: pageState === PAGE_STATES.submitting,
                disabled: !dirty,
              }}
              secondaryActions={
                handleDelete
                  ? [
                      {
                        content: "Delete",
                        outline: true,
                        destructive: true,
                        loading: pageState === PAGE_STATES.submitting,
                        onAction: handleDelete,
                      },
                    ]
                  : []
              }
            ></PageActions>
          </Layout.Section>
        </Layout>
      </Page>
    </Form>
  );
}
