import { Badge, Card, DataTable, Link, TextStyle } from "@shopify/polaris";
import { capitalize } from "../helpers";

export function AllLinksCard({ links }) {
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

    return [
      <Link url={`/links/${link._id}`}>{link.name || link._id}</Link>,
      capitalize(link.type),
      link.active ? (
        <Badge status="success">Enabled</Badge>
      ) : (
        <TextStyle variation="subdued">Disabled</TextStyle>
      ),
      clicks,
      scans,
    ];
  });

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text", "numeric", "numeric"]}
        headings={["Link", "Type", "Status", "Clicks", "Scans"]}
        rows={rows}
      />
    </Card>
  );
}
