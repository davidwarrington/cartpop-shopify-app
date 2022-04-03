import { useCallback, useEffect, useState } from "react"
import {
    Banner,
    Button,
    Card,
    Checkbox,
    FormLayout,
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

const CardContainer = ({ sectioned, children }) => {
    return (
        <Card sectioned={sectioned} title="Checkout Link">
            {children}
        </Card>
    )
}

export function CheckoutLinkCard({
    products,
}) {
    const { error, data, loading } = useQuery(SHOP_DOMAIN_QUERY)
    const [generatedUrl, setUrl] = useState("")
    const [useAccessToken, setUseAccessToken] = useState(false)
    const [accessToken, setAccessToken] = useState("")

    useEffect(() => {
        // Let's clear the access token whenever it's disabled
        if (useAccessToken === false) {
            setAccessToken("")
        }
    }, [useAccessToken])

    // Compute url whenever a parameter changes
    useEffect(() => {
        // Return early if no products. Only required parameter
        if (!products || !products.length) {
            return;
        }

        // Get actual shop url from API
        const shopDomain = data?.shop?.primaryDomain?.host || new URL(location).searchParams.get("shop")

        // Build parameters
        // `${variants.map(variant => `${variant.id}:${variant.quantity}`).join(",")}?`
        const productString = products.map(product => product.id).join(",")

        setUrl(`https://${shopDomain.replace("https://", "")}/cart?${productString}`)
    }, [products])

    // Show loading indicator while we fetch shop domain
    if (loading) {
        return (
            <CardContainer sectioned>
                <Spinner />
            </CardContainer>
        )
    }

    return (
        <CardContainer>
            <Card.Section>
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
            </Card.Section>
            <Card.Section title="Advanced settings" subdued>
                <FormLayout>
                    <Checkbox 
                        label="Use access token" 
                        checked={useAccessToken}
                        onChange={(checked) => setUseAccessToken(checked)} 
                    />
                    {useAccessToken ? (
                        <TextField 
                            type="text" 
                            label="Access token" 
                            labelHidden 
                            helpText="Attributes order to a specific sales channel. This is not normally needed."
                            value={accessToken}
                            onChange={(newValue) => setAccessToken(newValue)} 
                        />
                    ) : null}
                </FormLayout>
            </Card.Section>         
        </CardContainer>
    )
}