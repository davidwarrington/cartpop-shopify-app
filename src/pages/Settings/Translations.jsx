import { useEffect, useState } from "react";
import {
  Card,
  Form,
  FormLayout,
  Page,
  PageActions,
  Spinner,
  TextField,
} from "@shopify/polaris";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";

import { capitalize, userLoggedInFetch } from "../../helpers";
import { PAGE_STATES } from "../../constants";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { useShop } from "../../core/ShopProvider";

const pageTitle = "Translations";
const pageBreadcrumbs = [
  { content: "Dashboard", url: "/" },
  { content: "Settings", url: "/settings" },
];

const SettingsTranslationsPage = () => {
  const { shopData } = useShop();
  const primaryLocale =
    shopData &&
    shopData.shopLocales &&
    shopData.shopLocales.find((locale) => locale.primary);

  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [pageState, setPageState] = useState("loading");
  const [metafieldId, setMetafieldId] = useState(null);
  const [translations, setTranslations] = useState(null);
  const [defaultTranslations, setDefaultTranslations] = useState(null);
  const [locale, setLocale] = useState(
    primaryLocale ? primaryLocale.locale : null
  );
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

      setDefaultTranslations(apiRes.defaultTranslations);
      setTranslations(apiRes.translations);
      setMetafieldId(apiRes.metafieldId);

      setPageState(PAGE_STATES.idle);
    } catch (err) {
      setToast({
        show: true,
        content:
          "Failed to retrieve translations. Please try again or contact support",
        error: true,
      });
      console.warn(err);
      setPageState(PAGE_STATES.idle);
    }
  };

  const handleSubmit = async () => {
    try {
      setPageState(PAGE_STATES.submitting);
      // Send translations to api
      const apiRes = await fetchFunction(`/api/shop/translations`, {
        method: "PUT",
        body: JSON.stringify({
          translations: translations,
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

      setPageState(PAGE_STATES.idle);
    } catch (err) {
      setToast({
        show: true,
        content:
          "Failed to save translations. Please try again or contact support",
        error: true,
      });
      console.warn(err);
      setPageState(PAGE_STATES.idle);
    }
  };

  const handleChangeTranslation = async ({ key, value }) => {
    setTranslations((translations) => {
      const cachedTranslations = translations ? { ...translations } : {};

      if (!cachedTranslations[locale]) {
        cachedTranslations[locale] = {};
      }

      if (!value) {
        delete cachedTranslations[locale][key];
      } else {
        cachedTranslations[locale][key] = value;
      }

      return cachedTranslations;
    });
  };

  if (pageState === PAGE_STATES.loading) {
    return (
      <Page breadcrumbs={pageBreadcrumbs} title={pageTitle}>
        <Card sectioned>
          <Spinner />
        </Card>
      </Page>
    );
  }

  const currentTranslations =
    defaultTranslations[locale] || defaultTranslations["en"];

  return (
    <Page
      breadcrumbs={pageBreadcrumbs}
      title={pageTitle}
      primaryAction={{
        content: "Save",
        onAction: handleSubmit,
        loading: pageState === PAGE_STATES.submitting,
      }}
    >
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <TitleBar title={pageTitle} breadcrumbs={pageBreadcrumbs} />
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Section>
            <LocaleSwitcher activeLocale={locale} setLocale={setLocale} />
          </Card.Section>
          <Card.Section>
            <FormLayout>
              {Object.keys(currentTranslations).map((translationKey) => (
                <TextField
                  key={translationKey}
                  autoComplete="off"
                  label={capitalize(translationKey.replaceAll("_", " "))}
                  placeholder={currentTranslations[translationKey]}
                  value={
                    translations &&
                    translations[locale] &&
                    translations[locale][translationKey]
                  }
                  onChange={(value) =>
                    handleChangeTranslation({ key: translationKey, value })
                  }
                  clearButton
                  onClearButtonClick={() =>
                    handleChangeTranslation({
                      key: translationKey,
                      value: null,
                    })
                  }
                />
              ))}
              {/* <PageActions primaryAction={{
                        content: "Save",
                        onAction: handleSubmit,
                        loading: pageState === PAGE_STATES.submitting
                    }} /> */}
            </FormLayout>
          </Card.Section>
        </Card>
      </Form>
    </Page>
  );
};

export default SettingsTranslationsPage;
