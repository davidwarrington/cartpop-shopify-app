import { useShop } from "../hooks";

const TopBar = () => {
  const { logo_url, name } = useShop();

  return (
    <div className="bg-white rounded-t-lg">
      <div className="relative flex justify-center py-2">
        <div className="h-10 flex items-center font-medium">
          {logo_url ? (
            <img className="h-full" src={logo_url} alt="" />
          ) : (
            <h1>{name}</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
