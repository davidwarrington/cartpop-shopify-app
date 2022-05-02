import { createContext, useContext } from "react";

const LocaleContext = createContext({});

const LocaleProvider = ({ locale, defaultTranslations, children }) => {
  if (!defaultTranslations) {
    // TODO: error
  }

  const translations = defaultTranslations[locale]
    ? defaultTranslations[locale]
    : defaultTranslations["en"];

  return (
    <LocaleContext.Provider value={{ locale, translations }}>
      {children}
    </LocaleContext.Provider>
  );
};

const useLocale = () => {
  const { locale, translations } = useContext(LocaleContext);

  return { locale, translations };
};

export { LocaleProvider, useLocale };
