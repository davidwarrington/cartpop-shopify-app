import {
  Card,
  SkeletonPage,
  SkeletonBodyText,
  Layout,
  SkeletonDisplayText,
} from "@shopify/polaris";

export function SkeletonLinkPage() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section twoThird>
          <Card sectioned title={<SkeletonDisplayText />}>
            <SkeletonBodyText />
          </Card>
          <Card sectioned title={<SkeletonDisplayText />}>
            <SkeletonBodyText />
          </Card>
          <Card sectioned title={<SkeletonDisplayText />}>
            <SkeletonBodyText />
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section>
              <SkeletonBodyText />
            </Card.Section>
            <Card.Section subdued>
              <SkeletonBodyText />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
