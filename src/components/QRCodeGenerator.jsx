import {
  Button,
  ButtonGroup,
  Card,
  ColorPicker,
  Popover,
  Stack,
  hsbToHex,
  Icon,
  TextStyle,
} from "@shopify/polaris";
import { ShopcodesMajor } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ title = "", generatedUrl }) => {
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

  return (
    <>
      <Card.Subsection>
        <Stack distribution={generatedUrl ? "center" : "left"}>
          <div
            style={{
              margin: generatedUrl ? "1rem" : 0,
              padding: "20px",
              background: "white",
              borderRadius: "0.3rem",
              border: "1px solid #eee",
            }}
          >
            {generatedUrl ? (
              <QRCode
                muted
                id="qr-code-link"
                value={generatedUrl}
                size="150"
                title={title}
                fgColor={hsbToHex(color)}
              />
            ) : (
              <Stack>
                <Icon source={ShopcodesMajor} color="subdued" />
                <TextStyle variation="subdued">
                  Add a product to generate code
                </TextStyle>
              </Stack>
            )}
          </div>
        </Stack>
      </Card.Subsection>

      {generatedUrl ? (
        <Card.Subsection>
          <Stack spacing="tight">
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
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: ".3rem",
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
      ) : null}
    </>
  );
};

export default QRCodeGenerator;
