import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getShop } from "../helpers";

export function HelpScout() {
  const location = useLocation();

  useEffect(() => {
    const HELPSCOUT_BEACON_ID = process.env.HELPSCOUT_BEACON_ID;

    if (!HELPSCOUT_BEACON_ID || typeof Beacon === "undefined") {
      return;
    }

    // Initialize Beacon
    window.Beacon("init", HELPSCOUT_BEACON_ID);

    // Identify
    const shop = getShop();
    Beacon("identify", {
      shop: shop,
      // TODO: signature: secureTokenSig || null,
      // TODO: name: user && `${user.firstName} ${user.lastName}` || '',
      // TODO: company: data.name || '',
      // TODO: email: user && user.email || email,
      // TODO: subscription_plan: plan || "FREE",
      // TODO: shopify_plan: shopifyPlan,
    });
  }, []);

  useEffect(() => {
    // Close Beacon whenever route changes
    Beacon && Beacon("close");
    Beacon && Beacon("suggest");
  }, [location]);

  return null;
}
