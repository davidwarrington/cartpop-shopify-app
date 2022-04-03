import { Button, Card, Heading, Stack, Subheading, TextField, TextStyle, Thumbnail } from "@shopify/polaris"
import { RemoveProductMajor } from "@shopify/polaris-icons"

export function ProductList({
    products,
    handleVariantRemove,
    handleVariantQuantity,
    togglePickerVisibility,
}) {
    // Return message when no product is selected
    if (!products || !products.length) {
        return (
            <Stack vertical>
                <TextStyle variation="subdued">No products selected.</TextStyle>
                <Button primary onClick={togglePickerVisibility}>Add product</Button>
            </Stack>
        )
    }

    // Return product list
    return products.map((product, productIndex) => product.variants.map((variant, variantIndex) => (
        <Card.Subsection key={variant.id}>
            <Stack distribution="equalSpacing" wrap={false}>
                <Stack.Item>
                    <Stack>
                        {product.images && product.images.length ? (
                            <Thumbnail size="medium" source={product.images[0].originalSrc} /> 
                        ): null}
                        <Stack vertical spacing="extraTight">
                            <TextStyle variation="strong">{product.title}</TextStyle>
                            <Subheading><TextStyle variation="subdued">{variant.title}</TextStyle></Subheading>
                            <TextStyle variation="subdued">{variant.sku}</TextStyle>
                            <TextField 
                                label="Quantity" 
                                type="number" 
                                labelHidden 
                                min={1}
                                value={variant.quantity || "1"}
                                onChange={(newQuantity) => handleVariantQuantity(productIndex, variantIndex, newQuantity)}
                            />
                        </Stack>
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    <Stack>
                        <Button 
                            //icon={RemoveProductMajor} 
                            onClick={() => handleVariantRemove(productIndex, variantIndex)}
                            accessibilityLabel="Remove product"
                        >Remove</Button>
                    </Stack>
                </Stack.Item>
            </Stack>
        </Card.Subsection>
    )))
}