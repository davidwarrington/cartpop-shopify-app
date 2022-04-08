import { Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const SettingsGeneralPage = () => {
  const navigate = useNavigate();

  const pageTitle = "General";

  return (
    <Page
      breadcrumbs={[
        { content: "Home", url: "/" },
        { content: "Settings", url: "/settings" },
      ]}
      title={pageTitle}
    >
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Home", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      General...
    </Page>
  );
};

export default SettingsGeneralPage;
