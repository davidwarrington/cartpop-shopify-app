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
        res.status(200).send({
          ...shopData,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        Get api/shop/translations
        
        > Get shop translations
    */
  app.get(
    `${apiRoutePrefix}/translations`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        const translations = await Shop.getTranslations(req, res);
        res.status(200).send({
          ...translations,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        Put api/shop/translations
        
        > Update shop translations
    */
  app.put(
    `${apiRoutePrefix}/translations`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        const success = await Shop.updateTranslations(req, res);
        res.status(200).send({
          success: success,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        Put api/shop/settings
        
        > Update shop settings
    */
  app.put(
    `${apiRoutePrefix}/settings`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        const success = await Shop.updateSettings(req, res);
        res.status(200).send({
          success: success,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );
}
