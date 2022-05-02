// TODO: we don't currently have access to variant quantity...

const UrgencyBanner = ({ selectedVariant }) => {
  const message = "Only {{quantity}} left in stock".replace(
    "{{quantity}}",
    selectedVariant
  );

  return <>{message}</>;
};

export default UrgencyBanner;
