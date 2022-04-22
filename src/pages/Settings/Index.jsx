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
import {
  LanguageMinor,
  LinkMinor,
  PaymentsMajor,
  QuickSaleMajor,
  SettingsMajor,
} from "@shopify/polaris-icons";

const SettingsPage = () => {
  const navigate = useNavigate();

  const primaryAction = { content: "Foo", url: "/foo" };
  const secondaryActions = [{ content: "Bar", url: "/bar", loading: true }];
  const actionGroups = [
    { title: "Baz", actions: [{ content: "Baz", url: "/baz" }] },
  ];

  const settingLinks = [
    // {
    //   content: "General",
    //   helpText: "View and update your details",
    //   icon: SettingsMajor,
    //   url: "/settings/general",
    // },
    {
      content: "Links",
      helpText: "View and update your link settings",
      icon: LinkMinor,
      url: "/settings/links",
    },
    {
      content: "Billing",
      helpText: "View and update your CartPop subscription plan",
      icon: PaymentsMajor,
      url: "/settings/billing",
    },
    {
      content: "Translations",
      helpText: "Change customer facing copy",
      icon: LanguageMinor,
      url: "/settings/translations",
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
      breadcrumbs={[{ content: "Dashboard", url: "/" }]}
      title="Settings"
      //narrowWidth
    >
      <TitleBar
        title="Settings"
        breadcrumbs={[{ content: "Dashboard", url: "/" }]}
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
