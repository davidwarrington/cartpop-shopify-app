import { Badge, Card, DataTable, Link, TextStyle } from "@shopify/polaris";
import { capitalize } from "../helpers";

export function AllLinksCard({ links }) {
  if (!links || !links.length) {
    return null;
  }

  const rows = links.map((link) => {
    return [
      <Link url={`/links/${link._id}`}>{link.name || link._id}</Link>,
      capitalize(link.type),
      link.active ? (
        <Badge status="success">Enabled</Badge>
      ) : (
        <TextStyle variation="subdued">Disabled</TextStyle>
      ),
      (link.analytics && link.analytics.clicks) || 0,
    ];
  });

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "numeric"]}
        headings={["Link", "Type", "Status", "Clicks"]}
        rows={rows}
      />
    </Card>
  );
}
