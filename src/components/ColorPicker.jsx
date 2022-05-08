import {
  Button,
  ColorPicker,
  Popover,
  TextField,
  hsbToHex,
} from "@shopify/polaris";
import { useCallback, useState } from "react";

export function CustomColorPicker({ label, required = false, field }) {
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });

  const togglePopoverActive = useCallback(
    () => setShowPicker((popoverActive) => !popoverActive),
    []
  );

  return (
    <TextField
      disabled
      requiredIndicator={required}
      label={label}
      connectedLeft={
        <Popover
          active={showPicker}
          activator={
            <Button onClick={togglePopoverActive}>
              <div
                style={{
                  width: "30px",
                  height: "20px",
                  borderRadius: "var(--p-border-radius-1)",
                  backgroundColor: hsbToHex(color),
                }}
              />
            </Button>
          }
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
          sectioned
        >
          <ColorPicker onChange={setColor} color={color} />
        </Popover>
      }
      value={hsbToHex(color)}
      // {...field}
    />
  );
}
