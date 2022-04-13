import { Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const SettingsReorderPage = () => {
  const navigate = useNavigate();

  const pageTitle = "Reorder links";

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
      Reorder...
    </Page>
  );
};

export default SettingsReorderPage;
