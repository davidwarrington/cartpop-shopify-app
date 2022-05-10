import { useCart } from "../hooks";

const Loader = () => {
  const { link, handleCheckoutRedirect } = useCart();

  if (
    link.settings &&
    link.settings.destination &&
    ["cart", "checkout"].includes(link.settings.destination)
  ) {
    handleCheckoutRedirect({ destination: link.settings.destination });
  }

  return <>Loading...</>;
};

export default Loader;
