import { Tabs } from "@shopify/polaris";
import { useLocation } from "react-router";

export function LinkTabs() {
  const location = useLocation();
  let selectedTabIndex = 0;

  if (location.pathname == "/links/dynamic") {
    selectedTabIndex = 1;
  }

  return (
    <Tabs
      tabs={[
        {
          id: "alias",
          content: "Saved links",
          url: "/",
        },
        {
          id: "dynamic",
          content: "Dynamic links",
          url: "/links/dynamic",
        },
        // {
        //     id: "reorder",
        //     content: "Reorder links",
        //     url: "/links/reorder",
        // },
      ]}
      selected={selectedTabIndex}
    />
  );
}
