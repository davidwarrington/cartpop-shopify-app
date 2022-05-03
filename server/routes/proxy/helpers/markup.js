import { lineitemKey, translationMetafield } from "../../../constants.js";
import { defaultTranslations } from "../../../default-translations.js";

export const getMarkup = ({
  link,
  isMobile = false,
  shopifyRequestId,
  clearCart,
  redirectLocation,
  urlQueryString,
}) => {
  const randomId = "2602686fb8b88d94b8051bb6bb771e56";

  // <link rel="stylesheet" href="//cdn.shopify.com/app/services/{{shop.id}}/assets/{{theme.id}}/checkout_stylesheet/v2-ltr-edge-${randomId}-160" media="all" />

  return `{% layout none %}
    <html lang="{{ request.locale.iso_code }}" class="floating-labels">
      <head>
        <meta charset="utf-8">
        <meta name="robots" content="noindex"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  
        <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0">
        <meta name="shopify-x-request-id" content="${shopifyRequestId}">
        <!-- <meta http-equiv="refresh" content="3;URL=?from_processing_page=1"> -->
        <link rel="stylesheet" href="${
          process.env.HOST
        }/src/assets/proxy/index.css?v=${
    process.env.SOURCE_VERSION || randomId
  }" media="all" />
        ${checkoutStyles}
      </head>
      <body>
        <script>
          const shop = {
            id: {{ shop.id }},
            name: "{{ shop.name }}",
            shopDomain: "{{ shop.domain }}",
            domain: "{{ shop.permanent_domain }}",
            paymentTypes: {{ shop.enabled_payment_types | json }},
            routes: {
              cartClear:  "{{ routes.cart_clear_url  }}",
              cartUpdate: "{{ routes.cart_update_url  }}",
              cartAdd: "{{ routes.cart_add_url  }}",
            },
            currency: "{{ shop.currency }}",
            locale: "{{ request.locale.name }}",
          };
          const link = {
            clearCart: ${clearCart},
            redirectionType: "${redirectLocation}",
            ...${JSON.stringify(link)},
          };
          {% assign product = collections.all.products | where: 'id', ${
            link.lineItems[0].productId
          } | first %}
          const product = {
            ...{{ product | json }},
            featured_image: "{{ product.featured_image | image_url: width: 400 }}",
            rating: {
              rating_count: "{{product.metafields.rating.rating_count.value | default: nill }}",
              rating_avg: "{{product.metafields.rating.rating_avg.value | default: nill }}",
            }
          };
          const urlQueryString = ${urlQueryString};
          const isMobile = ${isMobile === 1};
          const languageCode = "{{ request.locale.iso_code }}";
          const defaultTranslations = ${JSON.stringify(defaultTranslations)};
          const translations = {{ shop.metafields.${
            translationMetafield.namespace
          }.${translationMetafield.key}.value | json }};
        </script>
        <div id="app"></div>
        ${bugsnagScript()}
        <script type="module" src="${
          process.env.HOST
        }/src/assets/proxy/index.js?v=${
    process.env.SOURCE_VERSION || randomId
  }"></script>
      </body>
    </html>
    `;
};

export const translatedLiquid = (locale, property) => {
  if (!property) {
    return;
  }
  const { namespace, key } = translationMetafield;
  return `{{ shop.metafields.${namespace}.${key}.value[request.locale.iso_code].${property} | default: "${defaultTranslations[locale][property]}" }}`;
};

const bugsnagScript = () => {
  if (process.env.BUGSNAG_PROXY_KEY) {
    return "";
  }

  return `<script src="//d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"></script>
    <script>
      Bugsnag.start({
        apiKey: '${process.env.BUGSNAG_PROXY_KEY}',
        user: {
          id: '{{ shop.permanent_domain }}',
          name: '{{ shop.name }}',
        },
        //appVersion: '4.10.0' // TODO:
      });
    </script>`;
};

export const contentLoader = (locale) => {
  return `
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
};

export const contentNotFound = (locale) => {
  return `
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
};

const checkoutStyles = `
<style>
  html,body {
    margin: 0;
    width: 100%;
    height: 100%
  }

  html {
    font-family: sans-serif;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%
  }

  body {
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    line-height: 1.3em;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    -webkit-font-smoothing: subpixel-antialiased
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: normal;
    margin: 0;
    line-height: 1em
  }

  h2,.heading-2 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-size: 1.2857142857em;
    line-height: 1.3em
  }

  p {
    margin: 0
  }

  .icon-svg--color-accent {
    color: #0088a6;
    fill: currentColor
  }
  .icon-svg {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor
  }
  .icon-svg--size-64 {
    width: 64px;
    height: 64px
  }
  .icon-svg--spinner {
    -webkit-animation: fade-in 0.5s ease-in-out, rotate 0.5s linear infinite;
    animation: fade-in 0.5s ease-in-out, rotate 0.5s linear infinite
  }

  .full-page-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    background: white;
    color: #545454
  }

  .full-page-overlay__wrap {
    margin: auto;
    width: 100%;
    padding: 10% 0
  }

  .full-page-overlay__title {
    color: #333333;
    margin-bottom: 0.5em
  }

  .full-page-overlay__content {
    margin: 0 auto;
    max-width: 36em;
    padding-left: 1em;
    padding-right: 1em;
    zoom:1}

  .full-page-overlay__content:after,.full-page-overlay__content:before {
    content: "";
    display: table
  }

  .full-page-overlay__content:after {
    clear: both
  }

  .full-page-overlay__content form {
    margin: 1.5em 0
  }

  .full-page-overlay__content:focus {
    outline: 0
  }

  .full-page-overlay__icon {
    margin-bottom: 1.5em
  }

  @-webkit-keyframes fade-in {
    0% {
        opacity: 0;
        visibility: hidden
    }

    100% {
        opacity: 1;
        visibility: visible
    }
  }

  @keyframes fade-in {
      0% {
          opacity: 0;
          visibility: hidden
      }

      100% {
          opacity: 1;
          visibility: visible
      }
  }
  @-webkit-keyframes rotate {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
  }
  @keyframes rotate {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
  }
</style>
`;
