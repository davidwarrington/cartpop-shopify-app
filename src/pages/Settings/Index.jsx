import {
  ActionList,
  Card,
  Icon,
  Layout,
  Link,
  Page,
  Stack,
  TextStyle,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";
import { QuickSaleMajor, SettingsMajor } from "@shopify/polaris-icons";
import { SettingsGeneral, SettingsReorder } from "../index";

const SettingsPage = () => {
  const navigate = useNavigate();

  const primaryAction = { content: "Foo", url: "/foo" };
  const secondaryActions = [{ content: "Bar", url: "/bar", loading: true }];
  const actionGroups = [
    { title: "Baz", actions: [{ content: "Baz", url: "/baz" }] },
  ];

  const settingLinks = [
    {
      content: "General",
      helpText: "View and update your details",
      icon: SettingsMajor,
      url: "/settings/general",
    },
    // {
    //   content: "Reorder links",
    //   helpText: "Allow customers to quickly reorder products they've previously purchased",
    //   icon: QuickSaleMajor,
    //   url: "/settings/reorder"
    // },
  ];

  return (
    <Page
      breadcrumbs={[{ content: "Home", url: "/" }]}
      title="Settings"
      narrowWidth
    >
      <TitleBar
        title="Settings"
        breadcrumbs={[{ content: "Home", url: "/" }]}
        // primaryAction={primaryAction}
        // secondaryActions={secondaryActions}
        // actionGroups={actionGroups}
      />
      <Layout>
        <Layout.Section fullWidth>
          <Card>
            <ActionList actionRole="menuitem" items={settingLinks} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SettingsPage;
