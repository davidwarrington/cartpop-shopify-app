const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const findVariant = (product, variantId) =>
  product.variants.find((variant) => variant.id == variantId);

const getUtmParameters = (type = "string") => {
  const url_string = window.location.href;
  const url = new URL(url_string);
  const utm_id = url.searchParams.get("utm_id");
  const utm_source = url.searchParams.get("utm_source");
  const utm_medium = url.searchParams.get("utm_medium");
  const utm_campaign = url.searchParams.get("utm_campaign");
  const utm_term = url.searchParams.get("utm_term");

  if (!utm_id && !utm_source && !utm_medium && !utm_campaign) {
    return null;
  }

  const utmParameters = {
    utm_id: utm_id || null,
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    utm_term: utm_term || null,
  };

  if (type === "string") {
    let utmString = "";
    Object.keys(utmParameters).map(
      (key, index) =>
        (utmString += `${index > 0 ? "&" : ""}${key}=${utmParameters[key]}`)
    );
    return utmString;
  }

  return utmParameters;
};

export { classNames, findVariant, getUtmParameters };
