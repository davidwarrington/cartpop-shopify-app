import { useCallback, useEffect, useState } from "react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  FormLayout,
  Heading,
  Icon,
  Modal,
  Popover,
  Spinner,
  Stack,
  Subheading,
  Tabs,
  TextContainer,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import {
  CancelSmallMinor,
  CircleAlertMajor,
  ClipboardMinor,
  EditMinor,
  ShopcodesMajor,
  ThumbsUpMajor,
  TickSmallMinor,
} from "@shopify/polaris-icons";
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

const CardContainer = ({ showTitle, sectioned, children }) => (
  <Card sectioned={sectioned} title={showTitle ? "Checkout Link" : ""}>
    {children}
  </Card>
);

const QRCodeSection = ({ generatedUrl, handleDownloadQrCode }) => (
  <>
    <Card.Subsection>
      <Stack distribution="center">
        <div
          style={{
            padding: "20px",
          }}
        >
          <QRCode id="qr-code-link" value={generatedUrl} size="150" muted />
        </div>
      </Stack>
    </Card.Subsection>
    <Card.Subsection>
      <ButtonGroup fullWidth>
        <Button download primary onClick={() => handleDownloadQrCode("png")}>
          Download PNG
        </Button>
        <Button download primary onClick={() => handleDownloadQrCode("svg")}>
          Download SVG
        </Button>
      </ButtonGroup>
    </Card.Subsection>
  </>
);

