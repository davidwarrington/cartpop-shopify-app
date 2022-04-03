import { useEffect, useState } from "react"
import {
    Banner,
    Button,
    Card,
    Spinner,
    Stack,
    TextField
} from "@shopify/polaris"
import {
    ClipboardMinor
  } from "@shopify/polaris-icons"
import { gql, useQuery } from "@apollo/client"

const SHOP_DOMAIN_QUERY = gql`
    query shopInfo {
        shop {
            primaryDomain {
                host
            }
        }
    }
`;

const CardContainer = ({ children }) => {
    return (
        <Card sectioned title="Checkout Link">
            {children}
        </Card>
    )
}

export function CheckoutLinkCard({
    products,
}) {
    const { error, data, loading } = useQuery(SHOP_DOMAIN_QUERY)
    const [generatedUrl, setUrl] = useState("")

    // Compute url whenever a parameter changes
    useEffect(() => {
        // Return early if no products. Only required parameter
        if (!products || !products.length) {
            return;
        }

        // Get actual shop url from API
        const shopDomain = data?.shop?.primaryDomain?.host || new URL(location).searchParams.get("shop")

        setUrl(`${shopDomain}/`)
    }, [products])

    // Show loading indicator while we fetch shop domain
    if (loading) {
        return (
            <CardContainer>
                <Spinner />
            </CardContainer>
        )
    }

    return (
        <CardContainer>
            {!generatedUrl ? (
                <Banner>Please add a product in order to generate a link.</Banner>
            ) : (
                <Stack vertical>
                    <TextField 
                        label="Generated checkout link"
                        labelHidden
                        value={generatedUrl} 
                        disabled
                        selectTextOnFocus
                    />
                    <Button fullWidth icon={ClipboardMinor}>Copy link</Button>
                </Stack>
            )}           
        </CardContainer>
    )
}