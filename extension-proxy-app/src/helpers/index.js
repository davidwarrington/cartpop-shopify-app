import Cart from "./cart.js";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export { classNames, Cart };
