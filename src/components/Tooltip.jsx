import {
  AppProvider,
  Subheading,
  Tooltip as PolarisTooltip,
} from "@shopify/polaris";

const Theme = ({ dark, children }) => {
  if (dark) {
    return (
      <AppProvider i18n={{}} colorScheme="dark">
        {children}
      </AppProvider>
    );
  }

  return children;
};

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
  dark = false,
  children,
}) {
  if (!children) {
    return null;
  }

  if (!content) {
    return children;
  }

  return (
    <Theme dark={dark}>
      <Wrapper subheading={subheading}>
        <PolarisTooltip
          dismissOnMouseOut
          preferredPosition={preferredPosition}
          content={content}
        >
          <AppProvider i18n={{}} colorScheme="light">
            <span
              style={{
                borderBottom: underline ? "2px dotted #c4cdd5" : "",
                cursor: underline ? "pointer" : "default",
              }}
            >
              {children}
            </span>
          </AppProvider>
        </PolarisTooltip>
      </Wrapper>
    </Theme>
  );
}
