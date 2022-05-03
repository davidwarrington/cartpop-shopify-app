import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { CheckoutActions, LineItems, TopBar } from "./components/index";
import { LocaleProvider, ShopProvider } from "./hooks/index";
import { CartProvider } from "./hooks/useCart";

export function App() {
  const [status, setStatus] = useState("loading");
  const [showQrCode, setShowQr] = useState(false);
  const [open, setOpen] = useState(false);
  const completeButtonRef = useRef(null);

  console.log("link", link);
  console.log("product", product);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleToggleQRcode = useCallback(
    () => setShowQr((status) => !status),
    []
  );

  // Redirect back to shop when click on the X
  // Merchant can customize back to product or homepage
  const handleShopRedirect = () => {
    setStatus("loading");
    window.location.replace((shop.routes && shop.routes.home) || shop.url);
    // TODO: check setting and optionally redirect to product
  };

  if (!link || !shop) {
    return null; // TODO: show error
  }

  if (status === "loading") {
    return (
      <LocaleProvider
        defaultTranslations={defaultTranslations}
        locale={languageCode}
      >
        <ShopProvider shop={shop}>
          <CartProvider initialLineItems={link.lineItems} setStatus={setStatus}>
            <Transition.Root show={open} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 overflow-hidden"
                onClose={() => {}}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Dialog.Overlay className="absolute inset-0" />

                  <div className="pointer-events-none fixed h-full max-w-[95%] pt-2 left-1/2 transform -translate-x-1/2 md:inset-x-0  md:bottom-10 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-500"
                      enterFrom="translate-y-full"
                      enterTo="translate-y-0"
                      leave="transform transition ease-in-out duration-500"
                      leaveFrom="translate-y-0"
                      leaveTo="translate-y-full"
                    >
                      <div className="pointer-events-auto w-screen max-w-md">
                        <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl rounded-tl-lg rounded-tr-lg md:rounded-lg">
                          <div className="h-full flex-1 overflow-y-auto">
                            <TopBar />

                            <div className="flex justify-center p-5">
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
                                        class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon stroke-brand"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="-270 364 66 66"
                                      >
                                        <path d="M-237 428c-17.1 0-31-13.9-31-31s13.9-31 31-31v-2c-18.2 0-33 14.8-33 33s14.8 33 33 33 33-14.8 33-33h-2c0 17.1-13.9 31-31 31z"></path>
                                      </svg>

                                      <h2 class="full-page-overlay__title">
                                        loading
                                      </h2>
                                      <p class="full-page-overlay__text">
                                        loading message
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

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
                          </div>
                        </div>
                      </div>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </CartProvider>
        </ShopProvider>
      </LocaleProvider>
    );
  }

  return (
    <LocaleProvider
      defaultTranslations={defaultTranslations}
      locale={languageCode}
    >
      <ShopProvider shop={shop}>
        <CartProvider initialLineItems={link.lineItems} setStatus={setStatus}>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 overflow-hidden"
              onClose={() => {}}
              initialFocus={completeButtonRef}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Dialog.Overlay className="absolute inset-0" />

                <div className="pointer-events-none fixed max-h-full max-w-[95%] pt-2 left-1/2 transform -translate-x-1/2 bottom-0 flex md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transform transition ease-in-out duration-500"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                  >
                    <div className="pointer-events-auto w-screen max-w-md">
                      <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl rounded-tl-lg rounded-tr-lg md:rounded-lg">
                        <div className="h-0 flex-1 overflow-y-auto">
                          <TopBar />
                        </div>

                        <LineItems
                          link={link}
                          lineItems={link.lineItems}
                          products={[product]}
                          showQrCode={false} // TODO:
                        />

                        <div className="py-4">
                          <CheckoutActions
                            shop={shop}
                            completeButtonRef={completeButtonRef}
                          />
                        </div>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </CartProvider>
      </ShopProvider>
    </LocaleProvider>
  );
}
