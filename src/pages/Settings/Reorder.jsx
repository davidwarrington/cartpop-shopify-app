import { Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const SettingsReorderPage = () => {
  const navigate = useNavigate();

  const pageTitle = "Reorder links";

  return (
    <Page
      breadcrumbs={[{ content: "Settings", url: "/settings" }]}
      title={pageTitle}
    >
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Home", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      Reorder...
    </Page>
  );
};

export default SettingsReorderPage;
