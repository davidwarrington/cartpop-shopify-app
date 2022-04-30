import {
  GallerySlider,
  QRCode,
  QuantityStepper,
  VariantSelector,
} from "./index";

const Product = ({ product, showQrCode, shop }) => {
  return (
    <>
      {showQrCode ? <QRCode /> : <GallerySlider product={product} />}

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

        <div className={`flex gap-4`}>
          {!product.has_only_default_variant ? (
            <VariantSelector product={product} />
          ) : null}

          <QuantityStepper product={product} />
        </div>
      </div>
    </>
  );
};

export default Product;
