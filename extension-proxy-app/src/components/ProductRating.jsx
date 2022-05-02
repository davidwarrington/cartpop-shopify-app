import { StarIcon } from "@heroicons/react/solid";
import { classNames } from "../helpers";

const ProductRating = ({ rating, ratingCount }) => {
  if (!rating) {
    return null;
  }
  return (
    <div className="mt-3">
      <h4 className="sr-only">Reviews</h4>
      <div className="flex items-center">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((ratingIndex) => (
            <StarIcon
              key={rating}
              className={classNames(
                rating > ratingIndex ? "text-gray-400" : "text-gray-200",
                "h-5 w-5 flex-shrink-0"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="sr-only">{rating} out of 5 stars</p>
      </div>
    </div>
  );
};

export default ProductRating;
