import { Badge, Card, DataTable, Link, TextStyle } from "@shopify/polaris";

export function AllLinksCard({ links }) {
  if (!links || !links.length) {
    return null;
  }

  const rows = links.map((link) => {
    return [
      <Link url={`/links/${link._id}`}>{link.name || link._id}</Link>,
      link.type,
      link.active ? (
        <Badge status="success">Enabled</Badge>
      ) : (
        <TextStyle variation="subdued">Disabled</TextStyle>
      ),
    ];
  });

  return (
    <Card>
      <DataTable
        columnContentTypes={["text", "text", "text"]}
        headings={["Link", "Type", "Status"]}
        rows={rows}
      />
    </Card>
  );
}
