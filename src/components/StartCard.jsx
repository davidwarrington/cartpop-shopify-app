import {
  Card,
  Heading,
  Image,
  Link,
  Stack,
  TextContainer,
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

export function StartCard() {
  return (
    <Card sectioned>
      <Stack
        wrap={false}
        spacing="extraTight"
        distribution="trailing"
        alignment="center"
      >
        <Stack.Item fill>
          <TextContainer spacing="loose">
            <Heading>Nice work on building a Shopify app 🎉</Heading>
            <p>
              Your app is ready to explore! It contains everything you need to
              get started including the{" "}
              <Link url="https://polaris.shopify.com/" external>
                Polaris design system
              </Link>
              ,{" "}
              <Link url="https://shopify.dev/api/admin-graphql" external>
                Shopify Admin API
              </Link>
              , and{" "}
              <Link url="https://shopify.dev/apps/tools/app-bridge" external>
                App Bridge
              </Link>{" "}
              UI library and components.
            </p>
            <p>
              Ready to go? Start populating your app with some sample products
              to view and test in your store.{" "}
            </p>
            <p>
              Learn more about building out your app in{" "}
              <Link
                url="https://shopify.dev/apps/getting-started/add-functionality"
                external
              >
                this Shopify tutorial
              </Link>{" "}
              📚{" "}
            </p>
          </TextContainer>
        </Stack.Item>
        <Stack.Item>
          <div style={{ padding: "0 20px" }}>
            <Image
              source={trophyImgUrl}
              alt="Nice work on building a Shopify app"
              width={120}
            />
          </div>
        </Stack.Item>
      </Stack>
    </Card>
  );
}
