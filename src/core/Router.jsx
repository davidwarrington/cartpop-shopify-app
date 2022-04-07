import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HelpScout } from "../components/HelpScout";
import { Home, Settings, NewLink, EditLink } from "../pages";
import AppProvider from "./AppProvider";

const Router = () => {
  return (
    <BrowserRouter>
      <HelpScout />
      <Routes>
        <Route path="/" element={<AppProvider />}>
          <Route index element={<Home />} />
          <Route path="links/new" element={<NewLink />} />
          <Route path="links/:id" element={<EditLink />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
