import { useEffect, useState } from "react"
import {
    Banner,
    Button,
    Card,
    Stack,
    TextField
} from "@shopify/polaris"
import {
    ClipboardMinor
  } from "@shopify/polaris-icons"

export function CheckoutLinkCard({
    products,
}) {
    const [generatedUrl, setUrl] = useState("")

    // Compute url whenever a parameter changes
    useEffect(() => {
        // Return early if no products. Only required parameter
        if (!products || !products.length) {
            return;
        }

        setUrl(`dddd`)
    }, [products])

    return (
        <Card sectioned title="Checkout Link">
            {generatedUrl ? (
                <Banner>Please add a product in order to generate a link.</Banner>
            ) : (
                <Stack vertical>
                    <TextField 
                        value={generatedUrl} 
                        disabled
                        selectTextOnFocus
                    />
                    <Button fullWidth icon={ClipboardMinor}>Copy link</Button>
                </Stack>
            )}           
        </Card>
    )
}