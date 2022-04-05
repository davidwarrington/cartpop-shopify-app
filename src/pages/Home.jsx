import { useEffect, useState } from "react";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Layout,
  Link,
  Page,
  Spinner,
} from "@shopify/polaris";
import { useAppBridge, TitleBar } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

import { PAGE_STATES } from "../constants";
import cashRegister from "../assets/cash_register_128.png";
import { AllLinksCard } from "../components/AllLinksTable";

const Home = () => {
  const app = useAppBridge();

  const [pageState, setPageState] = useState(PAGE_STATES.loading);
  const [links, setLinks] = useState([]);

  async function getLinks() {
    const fetchFunction = authenticatedFetch(app);
    const apiRes = await fetchFunction("/api/links").then((res) => res.json());
    console.log("apiRes links", apiRes.links);

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
    return <Spinner accessibilityLabel="Loading links" />;
  }

  return (
    <Page>
      {/* Empty TitleBar to reset when navigating from other pages like Settings */}
      <TitleBar />
      <Layout>
        {links && links.length ? (
          <Layout.Section fullWidth>
            <AllLinksCard links={links} />
          </Layout.Section>
        ) : (
          <Layout.Section fullWidth>
            <Card>
              <EmptyState
                image={cashRegister}
                heading="Create checkout links"
                action={{
                  content: "Create new link",
                  url: "/links/new",
                }}
              >
                <p>
                  Create and manage one click checkout links that automatically
                  add products to a customer's cart and navigate directly to
                  checkout.
                </p>
              </EmptyState>
            </Card>
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
