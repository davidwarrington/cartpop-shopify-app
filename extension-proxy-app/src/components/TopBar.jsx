import { useShop } from "../hooks";

const TopBar = () => {
  const { logo_url } = useShop();

  if (!logo_url) {
    return null;
  }

  return (
    <div className="bg-white rounded-t-lg">
      <div className="relative flex justify-center py-2 border-b">
        <div className="h-10">
          <img className="h-full" src={logo_url} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
