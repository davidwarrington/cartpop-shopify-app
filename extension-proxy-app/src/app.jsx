import { Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";

import {
  LinkIcon,
  PlusSmIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";

const team = [
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Whitney Francis",
    email: "whitney.francis@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Leonard Krasner",
    email: "leonard.krasner@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    email: "floy.dmiles@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Emily Selman",
    email: "emily.selman@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

import {
  CheckoutActions,
  GallerySlider,
  ModalContainer,
  QRCode,
  QuantityStepper,
  VariantSelector,
} from "./components/index";

export function App() {
  const [loading, setLoading] = useState(false);
  const [showQrCode, setShowQr] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

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
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none inset-y-5 fixed left-1/2 transform -translate-x-1/2 bottom-0 flex pl-10 sm:pl-16">
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
                <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl rounded-tl rounded-tr">
                  <div className="h-0 flex-1 overflow-y-auto">
                    <div className="bg-gray-200 py-6 px-4 sm:px-6 rounded-tl rounded-tr">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {" "}
                          New Project{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-900">
                          Get started by filling in the information below to
                          create your new project.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-t">
                      <div className="relative flex justify-center py-2 border-b">
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

                    {showQrCode ? (
                      <QRCode />
                    ) : (
                      <GallerySlider product={product} />
                    )}

                    <div className="p-5 pt-2 border-t">
                      <div className="mb-4">
                        <h1 className="text-lg text-gray-900 font-bold">
                          {product.title}
                        </h1>
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
                          <VariantSelector product={product} />
                        ) : null}

                        <QuantityStepper product={product} />
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    <CheckoutActions />

                    {/* <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button> */}
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-10"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="pointer-events-none fixed inset-y-0 right-1/2 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-y-0"
                leaveTo="-translate-y-full"
              >
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

                  {showQrCode ? (
                    <QRCode />
                  ) : (
                    <GallerySlider product={product} />
                  )}

                  <div className="p-5 pt-2 border-t">
                    <div className="mb-4">
                      <h1 className="text-lg text-gray-900 font-bold">
                        {product.title}
                      </h1>
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
                        <VariantSelector product={product} />
                      ) : null}

                      <QuantityStepper product={product} />
                    </div>
                  </div>

                  <CheckoutActions />
                </ModalContainer>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

// <div className="pointer-events-auto w-screen max-w-md">
//                 <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
//                   <div className="px-4 sm:px-6">
//                     <div className="flex items-start justify-between">
//                       <Dialog.Title className="text-lg font-medium text-gray-900"> Panel title </Dialog.Title>
//                       <div className="ml-3 flex h-7 items-center">
//                         <button
//                           type="button"
//                           className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                           onClick={() => setOpen(false)}
//                         >
//                           <span className="sr-only">Close panel</span>
//                           <XIcon className="h-6 w-6" aria-hidden="true" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="relative mt-6 flex-1 px-4 sm:px-6">
//                     {/* Replace with your content */}
//                     <div className="absolute inset-0 px-4 sm:px-6">
//                       <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" />
//                     </div>
//                     {/* /End replace */}
//                   </div>
//                 </div>
//               </div>
