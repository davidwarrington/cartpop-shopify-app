import {
  Badge,
  Card,
  IndexTable,
  Link,
  Stack,
  TextStyle,
  useIndexResourceState,
} from "@shopify/polaris";
import { capitalize } from "../helpers";

const resourceName = {
  singular: "link",
  plural: "links",
};

export function AllLinksCard({ links }) {
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(links);

  if (!links || !links.length) {
    return null;
  }

  const rows = links.map((link) => {
    let clicks = 0;
    if (link.analytics && link.analytics.clicks) {
      clicks += link.analytics.clicks.mobile || 0;
      clicks += link.analytics.clicks.desktop || 0;
    }

    let scans = 0;
    if (link.analytics && link.analytics.scans) {
      scans += link.analytics.scans.mobile || 0;
      scans += link.analytics.scans.desktop || 0;
    }

    return {
      id: link._id,
      url: `links/${link._id}`,
      active: link.active,
      name: link.name || link._id,
      destination: (link.settings && link.settings.destination) || null,
      clearCart: (link.settings && link.settings.clearCart) || false,
      clicks: clicks,
      scans: scans,
    };
  });

  const rowMarkup = rows.map(
    (
      { id, name, url, destination, active, clearCart, clicks, scans },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        //selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Link plain removeUnderline monochrome url={url}>
            <Stack vertical spacing="extraTight">
              <TextStyle variation="strong">{name}</TextStyle>
              <TextStyle>
                {capitalize(destination)} •{" "}
                {clearCart ? "Clear cart" : "Don't clear cart"}{" "}
              </TextStyle>
            </Stack>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {active ? (
            <Badge status="success">Enabled</Badge>
          ) : (
            <TextStyle variation="subdued">Disabled</TextStyle>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>{clicks}</IndexTable.Cell>
        <IndexTable.Cell>{scans}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={rows.length}
        // selectedItemsCount={
        //   allResourcesSelected ? 'All' : selectedResources.length
        // }
        selectable={false}
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Name" },
          { title: "Active" },
          { title: "Clicks" },
          { title: "Scans" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
