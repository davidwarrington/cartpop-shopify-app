import {
  Button,
  Card,
  Layout,
  Stack,
  TextStyle,
  Page,
  Heading,
  RadioButton,
  TextContainer,
  FormLayout,
  Scrollable,
  Badge,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

const Settings = () => {
  const navigate = useNavigate();

  // const primaryAction = { content: "Foo", url: "/foo" };
  // const secondaryActions = [{ content: "Bar", url: "/bar", loading: true }];
  // const actionGroups = [
  //   { title: "Baz", actions: [{ content: "Baz", url: "/baz" }] },
  // ];

  return (
    <Page breadcrumbs={[{ content: "Home", url: "/" }]} title="Settings">
      <TitleBar
        title="Settings"
        // primaryAction={primaryAction}
        // secondaryActions={secondaryActions}
        // actionGroups={actionGroups}
      />
      <Layout>
        <Layout.AnnotatedSection
          title={
            <>
              Reorder links <Badge>Disabled</Badge>
            </>
          }
          description="Allow customers to easily reorder products based on their order history"
        >
          <Card>
            <Card.Section>
              <Stack>
                <TextStyle>
                  In order for reorder links to work, you must first request
                  access.
                </TextStyle>
                <Button primary>Enable permissions</Button>
              </Stack>
            </Card.Section>
          </Card>
          <Card>
            <Card.Section>
              <Stack vertical spacing="extraTight">
                <Heading>Restricted products</Heading>
                <TextStyle>
                  Define products that customers can not reorder. Any orders
                  that have these products will be excluded from the reorder
                  buying experience.
                </TextStyle>
              </Stack>
            </Card.Section>
            {false ? (
              <Scrollable
                shadow
                focusable
                //style={{height: false ? "250px" : "", padding: "1.5rem"}}
              >
                <Card.Subsection>
                  <TextStyle variation="subdued">
                    No products selected.
                  </TextStyle>
                </Card.Subsection>
                <Card.Subsection>
                  <Button>Add products</Button>
                </Card.Subsection>
              </Scrollable>
            ) : (
              <Card.Section>
                <Stack vertical>
                  <TextStyle variation="subdued">
                    No products selected.
                  </TextStyle>
                  <Button>Add products</Button>
                </Stack>
              </Card.Section>
            )}
            <Card.Section subdued>
              <FormLayout>
                <TextContainer>
                  What action should we take if all products on a previous order
                  are excluded from reordering?
                </TextContainer>
                <RadioButton label="Redirect to homepage" />
                <RadioButton label="Show error message" />
              </FormLayout>
            </Card.Section>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title={
            <>
              Shopify POS <Badge>Disabled</Badge>
            </>
          }
          description="Allow customers to present links via QR Codes that you can scan with the shopify POS"
        >
          <Card>
            <Card.Section>
              <Stack>
                <TextStyle>
                  In order for the Shopify POS integration to work, you must
                  first request access.
                </TextStyle>
                <Button primary>Enable permissions</Button>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default Settings;
