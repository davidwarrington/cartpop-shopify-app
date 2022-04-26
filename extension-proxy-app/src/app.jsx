import { useCallback, useState } from "react";
import {
  CheckoutActions,
  GallerySlider,
  ModalContainer,
  QRCode,
} from "./components/index";

export function App() {
  const [loading, setLoading] = useState(false);
  const [showQrCode, setShowQr] = useState(false);

  console.log("link", link);
  console.log("product", product);

  const shop = {
    logo_url:
      "https://cdn.shopify.com/s/files/1/0543/1551/6073/files/zesti_off_white_-_small-7kb_200x.png?v=1622750018",
    currency: "USD", // TODO:
    locale: "en-US", // TODO:
    url: "https://google.com", // TODO:
    routes: {
      // TODO:
    },
  };

  const handleToggleQRcode = useCallback(
    () => setShowQr((status) => !status),
    []
  );

  // Redirect back to shop when click on the X
  // Merchant can customize back to product or homepage
  const handleShopRedirect = ({ shop }) => {
    window.location.replace((shop.routes && shop.routes.home) || shop.url);
    // TODO: check setting and optionally redirect to product
  };

  if (!product) {
    return null; // TODO: show error
  }

  if (loading) {
    return (
      <ModalContainer>
        <div className="flex justify-center py-2 border-b">
          <div className="h-10">
            <img className="h-full" src={shop.logo_url} alt="" />
          </div>
        </div>

        <div className="flex justify-center p-5">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </ModalContainer>
    );
  }

  return (
    <>
      <ModalContainer>
        <div className="bg-white rounded-t">
          <div className="flex justify-center py-2 border-b">
            <button
              onClick={handleShopRedirect}
              className="rounded-full border absolute left-5 p-2 bg-white hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 stroke-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="h-10">
              <img className="h-full" src={shop.logo_url} alt="" />
            </div>
            <button
              onClick={handleToggleQRcode}
              className="rounded-full border absolute right-5 p-2 bg-white hover:bg-gray-50"
            >
              {showQrCode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 stroke-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 stroke-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {product.featured_image ? (
          showQrCode ? (
            <QRCode />
          ) : (
            <GallerySlider product={product} />
          )
        ) : null}

        <div className="p-5 pt-2 border-t">
          <div className="mb-4">
            <h1 className="text-lg text-gray-900 font-bold">{product.title}</h1>
            <div className="text-gray-900 text-xl">
              {new Intl.NumberFormat(shop.locale, {
                style: "currency",
                currency: shop.currency,
                currencyDisplay: "narrowSymbol",
              }).format(product.price / 100)}
            </div>
            {/* <!--<div><span className="rounded-full bg-gray-200 text-xs text-gray-600 py-1 px-2 ml-1">
              <svg className="h-3 inline mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fill-opacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg> STUDENT50</span>
            </div>--> */}
          </div>

          <div
            className={`grid gap-4 ${
              product.variants.length > 1 ? "grid-cols-2" : ""
            }`}
          >
            {!product.has_only_default_variant ? (
              <div className="">
                <div className="relative">
                  <button
                    type="button"
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    aria-haspopup="listbox"
                    aria-expanded="true"
                    aria-labelledby="listbox-label"
                  >
                    <label
                      id="listbox-label"
                      className="block text-xs font-medium text-gray-900 pb-1"
                    >
                      {product.options[0]}
                    </label>
                    <span className="flex items-center">
                      <img
                        src="https://cdn.shopify.com/s/files/1/0271/7148/7857/products/Zesti-Psychadelic-Pilsner-Hot-Sauce_1200x_b10cad0b-36dc-4487-bd9e-29c3f33a120e.png?v=1620246515&width=300"
                        alt=""
                        className="flex-shrink-0 h-6 w-6 rounded-full"
                      />
                      <span className="ml-3 block truncate">Small</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            ) : null}
            <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
              <label
                for="quantity"
                className="block text-xs font-medium text-gray-900 pb-1"
              >
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                id="quantity"
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="1"
                value="1"
              />
            </div>
          </div>
        </div>

        <CheckoutActions />
      </ModalContainer>
    </>
  );
}
