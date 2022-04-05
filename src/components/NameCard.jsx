import { Card, TextField } from "@shopify/polaris";

export function NameCard({ name, setName }) {
  return (
    <Card sectioned>
      <TextField
        requiredIndicator
        label="Link name"
        placeholder="BFCM Marketing Campaign"
        helpText="Internal only. Not shown to customers."
        value={name}
        onChange={(value) => setName(value)}
      />
    </Card>
  );
}
