import {
  generatedCheckoutLink,
  generateQueryString,
  getHeaders,
} from "../../../helpers/app-proxy.js";
import { getMarkup, getScriptMarkup, translatedLiquid } from "./markup.js";

export const linkNotFound = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);

  const bodyContent = `
    <div class="full-page-overlay">
      <div class="full-page-overlay__wrap">
        <div class="full-page-overlay__content" role="region" aria-describedby="full-page-overlay__processing-text" aria-label="Processing order" tabindex="-1">
          <div id="full-page-overlay__processing-text">
            <svg width="40" height="40" viewBox="0 0 40 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                <g id="back-soon-3" sketch:type="MSArtboardGroup" transform="translate(-230.000000, -519.000000)">
                  <g id="what-went-wrong?" sketch:type="MSLayerGroup" transform="translate(231.000000, 444.000000)">
                    <g id="warning" transform="translate(0.000000, 77.000000)" sketch:type="MSShapeGroup">
                      <path d="M17.593,0.492 C18.217,-0.589 19.778,-0.589 20.402,0.492 L37.766,30.567 C38.39,31.648 37.61,33 36.361,33 L1.634,33 C0.386,33 -0.395,31.648 0.229,30.567 L17.593,0.492 L17.593,0.492 Z" id="Stroke-1" stroke="#E9BE33" stroke-width="2" stroke-linejoin="round"></path>
                      <path d="M20.75,28 C20.75,28.966 19.966,29.75 19,29.75 C18.033,29.75 17.25,28.966 17.25,28 C17.25,27.034 18.033,26.25 19,26.25 C19.966,26.25 20.75,27.034 20.75,28" id="Fill-2" fill="#E9BE33"></path>
                      <path d="M19,23 L19,8" id="Stroke-3" stroke="#E9BE33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <br /><br />
            
            <h2 class="full-page-overlay__title">
              ${translatedLiquid(locale, "not_found_title")}
            </h2>
            <p class="full-page-overlay__text">
              ${translatedLiquid(locale, "not_found_message")}
            </p>
            <br /><a href="{{ shop.url }}">${translatedLiquid(
              locale,
              "not_found_button_label"
            )}</a>

            <!-- <p class="full-page-overlay__text"> If you’re not automatically redirected, <a href="?from_processing_page=1">refresh this page</a>. </p> -->
          </div>
        </div>
      </div>
    </div>
  `;

  const markup = getMarkup({
    shop,
    isMobile,
    shopifyRequestId,
    bodyContent,
  });

  return {
    markup,
  };
};

export const link = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);
  const link = req.link;
  let scripts = ``;

  const hasLineProperties = true;
  const hasSubscription = false;

  // We need to use cart api if a link has one of these
  if (hasLineProperties || hasSubscription) {
    const urlQueryString = generateQueryString(link);

    scripts = getScriptMarkup({
      clearCart: true,
      urlQueryString,
    });
  } else {
    // Generate checkout link
    const generatedLink = generatedCheckoutLink({
      link,
    });
    if (!generatedLink) {
      throw `Checkout link generation failed on ${link} on ${shop}`;
    }

    // Redirect to generated link
    scripts = `
      <script>
        window.location.replace("{{ shop.url }}${generatedLink}");
      </script>`;
  }

  const bodyContent = `
    <div class="full-page-overlay">
      <div class="full-page-overlay__wrap">
        <div class="full-page-overlay__content" role="region" aria-describedby="full-page-overlay__processing-text" aria-label="Processing order" tabindex="-1">
          <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" aria-hidden="true" focusable="false">
            <use xlink:href="#spinner-large"></use>
          </svg>

          <div id="full-page-overlay__processing-text">
            <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" xmlns="http://www.w3.org/2000/svg" viewBox="-270 364 66 66"><path d="M-237 428c-17.1 0-31-13.9-31-31s13.9-31 31-31v-2c-18.2 0-33 14.8-33 33s14.8 33 33 33 33-14.8 33-33h-2c0 17.1-13.9 31-31 31z"></path></svg>

            <h2 class="full-page-overlay__title">
              ${translatedLiquid(locale, "loading_title")}
            </h2>
            <p class="full-page-overlay__text">
              ${translatedLiquid(locale, "loading_message")}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const markup = getMarkup({
    link,
    shop,
    isMobile,
    shopifyRequestId,
    scripts,
    bodyContent,
  });

  return { markup };
};
