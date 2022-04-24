import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HelpScout } from "../components/HelpScout";
import {
  Home,
  SettingsIndex,
  SettingsGeneral,
  SettingsLinks,
  SettingsReorder,
  SettingsBilling,
  SettingsTranslations,
  NewLink,
  DynamicLink,
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
    <Route path="dynamic" element={<DynamicLink />} />
    <Route path=":id" element={<EditLink />} />
  </Routes>
);

const Settings = () => (
  <Routes>
    <Route path="/" element={<SettingsIndex />} />
    <Route path="general" element={<SettingsGeneral />} />
    <Route path="links" element={<SettingsLinks />} />
    <Route path="billing" element={<SettingsBilling />} />
    <Route path="reorder" element={<SettingsReorder />} />
    <Route path="translations" element={<SettingsTranslations />} />
  </Routes>
);