export function CheckoutLinkCard({
  link,
  alias,
  products,
  customer,
  order,
  accessToken,
}) {
  const { error, data, loading } = useQuery(SHOP_DOMAIN_QUERY);

  // Get actual shop url from API
  const shopDomain =
    data?.shop?.primaryDomain?.host ||
    new URL(location).searchParams.get("shop");

  const [showQrModal, setShowQrModal] = useState(false);
  const [generatedUrl, setUrl] = useState("");
  const [useAccessToken, setUseAccessToken] = useState(
    accessToken.value ? true : false
  );
  const [toast, setToast] = useState({});
  const [selectedIndex, setIndex] = useState(0);

  const [popoverActive, setPopoverActive] = useState(true);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  useEffect(() => {
    // Let's clear the access token whenever it's disabled
    if (useAccessToken === false) {
      accessToken.onChange("");
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

    const hasCustomerInfo =
      customer &&
      Object.keys(customer).some((key) =>
        customer[key].value || customer[key].checked ? true : false
      );

    if (hasCustomerInfo) {
      if (customer.email && customer.email.value) {
        urlParameters += `&checkout[email]=${customer.email.value}`;
      }

      if (customer.first_name && customer.first_name.value) {
        urlParameters += `&checkout[shipping_address][first_name]=${customer.first_name.value}`;
      }

      if (customer.last_name && customer.last_name.value) {
        urlParameters += `&checkout[shipping_address][last_name]=${customer.last_name.value}`;
      }

      if (customer.address1 && customer.address1.value) {
        urlParameters += `&checkout[shipping_address][address1]=${customer.address1.value}`;
      }

      if (customer.address2 && customer.address2.value) {
        urlParameters += `&checkout[shipping_address][address2]=${customer.address2.value}`;
      }

      if (customer.city && customer.city.value) {
        urlParameters += `&checkout[shipping_address][city]=${customer.city.value}`;
      }

      if (customer.province && customer.province.value) {
        urlParameters += `&checkout[shipping_address][province]=${customer.province.value}`;
      }

      if (customer.zipcode && customer.zipcode.value) {
        urlParameters += `&checkout[shipping_address][zip]=${customer.zipcode.value}`;
      }
    }

    const hasOrderInfo =
      order &&
      Object.keys(order).some((key) =>
        order[key].value || order[key].checked ? true : false
      );

    if (hasOrderInfo) {
      if (order.discountCode && order.discountCode.value) {
        urlParameters += `&discount=${order.discountCode.value}`;
      }

      if (order.note && order.note.value) {
        urlParameters += `&note=${encodeURIComponent(order.note.value)}`;
      }

      if (order.ref && order.ref.value) {
        urlParameters += `&ref=${encodeURIComponent(order.ref.value)}`;
      }

      if (order.useShopPay && order.useShopPay.checked) {
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

    if (accessToken && accessToken.value) {
      urlParameters += `&access_token=${accessToken.value}`;
    }

    shopDomain &&
      setUrl(
        `https://${shopDomain.replace(
          "https://",
          ""
        )}/cart/${productString}?${urlParameters}`
      );
  }, [products, customer, order, accessToken]);

  const handleSelectTab = useCallback((index) => setIndex(index), []);

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

  const handleCopyCheckoutLink = useCallback(() => {
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

  const handleCopyAliasLink = useCallback(() => {
    const textarea = document.getElementById("alias-link");

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
      <CardContainer showTitle={link ? false : true}>
        {link ? (
          <Tabs
            fitted
            tabs={[
              { id: "alias", content: "Short link" },
              { id: "raw", content: "Checkout link" },
            ]}
            selected={selectedIndex}
            onSelect={handleSelectTab}
          />
        ) : null}
        {link && selectedIndex == 0 ? (
          <>
            <Card.Section subdued title="Supported features">
              <Stack spacing="tight">
                <Stack spacing="none">
                  <Icon source={TickSmallMinor} color="success" />{" "}
                  <TextStyle>Analytics</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={TickSmallMinor} color="success" />{" "}
                  <TextStyle>Change after sharing</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={TickSmallMinor} color="success" />{" "}
                  <TextStyle>Cart or Checkout</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={TickSmallMinor} color="success" />{" "}
                  <TextStyle>Subscription products</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={TickSmallMinor} color="success" />{" "}
                  <TextStyle>Line item properties</TextStyle>
                </Stack>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical spacing="extraTight">
                <TextField
                  id="alias-link"
                  labelHidden
                  label="Customer checkout link"
                  multiline={3}
                  //prefix={`https://${shopDomain}/a/cart/`}
                  value={`https://${shopDomain}/a/cart/${
                    (alias && alias.value) || ""
                  }`}
                  selectTextOnFocus
                  connectedRight={
                    <Stack vertical spacing="extraTight">
                      <Button
                        fullWidth
                        icon={ClipboardMinor}
                        onClick={handleCopyAliasLink}
                      >
                        Copy
                      </Button>
                      <Button
                        icon={ShopcodesMajor}
                        fullWidth
                        onClick={handleToggleQRModal}
                        accessibilityLabel="View QR Code"
                      >
                        QR Code
                      </Button>
                    </Stack>
                  }
                />
                <Popover
                  active={popoverActive}
                  activator={
                    <Button
                      plain
                      icon={EditMinor}
                      onClick={togglePopoverActive}
                    >
                      Edit link alias
                    </Button>
                  }
                  autofocusTarget="first-node"
                  onClose={togglePopoverActive}
                  sectioned
                  preferredAlignment="left"
                >
                  <TextField
                    requiredIndicator
                    showCharacterCount
                    maxLength={125}
                    prefix={`/a/cart/`}
                    label="Link alias"
                    helpText="The old alias will not redirect to new alias."
                    {...alias}
                    spellCheck={false}
                    error={!alias.value}
                  />
                </Popover>
              </Stack>
            </Card.Section>
          </>
        ) : null}

        {!link || selectedIndex == 1 ? (
          <>
            <Card.Section subdued title="Supported features">
              <Stack spacing="tight">
                <Stack spacing="none">
                  <Icon source={CancelSmallMinor} color="critical" />{" "}
                  <TextStyle>Analytics</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={CancelSmallMinor} color="critical" />{" "}
                  <TextStyle>Change after sharing</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={CancelSmallMinor} color="critical" />{" "}
                  <TextStyle>Cart or Checkout</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={CancelSmallMinor} color="critical" />{" "}
                  <TextStyle>Subscription products</TextStyle>
                </Stack>
                <Stack spacing="none">
                  <Icon source={CancelSmallMinor} color="critical" />{" "}
                  <TextStyle>Line item properties</TextStyle>
                </Stack>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack vertical>
                {!generatedUrl ? (
                  <Banner>
                    Please add a product in order to generate a link.
                  </Banner>
                ) : (
                  <Stack vertical>
                    <TextField
                      id="generated-link"
                      label="Generated checkout link"
                      labelHidden
                      helpText="This link is auto generated and you can not change it."
                      multiline={1}
                      value={generatedUrl}
                      //disabled
                      selectTextOnFocus
                      connectedRight={
                        link ? (
                          <Stack vertical spacing="extraTight">
                            <Button
                              fullWidth
                              icon={ClipboardMinor}
                              onClick={handleCopyCheckoutLink}
                            >
                              Copy
                            </Button>
                            <Button
                              icon={ShopcodesMajor}
                              fullWidth
                              onClick={handleToggleQRModal}
                              accessibilityLabel="View QR Code"
                            >
                              QR Code
                            </Button>
                          </Stack>
                        ) : null
                      }
                    />
                    {!link ? (
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
                    ) : null}
                  </Stack>
                )}
              </Stack>
            </Card.Section>
          </>
        ) : null}
      </CardContainer>
      <Card title="Advanced settings" sectioned>
        <FormLayout>
          <Checkbox
            label="Use access token"
            helpText="Attributes order to a specific sales channel. This is not normally needed."
            checked={useAccessToken}
            onChange={(checked) => setUseAccessToken(checked)}
          />
          {useAccessToken ? (
            <TextField
              type="text"
              label="Access token"
              labelHidden
              {...accessToken}
            />
          ) : null}
        </FormLayout>
      </Card>
      <Modal
        open={showQrModal}
        onClose={handleToggleQRModal}
        title={
          selectedIndex === 0 ? "Short Link QR Code" : "Checkout Link QR Code"
        }
        secondaryActions={{
          content: "Close",
          onAction: handleToggleQRModal,
        }}
      >
        <Modal.Section subdued>
          <Stack distribution="center">
            <TextContainer>
              Leverage QR Codes for repeat orders and marketing campaigns to
              enable true one click buying experiences!
            </TextContainer>
          </Stack>
        </Modal.Section>
        <Modal.Section>
          <QRCodeSection
            generatedUrl={
              selectedIndex === 0
                ? `https://${shopDomain}/a/cart/${alias && alias.value}`
                : generatedUrl
            }
            handleDownloadQrCode={handleDownloadQrCode}
          />
        </Modal.Section>
      </Modal>
    </>
  );
}
