import { useCallback, useState } from "react";

const QuantityStepper = () => {
  const [quantity, setQuantity] = useState("1");

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

  return (
    <div className="flex flex-row h-14 w-full border border-gray-300 rounded-md shadow-sm relative bg-transparent focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
      <button
        onClick={handleDecrement}
        disabled={quantity == 1 ? true : false}
        data-action="decrement"
        className="flex justify-center items-center text-gray-600 disabled:text-gray-300 hover:text-indigo-600 h-full w-20 rounded-l cursor-pointer outline-none"
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
        type="number"
        className="appearance-none outline-none focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 text-base"
        name="quantity"
        value={quantity}
        //onChange={(value) => setQuantity(value)}
      />
      <button
        onClick={handleIncrement}
        data-action="increment"
        className="flex justify-center items-center text-gray-600 hover:text-indigo-600 h-full w-20 rounded-r cursor-pointer"
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

// <div className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
//               <label
//                 for="quantity"
//                 className="block text-xs font-medium text-gray-900 pb-1"
//               >
//                 Quantity
//               </label>
//               <input
//                 type="text"
//                 name="quantity"
//                 id="quantity"
//                 className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
//                 placeholder="1"
//                 value="1"
//               />
//             </div>
