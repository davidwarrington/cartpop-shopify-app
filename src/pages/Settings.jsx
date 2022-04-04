import { Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const Settings = () => {
  const navigate = useNavigate();

  const primaryAction = { content: "Foo", url: "/foo" };
  const secondaryActions = [{ content: "Bar", url: "/bar", loading: true }];
  const actionGroups = [
    { title: "Baz", actions: [{ content: "Baz", url: "/baz" }] },
  ];

  return (
    <Page breadcrumbs={[{ content: "Home", url: "/" }]} title="Settings">
      <TitleBar
        title="Settings"
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        actionGroups={actionGroups}
      />
      settings...
    </Page>
  );
};

export default Settings;
