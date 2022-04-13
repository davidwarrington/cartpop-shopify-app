import { Card, TextField } from "@shopify/polaris";

export function NameCard({ name }) {
  return (
    <Card sectioned>
      <TextField
        label="Link name"
        placeholder="BFCM Marketing Campaign"
        helpText="Internal only. Not shown to customers."
        autoComplete="off"
        {...name}
      />
    </Card>
  );
}
