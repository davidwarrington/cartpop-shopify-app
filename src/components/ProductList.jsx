import { Button, Card, Heading, Stack, Subheading, TextStyle, Thumbnail } from "@shopify/polaris"

export function ProductList({
    products,
    handleVariantRemove,
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
            <Stack alignment="center" distribution="fillEvenly">
                <Stack.Item>
                    <Stack alignment="center">
                        {product.images && product.images.length ? (
                            <Thumbnail source={product.images[0].originalSrc} /> 
                        ): null}
                        <Stack vertical spacing="extraTight">
                            <Heading>{product.title}</Heading>
                            <Subheading><TextStyle variation="subdued">{variant.title}</TextStyle></Subheading>
                        </Stack>
                    </Stack>
                </Stack.Item>
                <Button onClick={() => handleVariantRemove(productIndex, variantIndex)}>Remove</Button>
            </Stack>
        </Card.Subsection>
    )))
}