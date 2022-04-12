import { Button, Card, Heading, Stack } from "@shopify/polaris";
import { useShop } from "../core/ShopProvider";

export function RequireSubscription({
  title = "Please upgrade to view this content",
  content = null,
  buttonLabel = "Learn more about Pro",
  hidden = false,
  children,
}) {
  const { shopData } = useShop();

  if (!shopData.subscription) {
    if (hidden) {
      return null;
    }

    return (
      <Card sectioned>
        <Stack vertical>
          {content ? content : <Heading>{title}</Heading>}
          <Button primary url="/settings/billing">
            {buttonLabel}
          </Button>
        </Stack>
      </Card>
    );
  }

  return children;
}
