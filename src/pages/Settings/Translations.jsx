import { Card, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const SettingsTranslationsPage = () => {
  const navigate = useNavigate();

  const pageTitle = "Translations";

  return (
    <Page
      breadcrumbs={[
        { content: "Dashboard", url: "/" },
        { content: "Settings", url: "/settings" },
      ]}
      title={pageTitle}
    >
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Dashboard", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      <Card sectioned>Coming soon!</Card>
    </Page>
  );
};

export default SettingsTranslationsPage;
