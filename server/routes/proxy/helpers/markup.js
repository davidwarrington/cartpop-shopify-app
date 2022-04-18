import { translationMetafield } from "../../../constants.js";
import { defaultTranslations } from "../../../default-translations.js";

export const getMarkup = ({
  isMobile = false,
  shopifyRequestId,
  locale = "en",
  scripts = "",
}) => {
  const randomId = "2602686fb8b88d94b8051bb6bb771e56";

  return `{% layout none %} 
        <html lang="{{ request.locale.iso_code }}">
          <head>
            <meta charset="utf-8">
            <meta name="robots" content="noindex"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  
            <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0">
            <link rel="stylesheet" href="//cdn.shopify.com/app/services/{{shop.id}}/assets/{{theme.id}}/checkout_stylesheet/v2-ltr-edge-${randomId}-160" media="all" />
            <meta name="shopify-x-request-id" content="${shopifyRequestId}">
            <!-- <meta http-equiv="refresh" content="3;URL=?from_processing_page=1"> -->
          </head>
          <body>
            <script>
              const isMobile = ${isMobile};
              const languageCode = "{{ request.locale.iso_code }}";
              const defaultTranslations = ${JSON.stringify(
                defaultTranslations
              )};
              const translations = {{ shop.metafields.${
                translationMetafield.namespace
              }.${translationMetafield.key}.value | json }};
            </script>
            ${scripts}
            <div class="full-page-overlay">
              <div class="full-page-overlay__wrap">
                <div class="full-page-overlay__content" role="region" aria-describedby="full-page-overlay__processing-text" aria-label="Processing order" tabindex="-1">
                  <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" aria-hidden="true" focusable="false">
                    <use xlink:href="#spinner-large"></use>
                  </svg>
                  <div id="full-page-overlay__processing-text">
                    <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" xmlns="http://www.w3.org/2000/svg" viewBox="-270 364 66 66"><path d="M-237 428c-17.1 0-31-13.9-31-31s13.9-31 31-31v-2c-18.2 0-33 14.8-33 33s14.8 33 33 33 33-14.8 33-33h-2c0 17.1-13.9 31-31 31z"></path></svg>
                    <h3 class="full-page-overlay__title">
                      {{ shop.metafields.${translationMetafield.namespace}.${
    translationMetafield.key
  }.value[${locale}].loading_title | default: "${
    defaultTranslations[locale].loading_title
  }" }}
                    </h3>
                    <p class="full-page-overlay__text">{{ shop.metafields.${
                      translationMetafield.namespace
                    }.${
    translationMetafield.key
  }.value[request.locale.iso_code].loading_message | default: "${
    defaultTranslations[locale].loading_message
  }" }}</p>
                    <!-- <p class="full-page-overlay__text"> If you’re not automatically redirected, <a href="?from_processing_page=1">refresh this page</a>. </p> -->
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
    `;
};
