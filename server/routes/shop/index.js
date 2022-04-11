import apiSession from "../../middleware/api-session.js";
import verifyRequest from "../../middleware/verify-request.js";
import Shop from "./helpers/index.js";

const apiRoutePrefix = `/api/shop`;

export default function apiShop(app) {
  /*
        Get api/shop
        
        > Get shop data
    */
  app.get(
    `${apiRoutePrefix}`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        const shopData = await Shop.get(req, res);
        console.log("shopData", shopData);
        res.status(200).send({
          ...shopData,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );
}
