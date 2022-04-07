import { useCallback, useEffect, useState } from "react";
import {
  Features,
  Group,
  Scanner,
  Pos,
  Toast,
  Cart,
  Error,
} from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  Card,
  DisplayText,
  Heading,
  Page,
  Spinner,
  Stack,
  Subheading,
  TextField,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import { userLoggedInFetch } from "../helpers";
import { ShopcodesMajor } from "@shopify/polaris-icons";

const PosPage = () => {
  const app = useAppBridge();
  const pos = Pos.create(app);
  const cart = Cart.create(app);

  const fetchFunction = userLoggedInFetch(app);

  const [logOutput, setLogOutput] = useState("Click a button above!");
  const [scannerPayload, setPayload] = useState(null);
  const [linkAlias, setLinkAlias] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function featuresAvailable() {
    alert("featuresAvailable");

    try {
      app.featuresAvailable().then(function (featureState) {
        setLogOutput(featureState);
      });
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }

  function requestScanner() {
    const scannerRequest = Features.create(app);

    scannerRequest.subscribe(
      Features.Action.REQUEST_UPDATE,
      function (payload) {
        setLogOutput(payload);
      }
    );

    scannerRequest.dispatch(Features.Action.REQUEST, {
      feature: Group.Scanner,
      action: Scanner.Action.OPEN_CAMERA,
    });

    setLogOutput("Requesting scanner...");
  }

  function useScanner() {
    const scanner = Scanner.create(app);
    scanner.subscribe(Scanner.Action.CAPTURE, function (payload) {
      setLogOutput(payload.data.scanData);
      setPayload(payload.data.scanData);
    });
    scanner.dispatch(Scanner.Action.OPEN_CAMERA);
  }

  const fetchLink = async () => {
    setLoading(true);

    // TODO: add new api route to fetch by alias for POS links

    const linkRes = await fetchFunction(
      `/api/links/624e32f6a80ad32e8679586f`
    ).then((res) => res.json());

    if (linkRes) {
      setLink(linkRes);
    }

    setLoading(false);
  };

  const handleAddToCart = useCallback(() => {
    app.error(function (data) {
      alert("ERROR");
      alert(JSON.stringify(data));
    });

    app.featuresAvailable([Group.Cart]).then(function (state) {
      setSubmitting(true);

      // Clear cart
      //cart.dispatch(Cart.Action.CLEAR);

      // Add customer
      if (
        link.customer &&
        (link.customer.first_name ||
          link.customer.last_name ||
          link.customer.email)
      ) {
        // Create customer payload
        const customerPayload = {
          email: link.customer.email || "",
          firstName: link.customer.first_name,
          lastName: link.customer.last_name || "",
          note: link.name || "",
        };
        // Add customer
        cart.dispatch(Cart.Action.SET_CUSTOMER, {
          data: customerPayload,
        });
      }

      // Add Discount
      // if (link.order && link.order.discountCode) {
      //     const discountPayload = {
      //         discountDescription: "",
      //         discountCode: link.order.discountCode,
      //     }

      //     // Set discount
      //     cart.dispatch(Cart.Action.SET_DISCOUNT, {
      //         data: discountPayload
      //     });
      // }

      // Subscribe to updates so that we can show success
      const unsubscribeCart = cart.subscribe(
        Cart.Action.UPDATE,
        function (payload) {
          alert("We added to cart!");

          //alert(JSON.stringify(payload));

          //console.log('[Client] cart update', payload);

          const toastOptions = {
            message: "Cart updated",
            duration: 5000,
            isError: false,
          };
          const toastSuccess = Toast.create(app, toastOptions);
          toastSuccess.dispatch(Toast.Action.SHOW);

          pos.dispatch(Pos.Action.CLOSE);
          unsubscribeCart();
        }
      );

      // Create payload
      const variant = link?.products[0]?.variants[0];

      if (variant) {
        // Add Variant
        cart.dispatch(Cart.Action.ADD_LINE_ITEM, {
          data: {
            variantId: parseInt(
              variant.id.replace("gid://shopify/ProductVariant/", "")
            ),
            quantity: variant.quantity ? parseInt(variant.quantity) : 1,
          },
        });
      }
    });
  }, [link]);

  useEffect(() => {
    // Hide Beacon on POS
    Beacon && Beacon("config", { hideFABOnMobile: true });
  }, []);

  useEffect(() => {
    if (!scannerPayload) {
      return null;
    }

    const scannedAlias = scannerPayload.replace(
      "https://orders-demo.myshopify.com/a/cart/",
      ""
    );
    setLinkAlias(scannedAlias);
    // TODO: fetch link using alias
    fetchLink(scannedAlias);
  }, [scannerPayload]);

  return (
    <Page>
      <Card sectioned>
        <Stack vertical>
          <ButtonGroup fullWidth>
            {/* <Button onClick={featuresAvailable}>Features avaiable</Button>
                        <Button onClick={requestScanner}>Request Scanner</Button> */}
            <Button
              size="large"
              onClick={useScanner}
              icon={ShopcodesMajor}
              fullWidth
            >
              Scan Checkout Link QR Code
            </Button>
          </ButtonGroup>
        </Stack>
      </Card>
      {/* <Card sectioned subdued title="Output">
                        {JSON.stringify(logOutput)}
                    </Card> */}
      {linkAlias ? (
        <Card>
          <Card.Section subdued>
            <Stack vertical spacing="extraTight">
              <Heading>Checkout link</Heading>
              {link ? (
                <TextStyle variation="subdued">
                  {link.name || link._id}
                </TextStyle>
              ) : null}
            </Stack>
          </Card.Section>
          {loading ? (
            <Card.Section>
              <Spinner />
            </Card.Section>
          ) : null}
          {link ? (
            <>
              <Card.Section title="Customer information">
                {link.customer ? (
                  <Card.Subsection>
                    <Stack vertical spacing="extraTight">
                      {link.customer.first_name || link.customer.last_name ? (
                        <Stack.Item>
                          {link.customer.first_name} {link.customer.last_name}
                        </Stack.Item>
                      ) : null}
                      {link.customer.email ? (
                        <Stack.Item>{link.customer.email}</Stack.Item>
                      ) : null}
                    </Stack>
                  </Card.Subsection>
                ) : (
                  <TextStyle variation="subdued">
                    No customer specific information included.
                  </TextStyle>
                )}
              </Card.Section>
              <Card.Section title="Products">
                {link.products &&
                  link.products.length &&
                  link.products.map((product) =>
                    product.variants.map((variant, variantIndex) => (
                      <Card.Subsection key={variant.id}>
                        <Stack vertical>
                          <Stack wrap={false}>
                            {product.images && product.images.length ? (
                              <Thumbnail
                                size="large"
                                source={product.images[0].originalSrc}
                              />
                            ) : null}
                            <Stack.Item fill>
                              <Stack vertical>
                                <TextStyle variation="strong">
                                  {product.name}
                                </TextStyle>
                                <Subheading>
                                  <TextStyle variation="subdued">
                                    {variant.title}
                                  </TextStyle>
                                </Subheading>
                                <TextStyle variation="subdued">
                                  {variant.sku}
                                </TextStyle>
                              </Stack>
                            </Stack.Item>
                          </Stack>
                          <Stack wrap={false}>
                            <Stack.Item fill>
                              <TextField
                                label="Quantity"
                                type="number"
                                labelHidden
                                min={1}
                                value={variant.quantity || "1"}
                                // TODO: change handler
                              />
                            </Stack.Item>
                            <Button>Remove</Button>
                          </Stack>
                        </Stack>
                      </Card.Subsection>
                    ))
                  )}
              </Card.Section>
              {link.order && link.order.discountCode ? (
                <Card.Section title="Discount code">
                  {link.order.discountCode}
                </Card.Section>
              ) : null}
              <Card.Section>
                <Button
                  fullWidth
                  loading={submitting}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </Card.Section>
            </>
          ) : null}
        </Card>
      ) : null}
    </Page>
  );
};

export default PosPage;
