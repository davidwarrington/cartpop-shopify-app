import { useCallback, useEffect, useState } from "react";
import {
  Banner,
  Button,
  ButtonGroup,
  Card,
  ColorPicker,
  Icon,
  Modal,
  Popover,
  Stack,
  Tabs,
  TextContainer,
  TextField,
  TextStyle,
  hsbToHex,
  Subheading,
} from "@shopify/polaris";
import {
  CancelSmallMinor,
  ClipboardMinor,
  EditMinor,
  ShopcodesMajor,
  TickSmallMinor,
} from "@shopify/polaris-icons";
import { Toast } from "@shopify/app-bridge-react";
import QRCode from "react-qr-code";
import { getIdFromGid } from "../helpers";
import { useShop } from "../core/ShopProvider";
import { RequireSubscription } from "./RequireSubscription";
import { Tooltip } from "./Tooltip";

const CardContainer = ({ showTitle, sectioned, children }) => (
  <Card sectioned={sectioned} title={showTitle ? "Checkout Link" : ""}>
    {children}
  </Card>
);

const QRCodeSection = ({ title = "", generatedUrl, handleDownloadQrCode }) => {
  const [color, setColor] = useState({
    hue: 0,
    brightness: 0,
    saturation: 0,
  });

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  return (
    <>
      <Card.Subsection>
        <Stack distribution="center">
          <div
            style={{
              padding: "20px",
            }}
          >
            <QRCode
              muted
              id="qr-code-link"
              value={generatedUrl}
              size="150"
              title={title}
              fgColor={hsbToHex(color)}
            />
          </div>
        </Stack>
      </Card.Subsection>

      <Card.Subsection>
        <Stack>
          <Popover
            active={popoverActive}
            onClose={togglePopoverActive}
            activator={
              <Button
                plain
                onClick={togglePopoverActive}
                accessibilityLabel="QR Code color"
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    background: hsbToHex(color),
                    boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 19%)",
                  }}
                />
              </Button>
            }
            sectioned
          >
            <ColorPicker onChange={setColor} color={color} />
          </Popover>

          <Stack.Item fill>
            <ButtonGroup fullWidth>
              <Button
                download
                primary
                size="large"
                onClick={() => handleDownloadQrCode("png")}
              >
                Download PNG
              </Button>
              <Button
                download
                primary
                size="large"
                onClick={() => handleDownloadQrCode("svg")}
              >
                Download SVG
              </Button>
            </ButtonGroup>
          </Stack.Item>
        </Stack>
      </Card.Subsection>
    </>
  );
};

