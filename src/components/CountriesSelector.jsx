import { getName } from "country-list";
import { gql, useQuery } from "@apollo/client";
import { Select, Spinner } from "@shopify/polaris";

const GET_SHOP_COUNTIES = gql`
  {
    shop {
      shipsToCountries
    }
  }
`;

const CountriesSelector = ({ country }) => {
  const { loading, data } = useQuery(GET_SHOP_COUNTIES);

  if (loading) {
    return <Spinner size="small" />;
  }

  if (!data || !data.shop) {
    return <Select disabled={true} label="Country" />;
  }

  const countryOptions = data.shop.shipsToCountries.map((country) => ({
    label: getName(country),
    value: country,
  }));
  countryOptions.unshift({ label: "None", value: "" });

  return <Select label="Country" options={countryOptions} {...country} />;
};

export default CountriesSelector;
