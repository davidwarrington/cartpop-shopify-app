import apiSession from "../../middleware/api-session.js";
import verifyRequest from "../../middleware/verify-request.js";
import Links from "./helpers/index.js";

const apiRoutePrefix = `/api/links`;

export default function apiLinks(app) {
  /*
        POST api/links
        
        > Create & save a new link for store of session shop
    */
  app.post(
    `${apiRoutePrefix}`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log("CREATE ENDPOINT");
        const newLinkId = await Links.create(req, res);
        res.status(200).send({
          id: newLinkId,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        PUT api/links/:id
        
        > Update link of id for store of session shop
    */
  app.put(
    `${apiRoutePrefix}/:id`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log(`UPDATE LINK ENDPOINT`);
        const success = await Links.update(req, res);
        res.status(200).send(success);
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        GET api/links
        
        > Return all links for store of session shop
    */
  app.get(
    `${apiRoutePrefix}`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log("GET ALL LINKS ENDPOINT");
        const links = await Links.all(req, res);
        res.status(200).send(links);
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        GET api/links/:id
        
        > Return link of id for store of session shop
    */
  app.get(
    `${apiRoutePrefix}/:id`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log(`GET LINK (Id) ENDPOINT`);
        const link = await Links.get(req, res);
        res.status(200).send(link);
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        GET api/links/alias/:alias
        
        > Return link of alias for store of session shop
    */
  app.get(
    `${apiRoutePrefix}/alias/:alias`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log(`GET LINK (Alias) ENDPOINT`);
        const link = await Links.getWithAlias(req, res);
        res.status(200).send(link);
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        api/links/:id
        
        > Delete link with id for store of session shop
    */
  app.delete(
    `${apiRoutePrefix}/:id`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log(`DELETE LINK ENDPOINT`);
        const success = await Links.remove(req, res);
        res.status(200).send(success);
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );

  /*
        api/links/:id/copy
        
        > Copy link with id for store of session shop
    */
  app.put(
    `${apiRoutePrefix}/:id/copy`,
    verifyRequest(app),
    apiSession(app),
    async (req, res) => {
      try {
        console.log(`COPY LINK ENDPOINT`);
        const newLinkId = await Links.copy(req, res);
        res.status(200).send({
          id: newLinkId,
        });
      } catch (error) {
        console.log(`Failed to process api request: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );
}
