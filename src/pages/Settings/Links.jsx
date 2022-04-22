import {
  Card,
  Checkbox,
  FormLayout,
  Layout,
  Page,
  Select,
} from "@shopify/polaris";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";
import {
  useField,
  useForm,
  //notEmpty,
  submitSuccess,
  submitFail,
  asChoiceField,
} from "@shopify/react-form";
import { useShop } from "../../core/ShopProvider";
import { userLoggedInFetch } from "../../helpers";
import { useState } from "react";

const pageTitle = "Links";

const SettingsLinksPage = () => {
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);
  const { shopData, setShopData } = useShop();
  const { settings } = shopData;

  const [toast, setToast] = useState(null);

  const { fields, submit, submitting, dirty, reset, submitErrors } = useForm({
    fields: {
      linksClearCart: useField(
        settings && settings.linksClearCart === false ? false : true
      ),
      linksRedirectLocation: useField(
        (settings && settings.linksRedirectLocation) || "checkout"
      ),
    },
    async onSubmit(formFields) {
      try {
        await handleSubmit(formFields);
        return submitSuccess();
      } catch (err) {
        console.warn(err);
        return { status: "fail", errors: remoteErrors };
      }
    },
  });

  const handleSubmit = async (formFields) => {
    try {
      const apiRes = await fetchFunction(`/api/shop/settings`, {
        method: "PUT",
        body: JSON.stringify(formFields),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      // Check if update failed
      if (!apiRes || apiRes.success !== true) {
        setToast({
          show: true,
          content:
            "Failed to save settings. Please try again or contact support",
          error: true,
        });
        return false;
      }

      // Show success toast
      setToast({
        show: true,
        content: "Settings saved",
      });

      // Update shopProvider with new settings
      setShopData((shopData) => {
        let cachedShopData = { ...shopData };
        cachedShopData.settings = {
          ...cachedShopData.settings,
          ...formFields,
        };
        return cachedShopData;
      });

      return true;
    } catch (err) {
      setToast({
        show: true,
        content: "Failed to save settings",
        error: true,
      });
      return false;
    }
  };

  return (
    <Page
      breadcrumbs={[
        { content: "Dashboard", url: "/" },
        { content: "Settings", url: "/settings" },
      ]}
      title={pageTitle}
      primaryAction={{
        content: "Save",
        loading: submitting,
        disabled: !dirty,
        onAction: submit,
      }}
    >
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Dashboard", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <Layout>
        <Layout.AnnotatedSection
          id="general"
          title="General"
          description="These settings apply to all links."
        >
          <Card sectioned>
            <FormLayout>
              <Checkbox
                label="Clear cart"
                helpText="This will clear the current cart contents before adding link contents"
                {...asChoiceField(fields.linksClearCart)}
              />
              <Select
                label="Redirect link to"
                options={[
                  { label: "Checkout", value: "checkout" },
                  { label: "Cart", value: "cart" },
                ]}
                helpText="*Checkout is recommended"
                {...fields.linksRedirectLocation}
              />
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default SettingsLinksPage;
