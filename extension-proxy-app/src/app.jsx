import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { CheckoutActions, Product } from "./components/index";

export function App() {
  const [status, setStatus] = useState("loading");
  const [showQrCode, setShowQr] = useState(false);
  const [open, setOpen] = useState(false);
  const completeButtonRef = useRef(null);

  useEffect(() => {
    setStatus("idle");
    setOpen(true);
  }, []);

  console.log("shop", window.shop);
  console.log("link", window.link);
  console.log("product", window.product);

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

  if (!product) {
    return null; // TODO: show error
  }

  if (status === "loading") {
    return (
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
                      <div className="bg-white rounded-t-lg">
                        <div className="relative flex justify-center py-2 border-b">
                          {shop ? (
                            <button
                              type="button"
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
                          ) : null}
                          <div className="h-10">
                            <img
                              className="h-full"
                              src={shop.logo_url}
                              alt=""
                            />
                          </div>
                          <button
                            type="button"
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
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return (
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
                    <div className="bg-white rounded-t-lg">
                      <div className="relative flex justify-center py-2 border-b">
                        {shop ? (
                          <button
                            type="button"
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
                        ) : null}
                        <div className="h-10">
                          <img className="h-full" src={shop.logo_url} alt="" />
                        </div>
                        <button
                          type="button"
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
                  </div>

                  <Product
                    product={product}
                    shop={shop}
                    showQrCode={showQrCode}
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
  );
}
