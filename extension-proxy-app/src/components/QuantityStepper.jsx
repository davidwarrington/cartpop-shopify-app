import { useCallback } from "react";

const QuantityStepper = ({ quantity, setQuantity, canEditQuantity }) => {
  const handleIncrement = useCallback(() => {
    setQuantity((value) => {
      // TODO: don't let quantity exceed inventory if tracked
      let cachedValue = value;
      cachedValue++;
      return cachedValue;
    });
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((value) => {
      if (value == 1) {
        // Don't go under 1
        return value;
      }

      let cachedValue = value;
      cachedValue--;
      return cachedValue;
    });
  }, []);

  if (!canEditQuantity && quantity === 1) {
    return null;
  }

  // if (!canEditQuantity) {
  //   return (
  //     <div className="w-2/5 flex flex-row  h-14 md:h-12 items-center justify-center font-bold">{quantity}</div>
  //   )
  // }

  return (
    <div className="min-w-[120px] w-2/5 flex flex-row h-14 md:h-12 border border-gray-300 rounded-md shadow-sm relative bg-transparent focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 px-4">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canEditQuantity || quantity == 1 ? true : false}
        data-action="decrement"
        className="flex justify-center items-center text-gray-600 disabled:text-gray-300 hover:text-indigo-600 h-full w-20 rounded-l cursor-pointer outline-none disabled:cursor-default"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="block h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        </svg>
      </button>
      <input
        pattern="[0-9]*"
        type="text"
        inputmode="numeric"
        className="appearance-none text-center w-full font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 text-base border-transparent focus:border-transparent focus:ring-0"
        name="quantity"
        value={quantity}
        disabled={!canEditQuantity}
        //onChange={(value) => setQuantity(value)}
      />
      <button
        type="button"
        onClick={handleIncrement}
        data-action="increment"
        className="flex justify-center items-center text-gray-600 disabled:text-gray-300 hover:text-indigo-600 h-full w-20 rounded-r cursor-pointer outline-none disabled:cursor-default"
        disabled={!canEditQuantity}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuantityStepper;
