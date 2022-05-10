import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { CheckoutActions, Loader, LineItems, TopBar } from "./components/index";
import { LocaleProvider, ShopProvider, CartProvider } from "./hooks/index";
import { APP_STATES } from "./constants";

export function App() {
  const [status, setStatus] = useState(APP_STATES.idle);
  const [showQrCode, setShowQr] = useState(false);
  const [open, setOpen] = useState(false);
  const completeButtonRef = useRef(null);

  console.log("link", link);
  console.log("product", product);

  useEffect(() => {
    if (link && link.settings && link.settings.destination === "landing_page") {
      setOpen(true);
      return;
    }

    setStatus(APP_STATES.loading);
  }, []);

  const handleToggleQRcode = useCallback(
    () => setShowQr((status) => !status),
    []
  );

  // Redirect back to shop when click on the X
  // Merchant can customize back to product or homepage
  const handleShopRedirect = () => {
    setStatus(APP_STATES.loading);
    window.location.replace((shop.routes && shop.routes.home) || shop.url);
    // TODO: check setting and optionally redirect to product
  };

  if (!link || !shop) {
    console.warn("Missing link and/or shop", { link, shop });
    return null; // TODO: show error
  }

  return (
    <LocaleProvider
      defaultTranslations={defaultTranslations}
      locale={languageCode}
    >
      <ShopProvider shop={shop}>
        <CartProvider setStatus={setStatus} link={link}>
          {status === APP_STATES.loading ? (
            <Loader />
          ) : (
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
                      <div className="pointer-events-auto w-screen max-w-lg">
                        <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl rounded-tl-lg rounded-tr-lg md:rounded-lg">
                          <div className="h-0 flex-1 overflow-y-auto">
                            <TopBar />
                            {link.settings && link.settings.shippingBanner ? (
                              <div className="p-2 bg-gray-500 text-white font-medium text-center border-t-0">
                                {link.settings.shippingBanner}
                              </div>
                            ) : null}
                          </div>

                          {link.products ? (
                            <LineItems
                              link={link}
                              lineItems={link.lineItems}
                              products={link.products}
                              showQrCode={false} // TODO:
                            />
                          ) : null}

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
          )}
        </CartProvider>
      </ShopProvider>
    </LocaleProvider>
  );
}
