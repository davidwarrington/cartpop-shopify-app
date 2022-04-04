import { Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <Page breadcrumbs={[{ content: "Home", url: "/" }]} title="Settings">
      settings...
    </Page>
  );
};

export default Settings;