export function CheckoutLinkCard({
  newForm,
  link,
  linkActive,
  alias,
  products,
  customer,
  order,
  orderAttributes,
  accessToken,
}) {
  const { shopData } = useShop();

  const shopDomain = shopData && (shopData.primaryDomain || shopData.shop);
  const hasLineItemProperties =
    products &&
    products.length &&
    products.some(
      (product) =>
        product.link_line_properties && product.link_line_properties.length
    );
  const hasProductSellingPlan =
    products &&
    products.length &&
    products.some((product) => product.link_selling_plan_id);

  const [showQrModal, setShowQrModal] = useState(false);
  const [generatedUrl, setUrl] = useState("");
  const [toast, setToast] = useState({});
  const [selectedIndex, setIndex] = useState(
    newForm || !shopData.subscription ? 1 : 0
  );
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  // Compute url whenever a parameter changes
  useEffect(() => {
    // Return early if no products. Only required parameter
    if (!products || !products.length) {
      // Clear url if it's set
      generatedUrl && setUrl("");
      return;
    }

    // Build Products String
    const productString = products
      .map(
        (lineItem) =>
          `${getIdFromGid("ProductVariant", lineItem.variantInfo.id)}:${
            lineItem.link_quantity || 1
          }`
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

      if (orderAttributes && orderAttributes.length) {
        urlParameters += `&${orderAttributes
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
              { id: "alias", content: "Link alias" },
              { id: "raw", content: "Checkout link" },
            ]}
            selected={selectedIndex}
            onSelect={handleSelectTab}
          />
        ) : null}
        {selectedIndex == 0 ? (
          !newForm && linkActive ? (
            <RequireSubscription
              content={
                <Stack vertical>
                  <TextStyle variation="strong">
                    Please upgrade to Pro in order to leverage link aliases.
                  </TextStyle>
                  <Subheading>Benefits</Subheading>
                  <Stack spacing="tight" vertical>
                    <Stack spacing="none">
                      <Icon source={TickSmallMinor} color="success" />{" "}
                      <TextStyle>
                        <Tooltip content="Customize a short url to share with customers and use on marketing campaigns. Easily change products and link information without changing the url.">
                          Link aliases
                        </Tooltip>
                      </TextStyle>
                    </Stack>
                    <Stack spacing="none">
                      <Icon source={TickSmallMinor} color="success" />{" "}
                      <TextStyle>
                        <Tooltip content="See how many clicks a link got.">
                          Analytics
                        </Tooltip>
                      </TextStyle>
                    </Stack>
                    {/* <Stack spacing="none">
                      <Icon source={TickSmallMinor} color="success" />{" "}
                      <TextStyle>
                        <Tooltip content="Link customers straight to checkout with subscription products.">
                          Subscription products
                        </Tooltip>
                      </TextStyle>
                      <Stack.Item>
                        <Badge>Coming soon</Badge>
                      </Stack.Item>
                    </Stack>
                    <Stack spacing="none">
                      <Icon source={TickSmallMinor} color="success" />{" "}
                      <TextStyle>Line item properties</TextStyle>
                      <Stack.Item>
                        <Badge>Coming soon</Badge>
                      </Stack.Item>
                    </Stack> */}
                  </Stack>
                </Stack>
              }
            >
              <Card.Section>
                <Stack vertical spacing="extraTight">
                  <TextField
                    id="alias-link"
                    labelHidden
                    label="Customer checkout link"
                    multiline={1}
                    value={`https://${shopDomain.replace(
                      "https://",
                      ""
                    )}/a/cart/${(alias && alias.value) || ""}`}
                    selectTextOnFocus
                  />
                  <Stack
                    alignment="center"
                    spacing="extraTight"
                    distribution="fillEvenly"
                  >
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

                    <Stack.Item>
                      <Stack spacing="extraTight">
                        <Button
                          icon={ShopcodesMajor}
                          fullWidth
                          onClick={handleToggleQRModal}
                          accessibilityLabel="View QR Code"
                        >
                          QR Code
                        </Button>
                        <Stack.Item fill>
                          <Button
                            primary
                            fullWidth
                            icon={ClipboardMinor}
                            onClick={handleCopyAliasLink}
                          >
                            Copy
                          </Button>
                        </Stack.Item>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Stack>
              </Card.Section>
            </RequireSubscription>
          ) : (
            <Card.Section>
              <Banner>
                {newForm
                  ? "Please save link to generate a link alias."
                  : "Please enable link to generate a link alias."}
              </Banner>
            </Card.Section>
          )
        ) : null}

        {!link || selectedIndex == 1 ? (
          <>
            {!newForm ? (
              <Card.Section subdued title="Limitations">
                <Stack spacing="tight">
                  <Stack spacing="none">
                    <Icon source={CancelSmallMinor} color="critical" />{" "}
                    <TextStyle>Analytics</TextStyle>
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
            ) : null}
            <Card.Section>
              <Stack vertical>
                {hasLineItemProperties ? (
                  <Banner
                    status="warning"
                    title="One or more products contain line item properties"
                  >
                    Please use a link alias as Shopify does not support line
                    item properties with checkout links.
                  </Banner>
                ) : null}
                {hasProductSellingPlan ? (
                  <Banner
                    status="warning"
                    title="One or more products contain a product subscription"
                  >
                    Please use a link alias as Shopify does not support product
                    subscriptions with checkout links.
                  </Banner>
                ) : null}
                {!generatedUrl ? (
                  <Banner status="info">
                    Please add a product in order to generate a link.
                  </Banner>
                ) : (
                  <Stack vertical>
                    <TextField
                      id="generated-link"
                      label="Generated checkout link"
                      labelHidden
                      helpText="This link is auto generated and you can not change it."
                      multiline={3}
                      value={generatedUrl}
                      //disabled
                      selectTextOnFocus
                      connectedRight={
                        link ? (
                          <Stack vertical spacing="extraTight">
                            <Button
                              primary
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
                ? `https://${shopDomain.replace("https://", "")}/a/cart/${
                    alias && alias.value
                  }?scan=true`
                : generatedUrl + `&scan=true`
            }
            handleDownloadQrCode={handleDownloadQrCode}
          />
        </Modal.Section>
      </Modal>
    </>
  );
}
