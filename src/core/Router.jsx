import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Home, Settings } from "../pages";
import AppProvider from "./AppProvider";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppProvider />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
