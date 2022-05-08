import { useCallback, useEffect, useState } from "react";
import { ActionList, Button, Popover } from "@shopify/polaris";
import { gql, useQuery } from "@apollo/client";
import { LanguageMinor } from "@shopify/polaris-icons";

const GET_SHOP_LOCALES = gql`
  {
    shopLocales {
      locale
      name
      primary
      published
    }
  }
`;

export function LocaleSwitcher({ activeLocale, setLocale }) {
  const { loading, data } = useQuery(GET_SHOP_LOCALES);

  const [popoverActive, setPopoverActive] = useState(false);
  const [locales, setLocales] = useState(null);

  useEffect(() => {
    if (data && data.shopLocales && data.shopLocales.length) {
      if (!activeLocale) {
        const primaryLocale = data.shopLocales.find((locale) => locale.primary);
        setLocale(primaryLocale.locale);
      }

      setLocales(
        data.shopLocales.map((language) => ({
          locale: language.locale,
          name: language.name,
          primary: language.primary,
          published: language.published,
        }))
      );
    }
  }, [data]);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  if (loading) {
    <Button loading={loading} />;
  }

  if (!locales || !locales.length) {
    return <Button disabled>English</Button>;
  }

  const primaryLocale = activeLocale
    ? locales.find((locale) => locale.locale === activeLocale)
    : locales.find((locale) => locale.locale === locale.primary);

  return (
    <Popover
      active={popoverActive}
      activator={
        <Button icon={LanguageMinor} onClick={togglePopoverActive} disclosure>
          {primaryLocale?.name} ({primaryLocale?.locale})
        </Button>
      }
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <ActionList
        actionRole="menuitem"
        items={locales.map((locale) => ({
          content: `${locale.name} (${locale.locale})`,
          onAction: () => {
            setLocale(locale.locale);
            togglePopoverActive();
          },
          active: locale.locale === activeLocale,
        }))}
      />
    </Popover>
  );
}
