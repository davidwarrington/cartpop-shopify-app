const apiRoutePrefix = `/api/links`;
import Links from "./helpers/index.js";

export default function apiLinks(app) {
  /*
        POST api/links/create
        
        > Create & save a new link for store of session shop
    */
  app.post(`${apiRoutePrefix}`, async (req, res) => {
    try {
      console.log("CREATE ENDPOINT");
      await Links.create(req, res);
      res.status(200).send();
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  /*
        PUT api/links/:id
        
        > Update link of id for store of session shop
    */
  app.put(`${apiRoutePrefix}/:id`, async (req, res) => {
    try {
      const linkId = req.params.id;
      console.log(`UPDATE LINK ${linkId} ENDPOINT`);
      await Links.update(req, res);
      res.status(200).send();
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  /*
        GET api/links
        
        > Return all links for store of session shop
    */
  app.get(`${apiRoutePrefix}`, async (req, res) => {
    try {
      console.log("GET ALL LINKS ENDPOINT");
      await Links.all(req, res);
      res.status(200).send();
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  /*
        GET api/links/:id
        
        > Return link of id for store of session shop
    */
  app.get(`${apiRoutePrefix}/:id`, async (req, res) => {
    try {
      const linkId = req.params.id;
      console.log(`GET LINK ${linkId} ENDPOINT`);
      await Links.get(req, res);
      res.status(200).send();
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  /*
        api/links/:id
        
        > Delete link with id for store of session shop
    */
  app.delete(`${apiRoutePrefix}/:id`, async (req, res) => {
    try {
      const linkId = req.params.id;
      console.log(`DELETE LINK ${linkId} ENDPOINT`);
      await Links.delete(req, res);
      res.status(200).send();
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });
}
