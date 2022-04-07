import { useEffect, useState } from "react";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Layout,
  Link,
  TextStyle,
  Page,
  Spinner,
  Stack,
} from "@shopify/polaris";
import { useAppBridge, TitleBar } from "@shopify/app-bridge-react";

import { PAGE_STATES } from "../constants";
import cashRegister from "../assets/cash_register_128.png";
import { AllLinksCard } from "../components/AllLinksTable";
import { userLoggedInFetch } from "../helpers";

const Home = () => {
  const app = useAppBridge();

  const [pageState, setPageState] = useState(PAGE_STATES.loading);
  const [links, setLinks] = useState([]);

  async function getLinks() {
    const fetchFunction = userLoggedInFetch(app);
    const apiRes = await fetchFunction("/api/links").then((res) => res.json());

    if (!apiRes) {
      // TODO: fail
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Set links
    const links = apiRes.links;
    setLinks(links);
    setPageState(PAGE_STATES.idle);
  }

  useEffect(() => {
    getLinks();
  }, []);

  if (pageState === PAGE_STATES.loading) {
    return (
      <Page>
        <Spinner accessibilityLabel="Loading links" />
      </Page>
    );
  }

  return (
    <Page
      title={links && links.length ? "Dashboard" : ""}
      primaryAction={
        links && links.length
          ? {
              content: "Create link",
              url: "/links/new",
            }
          : null
      }
    >
      {/* Empty TitleBar to reset when navigating from other pages like Settings */}
      <TitleBar />
      <Layout>
        {links && links.length ? (
          <Layout.Section fullWidth>
            <AllLinksCard links={links} />
          </Layout.Section>
        ) : (
          <Layout.Section fullWidth>
            <Stack vertical spacing="tight">
              <Card>
                <EmptyState
                  image={cashRegister}
                  heading="Create a checkout link to get started"
                  action={{
                    content: "Create new checkout link",
                    url: "/links/new",
                  }}
                >
                  <p>
                    Create and manage one click checkout links that
                    automatically add products to a customer's cart and navigate
                    directly to checkout.
                  </p>
                </EmptyState>
              </Card>
              <Stack distribution="center">
                <TextStyle>
                  Learn more about{" "}
                  <Link
                    external
                    url="https://help.shopify.com/en/manual/products/details/checkout-link"
                  >
                    checkout links
                  </Link>
                </TextStyle>
              </Stack>
            </Stack>
          </Layout.Section>
        )}
        <Layout.Section>
          <br />
          <Banner>
            Made in New York City by{" "}
            <Link url="https://www.checkoutpromotions.com" external>
              Checkout Promotions
            </Link>
            .
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
