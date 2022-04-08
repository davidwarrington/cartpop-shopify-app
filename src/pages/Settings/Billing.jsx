import { Card, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const SettingsBillingPage = () => {
  const navigate = useNavigate();

  const pageTitle = "Billing";

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
      <Card sectioned></Card>
    </Page>
  );
};

export default SettingsBillingPage;
