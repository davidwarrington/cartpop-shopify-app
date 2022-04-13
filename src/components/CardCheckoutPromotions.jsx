import {
  Card,
  Heading,
  Link,
  Stack,
  Subheading,
  TextContainer,
} from "@shopify/polaris";

export function CardCheckoutPromotions() {
  return (
    <Card
      title={
        <Stack vertical spacing="extraTight">
          <Heading>You're probably leaving free money on the table.</Heading>
          <TextContainer>
            We've developed one of the top post purchase apps to easily increase
            your average order value. Used by over 1600 Shopify merchants like
            yourself.
          </TextContainer>
        </Stack>
      }
    >
      <Card.Section>
        <Stack vertical spacing="tight">
          <Stack>
            <Image source="https://cdn.shopify.com/app-store/listing_images/e010202d5c2e2eb1c766f8cf8c78c52b/icon/CJqIi9CtyPYCEAE=.png?height=60&width=60" />
            <Stack vertical spacing="none">
              <Heading>
                <Link
                  plain
                  monochrome
                  external
                  url="https://apps.shopify.com/checkout-promotions"
                >
                  Checkout Promotions
                </Link>
              </Heading>
              <TextContainer>One Click Post Purchase Upsells</TextContainer>
              <Stack alignment="center" spacing="tight">
                {/* <Icon source={StarFilledMinor} color="warning" /> */}
                <Subheading>
                  <TextStyle variation="positive">
                    Rated a perfect 5.0/5.0 on the Shopify App Store
                  </TextStyle>
                </Subheading>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  );
}
