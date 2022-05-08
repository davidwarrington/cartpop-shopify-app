import { useCallback, useState } from "react";
import { Toast } from "@shopify/app-bridge-react";
import {
  Badge,
  Banner,
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
  Select,
  Button,
  Checkbox,
  FooterHelp,
} from "@shopify/polaris";
import { CircleTickMajor } from "@shopify/polaris-icons";
import {
  useField,
  lengthLessThan,
  useForm,
  notEmpty,
  useDynamicList,
  submitSuccess,
  submitFail,
  asChoiceField,
} from "@shopify/react-form";

import { PAGE_STATES } from "../constants";
import { CheckoutLinkCard } from "./CheckoutLinkCard";
import { CustomerCard } from "./CustomerCard";
import { LinkName } from "./LinkName";
import { OrderCard } from "./OrderCard";
import { ProductsCard } from "./ProductsCard";
import SaveBar from "./SaveBar";
import { RequireSubscription } from "./RequireSubscription";
import { useShop } from "../core/ShopProvider";
import { LinkAnalytics } from "./LinkAnalytics";

export function LinkForm({
  newForm,
  showSuccess,
  link,
  pageTitle,
  narrowWidth = false,
  pageState,
  toast,
  setToast,
  handleSubmit,
  handleCopy,
  handlePreview,
  handleRename,
  handleDelete,
}) {
  const { shopData } = useShop();
  const hasSubscription = shopData && shopData.subscription ? true : false;

  const [showModal, setShowModal] = useState(false);

  const toggleNameModal = useCallback(
    () => setShowModal((showModal) => !showModal),
    []
  );

  const settings = {
    clearCart: useField(
      link.settings && typeof link.settings.clearCart !== undefined
        ? link.settings.clearCart
        : true
    ),
    destination: useField(
      (link.settings && link.settings.destination) || "checkout"
    ),
    canEditVariant: useField(
      link.settings && typeof link.settings.canEditVariant !== undefined
        ? link.settings.canEditVariant
        : false
    ),
    canEditQuantity: useField(
      link.settings && typeof link.settings.canEditQuantity !== undefined
        ? link.settings.canEditQuantity
        : false
    ),
  };

  const products = useDynamicList(
    link.products
      ? link.products.map((product) => ({
          ...product,
          link_quantity: product.link_quantity || "1",
          link_line_properties: product.link_line_properties || [],
          link_selling_plan_id: product.link_selling_plan_id || null,
        }))
      : [],
    (value) => value
  );

  const customer = {
    email: useField((link.customer && link.customer.email) || ""),
    first_name: useField((link.customer && link.customer.first_name) || ""),
    last_name: useField((link.customer && link.customer.last_name) || ""),
    address1: useField((link.customer && link.customer.address1) || ""),
    address2: useField((link.customer && link.customer.address2) || ""),
    city: useField((link.customer && link.customer.city) || ""),
    province: useField((link.customer && link.customer.province) || ""),
    zipcode: useField((link.customer && link.customer.zipcode) || ""),
    country: useField((link.customer && link.customer.country) || ""),
  };

  const order = {
    note: useField({
      value: (link.order && link.order.note) || "",
      validates: [lengthLessThan("5001")],
    }),
    discountCode: useField({
      value: (link.order && link.order.discountCode) || "",
      validates: [lengthLessThan("256")],
    }),
    ref: useField((link.order && link.order.ref) || ""),
    useShopPay: useField((link.order && link.order.useShopPay) || false),
  };
  const orderAttributes = useDynamicList(
    (link.order && link.order.attributes) || [],
    () => ({
      label: "",
      value: "",
    })
  );

  const { fields, submit, submitting, dirty, reset, submitErrors } = useForm({
    fields: {
      active: useField(link.active || false),
      alias: useField({
        value: link.alias,
        validates: newForm ? [] : [notEmpty("Link alias is required")],
      }),
      name: useField({
        value: link.name || "",
        validates: [notEmpty("Link name is required")],
      }),
      customer,
      order: {
        ...order,
        attributes: orderAttributes.fields,
      },
      settings,
    },
    dynamicLists: {
      products,
    },
    async onSubmit(formFields) {
      try {
        if (!formFields.products || !formFields.products.length) {
          setToast({
            show: true,
            content: "Please select at least one product",
            error: true,
          });
          return {
            status: "fail",
            errors: [{ message: "Please select at least one product" }],
          };
        }

        const result = await handleSubmit(formFields);
        return submitSuccess();

        // TODO: check result
        // const remoteErrors = []; // your API call goes here
        // if (remoteErrors.length > 0) {
        //   return { status: "fail", errors: remoteErrors };
        // }
      } catch (err) {
        console.warn(err);
        return { status: "fail", errors: remoteErrors };
      }
    },
    //makeCleanAfterSubmit: true,
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
    if (!newForm) {
      secondaryActions.push({
        content: "Rename",
        onAction: toggleNameModal,
      });
    }
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

  const productsValue = (products && products.value) || [];

  return (
    <Form onSubmit={submit}>
      <Page
        narrowWidth={narrowWidth}
        breadcrumbs={[{ content: "Home", url: "/" }]}
        title={fields.name.value || pageTitle}
        subtitle={
          !newForm ? (
            <TextStyle variation="subdued">
              Last updated on{" "}
              {new Date(link.updatedAt || link.createdAt).toLocaleString()}
            </TextStyle>
          ) : null
        }
        primaryAction={{
          content: "Save",
          disabled:
            (!dirty && !products.dirty) || pageState === PAGE_STATES.submitting,
          loading: pageState === PAGE_STATES.submitting,
          onAction: submit,
        }}
        secondaryActions={secondaryActions}
      >
        {/* <SaveBar
          showBar={dirty || products.dirty}
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
        /> */}
        {toast && toast.show ? (
          <Toast
            content={toast.content}
            onDismiss={() => setToast({})}
            error={toast.error}
          />
        ) : null}
        <Layout>
          {errorBanner}

          {showSuccess ? (
            <Layout.Section fullWidth>
              <Banner
                status="success"
                title={`${link.name || "Link"} created`}
                icon={CircleTickMajor}
              >
                <Link monochrome url="/links/new">
                  Create another checkout link
                </Link>
              </Banner>
            </Layout.Section>
          ) : null}

          {(!newForm && fields.active.value) ||
          (link.analytics && link.analytics.clicks) ? (
            <Layout.Section>
              <LinkAnalytics link={link} hasSubscription={hasSubscription} />
            </Layout.Section>
          ) : null}

          <Layout.Section>
            {newForm ? null : (
              <CheckoutLinkCard
                newForm={newForm}
                link={link}
                linkActive={fields.active.value}
                alias={fields.alias}
                products={productsValue}
                customer={fields.customer}
                order={fields.order}
                orderAttributes={orderAttributes.value}
              />
            )}
            <LinkName
              name={fields.name}
              showModal={showModal}
              handleRename={handleRename}
              toggleModal={toggleNameModal}
            />
            <ProductsCard products={products} settings={fields.settings} />
            <CustomerCard customer={fields.customer} />
            <OrderCard order={fields.order} attributes={orderAttributes} />
            {newForm ? (
              <CheckoutLinkCard
                newForm={newForm}
                link={link}
                linkActive={fields.active.value}
                alias={fields.alias}
                products={productsValue}
                customer={fields.customer}
                order={fields.order}
              />
            ) : null}
          </Layout.Section>
          <Layout.Section secondary>
            {!newForm ? (
              <RequireSubscription hidden>
                <Card
                  sectioned
                  title={
                    <Stack alignment="center">
                      <Heading>Visibility</Heading>
                      {fields.active.value ? (
                        <Badge status="success">Enabled</Badge>
                      ) : (
                        <Badge>Disabled</Badge>
                      )}
                    </Stack>
                  }
                >
                  <RadioButton
                    label="Enabled"
                    helpText="Customers will be able to check out with this link."
                    id="enabled"
                    name="visibility"
                    checked={fields.active.value}
                    onChange={() =>
                      fields.active.onChange(!fields.active.value)
                    }
                  />
                  <RadioButton
                    label="Disabled"
                    helpText="Customers will not be able to check out with this link."
                    id="disabled"
                    name="visibility"
                    checked={fields.active.value === false}
                    onChange={() =>
                      fields.active.onChange(!fields.active.value)
                    }
                  />
                </Card>
              </RequireSubscription>
            ) : null}
            <Card title="Settings">
              <Card.Section>
                <Stack vertical spacing="tight">
                  <Select
                    label="Link destination"
                    disabled={!hasSubscription}
                    options={[
                      {
                        label: "Checkout",
                        value: "checkout",
                      },
                      {
                        label: "Cart",
                        value: "cart",
                      },
                      {
                        label: "Landing page",
                        value: "landing_page",
                      },
                    ]}
                    {...fields.settings.destination}
                    helpText={
                      hasSubscription ? null : (
                        <>
                          Redirect to cart or an optimized landing page by{" "}
                          <Link url="/settings/billing">upgrading to Pro</Link>.
                        </>
                      )
                    }
                  />

                  {fields.settings.destination.value === "landing_page" ? (
                    <>
                      <Button fullWidth>Edit page design</Button>
                    </>
                  ) : null}
                </Stack>
              </Card.Section>
              <Card.Section subdued>
                <Checkbox
                  label="Clear customer's existing cart when adding the link's products."
                  {...asChoiceField(fields.settings.clearCart)}
                />
              </Card.Section>
            </Card>
            {newForm ? (
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
            ) : null}
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
                        content: "Delete link",
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
          <Layout.Section />
          <Layout.Section fullWidth>
            <FooterHelp>
              Need to change customer facing copy?{" "}
              <Link>Edit translations</Link>
            </FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
    </Form>
  );
}
