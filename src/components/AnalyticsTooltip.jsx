import { Button, Popover } from "@shopify/polaris";
import { AnalyticsMinor } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

export function AnalyticsTooltip({ content, disabled, children }) {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <div
      style={{
        marginTop: ".5rem",
      }}
    >
      <Button
        plain
        monochrome
        removeUnderline
        disclosure
        icon={AnalyticsMinor}
        onClick={togglePopoverActive}
      >
        {children}
      </Button>
    </div>
  );

  if (disabled) {
    return (
      <div
        style={{
          marginTop: ".5rem",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
    >
      <Popover.Pane title="s">{content}</Popover.Pane>
    </Popover>
  );
}
