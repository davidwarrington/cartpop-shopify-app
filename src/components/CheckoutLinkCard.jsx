import { useCallback, useEffect, useState } from "react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Link,
  Modal,
  Spinner,
  Stack,
  TextField,
} from "@shopify/polaris";
import { ClipboardMinor, ShopcodesMajor } from "@shopify/polaris-icons";
import { Toast } from "@shopify/app-bridge-react";
import QRCode from "react-qr-code";
import { gql, useQuery } from "@apollo/client";
import { getIdFromGid } from "../helpers";

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
  );
};

export function CheckoutLinkCard({ products, customer, order }) {
  const { error, data, loading } = useQuery(SHOP_DOMAIN_QUERY);

  const [showQrModal, setShowQrModal] = useState(false);
  const [generatedUrl, setUrl] = useState("");
  const [useAccessToken, setUseAccessToken] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [toast, setToast] = useState({});

  useEffect(() => {
    // Let's clear the access token whenever it's disabled
    if (useAccessToken === false) {
      setAccessToken("");
    }
  }, [useAccessToken]);

  // Compute url whenever a parameter changes
  useEffect(() => {
    // Return early if no products. Only required parameter
    if (!products || !products.length) {
      // Clear url if it's set
      generatedUrl && setUrl("");
      return;
    }

    // Get actual shop url from API
    const shopDomain =
      data?.shop?.primaryDomain?.host ||
      new URL(location).searchParams.get("shop");

    // Build Product String
    const productString = products
      .map((product) =>
        product.variants
          .map(
            (variant) =>
              `${getIdFromGid("ProductVariant", variant.id)}:${
                variant.quantity || 1
              }`
          )
          .join(",")
      )
      .join(",");

    // Build Remainder of Parameters
    let urlParameters = "";

    if (customer) {
      if (customer.email) {
        urlParameters += `&checkout[email]=${customer.email}`;
      }

      if (customer.first_name) {
        urlParameters += `&checkout[shipping_address][first_name]=${customer.first_name}`;
      }

      if (customer.last_name) {
        urlParameters += `&checkout[shipping_address][last_name]=${customer.last_name}`;
      }

      if (customer.address1) {
        urlParameters += `&checkout[shipping_address][address1]=${customer.address1}`;
      }

      if (customer.address2) {
        urlParameters += `&checkout[shipping_address][address2]=${customer.address2}`;
      }

      if (customer.city) {
        urlParameters += `&checkout[shipping_address][city]=${customer.city}`;
      }

      if (customer.province) {
        urlParameters += `&checkout[shipping_address][province]=${customer.province}`;
      }

      if (customer.zipcode) {
        urlParameters += `&checkout[shipping_address][zip]=${customer.zipcode}`;
      }
    }

    if (order) {
      if (order.discountCode) {
        urlParameters += `&discount=${order.discountCode}`;
      }

      if (order.note) {
        urlParameters += `&note=${encodeURIComponent(order.note)}`;
      }

      if (order.ref) {
        urlParameters += `&ref=${encodeURIComponent(order.ref)}`;
      }

      if (order.useShopPay) {
        urlParameters += `&payment=shop_pay`;
      }

      if (order.attributes && order.attributes.length) {
        urlParameters += `&${order.attributes
          .map(
            (attribute) =>
              attribute.label &&
              `attributes[${attribute.label}]=${attribute.value}`
          )
          .join("&")}`;
      }
    }

    if (accessToken) {
      urlParameters += `&access_token=${accessToken}`;
    }

    shopDomain &&
      setUrl(
        `https://${shopDomain.replace(
          "https://",
          ""
        )}/cart/${productString}?${urlParameters}`
      );
  }, [products, customer, order, accessToken]);

  const handleToggleQRModal = useCallback(() => {
    setShowQrModal((visibility) => !visibility);
  }, []);

  const handleDownloadQrCode = useCallback(
    (fileType) => {
      const svg = document.getElementById("qr-code-link");
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const dataImageUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

      const img = new Image();
      img.src = dataImageUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const downloadLink = document.createElement("a");
        downloadLink.download = "QRCode";
        if (fileType === "svg") {
          downloadLink.href = `${dataImageUrl}`;
        } else {
          const pngFile = canvas.toDataURL("image/png");
          downloadLink.href = `${pngFile}`;
        }
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
    },
    [generatedUrl]
  );

  const handleCopyCheckoutLink = useCallback((e) => {
    const textarea = document.getElementById("generated-link");

    if (!textarea) {
      setToast({
        show: true,
        content: "Failed to copy link. Please try again",
        error: true,
      });
      return;
    }

    // Select the text link contents and copy to clipboard
    textarea.select();
    document.execCommand("copy");

    // Show success message
    setToast({
      show: true,
      content: "Copied to clipboard",
    });
  }, []);

  // Show loading indicator while we fetch shop domain
  if (loading) {
    return (
      <CardContainer sectioned>
        <Spinner />
      </CardContainer>
    );
  }

  return (
    <>
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      <CardContainer>
        <Card.Section>
          <Stack vertical>
            {!generatedUrl ? (
              <Banner>Please add a product in order to generate a link.</Banner>
            ) : (
              <Stack vertical>
                <TextField
                  id="generated-link"
                  label="Generated checkout link"
                  labelHidden
                  multiline={3}
                  value={generatedUrl}
                  //disabled
                  selectTextOnFocus
                />
                <Stack vertical spacing="tight">
                  <Button
                    primary
                    fullWidth
                    icon={ClipboardMinor}
                    onClick={handleCopyCheckoutLink}
                  >
                    Copy link
                  </Button>
                  <Button
                    icon={ShopcodesMajor}
                    fullWidth
                    onClick={handleToggleQRModal}
                  >
                    View QR Code
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
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
      <Stack vertical alignment="center">
        <Stack.Item />
        <Stack.Item>
          Learn more about{" "}
          <Link
            external
            url="https://help.shopify.com/en/manual/products/details/checkout-link"
          >
            checkout links
          </Link>
        </Stack.Item>
      </Stack>
      <Modal
        open={showQrModal}
        onClose={handleToggleQRModal}
        title="QR Code"
        secondaryActions={{
          content: "Close",
          onAction: handleToggleQRModal,
        }}
      >
        <Modal.Section subdued>
          <Stack distribution="center">
            <p>
              Leverage QR Codes for repeat orders and marketing campaigns to
              enable true one click buying experiences!
            </p>
            <br />
          </Stack>
          <Stack vertical alignment="center">
            <Card>
              <Card.Section>
                <QRCode id="qr-code-link" value={generatedUrl} />
              </Card.Section>
              <Card.Section>
                <ButtonGroup fullWidth>
                  <Button
                    download
                    primary
                    onClick={() => handleDownloadQrCode("png")}
                  >
                    Download PNG
                  </Button>
                  <Button
                    download
                    primary
                    onClick={() => handleDownloadQrCode("svg")}
                  >
                    Download SVG
                  </Button>
                </ButtonGroup>
              </Card.Section>
            </Card>
          </Stack>
        </Modal.Section>
      </Modal>
    </>
  );
}
