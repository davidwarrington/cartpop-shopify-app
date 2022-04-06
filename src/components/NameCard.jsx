import { Card, TextField } from "@shopify/polaris";

export function NameCard({ id, name, setName }) {
  return (
    <Card sectioned>
      <TextField
        label="Link name"
        placeholder="BFCM Marketing Campaign"
        helpText="Internal only. Not shown to customers."
        value={name || id}
        onChange={(value) => setName(value)}
        autoComplete="off"
      />
    </Card>
  );
}
