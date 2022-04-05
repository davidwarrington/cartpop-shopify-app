import { Card, DataTable, Link } from "@shopify/polaris";

export function AllLinksCard({ links }) {
  if (!links || !links.length) {
    return null;
  }

  const rows = links.map((link) => {
    return [
      <Link url={`/links/${link._id}`}>{link.name || link._id}</Link>,
      link.type,
      link.isActive ? "Enabled" : "Disabled",
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
