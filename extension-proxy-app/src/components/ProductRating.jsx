import { StarIcon } from "@heroicons/react/solid";

const ProductRating = ({ rating, ratingCount }) => {
  if (!rating) {
    return null;
  }
  return (
    <div className="inline-block">
      <h4 className="sr-only">Reviews</h4>
      <div
        className="flex items-end border rounded-md px-1 py-1"
        aria-label={`Rating ${rating} out of 5; ${ratingCount} reviews`}
      >
        <StarIcon
          className="text-yellow-400 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
        <p>
          {parseFloat(rating).toFixed(parseFloat(rating) % 1 != 0 ? 2 : 1)}{" "}
          <span className="text-gray-400">
            {ratingCount ? `(${ratingCount})` : ""}
          </span>
        </p>
        {/* {[0, 1, 2, 3, 4].map((ratingIndex) => (
          <StarIcon
            key={rating}
            className={classNames(
              rating > ratingIndex ? "text-gray-400" : "text-gray-200",
              "h-5 w-5 flex-shrink-0"
            )}
            aria-hidden="true"
          />
        ))} */}
      </div>
      {/* <p className="sr-only">{rating} out of 5 stars</p> */}
    </div>
  );
};

export default ProductRating;
