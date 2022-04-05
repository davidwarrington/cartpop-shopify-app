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
        console.log(`Failed to process webhook: ${error}`);
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
        const linkId = req.params.id;
        console.log(`UPDATE LINK ${linkId} ENDPOINT`);
        await Links.update(req, res);
        res.status(200).send();
      } catch (error) {
        console.log(`Failed to process webhook: ${error}`);
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
        console.log(`Failed to process webhook: ${error}`);
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
        console.log(`GET LINK ENDPOINT`);
        const link = await Links.get(req, res);
        res.status(200).send(link);
      } catch (error) {
        console.log(`Failed to process webhook: ${error}`);
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
        const linkId = req.params.id;
        console.log(`DELETE LINK ${linkId} ENDPOINT`);
        await Links.delete(req, res);
        res.status(200).send();
      } catch (error) {
        console.log(`Failed to process webhook: ${error}`);
        res.status(500).send(error.message);
      }
    }
  );
}
