import { Button, Card, Form, Page, Spinner } from "@shopify/polaris";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../helpers";
import { useEffect, useState } from "react";

const SettingsTranslationsPage = () => {
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const pageTitle = "Translations";

  const [loading, setLoading] = useState(true);
  const [metafieldId, setMetafieldId] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [defaultTranslations, setDefaultTranslations] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getTranslations();
  }, []);

  const getTranslations = async () => {
    try {
      // Send translations to api
      const apiRes = await fetchFunction(`/api/shop/translations`).then((res) =>
        res.json()
      );

      console.log("apiRes", apiRes);

      setDefaultTranslations(apiRes.defaultTranslations);
      setTranslations(apiRes.translations);
      setMetafieldId(apiRes.metafieldId);

      setLoading(false);
    } catch (err) {
      setToast({
        show: true,
        content:
          "Failed to retrieve translations. Please try again or contact support",
        error: true,
      });
      console.warn(err);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Send translations to api
      const apiRes = await fetchFunction(`/api/shop/translations`, {
        method: "PUT",
        body: JSON.stringify({
          translations: { en: { bob: "ok" } }, // TODO:
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      // TODO: check

      setToast({
        show: true,
        content: "Saved translations",
      });

      console.log("apiRes", apiRes);
    } catch (err) {
      setToast({
        show: true,
        content:
          "Failed to save translations. Please try again or contact support",
        error: true,
      });
      console.warn(err);
    }
  };

  console.log("translations", translations);

  if (loading) {
    // TODO: replace with skeleton page
    return (
      <Page>
        <Spinner />
      </Page>
    );
  }

  return (
    <Page
      breadcrumbs={[
        { content: "Dashboard", url: "/" },
        { content: "Settings", url: "/settings" },
      ]}
      title={pageTitle}
    >
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Dashboard", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      <Form onSubmit={handleSubmit}>
        <Card sectioned>
          <Button onClick={handleSubmit}></Button>
        </Card>
      </Form>
    </Page>
  );
};

export default SettingsTranslationsPage;
