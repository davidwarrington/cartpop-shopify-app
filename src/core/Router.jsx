import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HelpScout } from "../components/HelpScout";
import {
  Home,
  SettingsIndex,
  SettingsGeneral,
  SettingsReorder,
  NewLink,
  EditLink,
} from "../pages";
import AppProvider from "./AppProvider";

const Router = () => {
  return (
    <BrowserRouter>
      <HelpScout />
      <Routes>
        <Route path="/" element={<AppProvider />}>
          <Route index element={<Home />} />
          <Route path="links/*" element={<Links />} />
          <Route path="settings/*" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

const Links = () => (
  <Routes>
    {/* TODO: <Route path="/" element={<LinksIndex />} /> */}
    <Route path="new" element={<NewLink />} />
    <Route path=":id" element={<EditLink />} />
  </Routes>
);

const Settings = () => (
  <Routes>
    <Route path="/" element={<SettingsIndex />} />
    <Route path="general" element={<SettingsGeneral />} />
    <Route path="reorder" element={<SettingsReorder />} />
  </Routes>
);
