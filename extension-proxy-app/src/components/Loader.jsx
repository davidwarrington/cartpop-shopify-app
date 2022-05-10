import { useEffect } from "react";
import { useCart, useLocale } from "../hooks";

const Loader = () => {
  const { translations } = useLocale();
  const { link, handleCheckoutRedirect } = useCart();

  // Automatically call cart logic if destination is cart or checkout
  useEffect(() => {
    if (
      link.settings &&
      link.settings.destination &&
      ["cart", "checkout"].includes(link.settings.destination)
    ) {
      handleCheckoutRedirect({ destination: link.settings.destination });
    }
  }, []);

  return (
    <div className="">
      <div class="full-page-overlay">
        <div class="full-page-overlay__wrap">
          <div
            class="full-page-overlay__content"
            role="region"
            aria-describedby="full-page-overlay__processing-text"
            aria-label="Processing order"
            tabindex="-1"
          >
            <div id="full-page-overlay__processing-text">
              <svg
                class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-270 364 66 66"
              >
                <path d="M-237 428c-17.1 0-31-13.9-31-31s13.9-31 31-31v-2c-18.2 0-33 14.8-33 33s14.8 33 33 33 33-14.8 33-33h-2c0 17.1-13.9 31-31 31z"></path>
              </svg>
              <h2 class="full-page-overlay__title">
                {translations.loading_title}
              </h2>
              <p class="full-page-overlay__text">
                {translations.loading_message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
