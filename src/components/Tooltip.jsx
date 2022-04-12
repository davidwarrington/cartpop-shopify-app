import { Subheading, Tooltip as PolarisTooltip } from "@shopify/polaris";

const Wrapper = ({ subheading, children }) => {
  if (subheading) {
    return <Subheading>{children}</Subheading>;
  }

  return children;
};

export function Tooltip({
  content,
  subheading = false,
  underline = true,
  preferredPosition = "above",
  children,
}) {
  if (!children) {
    return null;
  }

  if (!content) {
    return children;
  }

  return (
    <Wrapper subheading={subheading}>
      <PolarisTooltip
        dismissOnMouseOut
        preferredPosition={preferredPosition}
        content={content}
      >
        <span
          style={{
            borderBottom: underline ? "2px dotted #c4cdd5" : "",
            cursor: underline ? "pointer" : "default",
          }}
        >
          {children}
        </span>
      </PolarisTooltip>
    </Wrapper>
  );
}
