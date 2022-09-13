import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { Car, cars as cars_list } from "./cars";

(async () => {
  const cars: Car[]  = cars_list;

  // Create an express application
  const app = express();
  // default port to listen
  const port = 8082;

  // use middleware so post bodies
  // are accessible as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name",
    ( req: Request, res: Response ) => {
      const { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    const { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post( "/persons",
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

    /**
     * @TODO Add an endpoint to GET a list of cars
     * it should be filterable by make with a query parameter
     */
  app.get("/cars/", (request: Request, response: Response) => {
      const { make } =  request.query;

      let cars_list = cars;

      if (make) {
          cars_list = cars.filter((car) => car.make === make);
      }
      return response.status(200)
            .send(cars_list);
    });

    /**
     * @TODO Add an endpoint to get a specific car
     * it should require id
     * it should fail gracefully if no matching car is found
     */
  app.get("/cars/:id", (request: Request, response: Response) => {
     let { id } = request.params;

     if ( !id ) {
         return response.status(400)
             .send(`id is required`);
     }

     // @ts-ignore
      const car = cars.filter((car1) => car1.id == id);

     if (car && car.length === 0) {
         return response.status(404).send(`car is not found`);
     }

     return response.status(200)
          .send(car);
  });

    /**
     * / @TODO Add an endpoint to post a new car to our list
     * it should require id, type, model, and cost
     */
  app.post("/cars/", (request: Request, response: Response) => {
        const { make, type, model, cost, id } = request.body;

        if ( !make || !type || !model || !cost || !id ) {
            return response.status(400)
                .send(`make, type, model, id are required`);
        }

        const new_car: Car = {
            make: make,
            type: type,
            model: model,
            cost: cost,
            id: id
      };

        cars.push(new_car);

        return response.status(201)
            .send(new_car);
    });

  // Start the Server
  app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(`server running http://localhost:${port}`);
      // tslint:disable-next-line:no-console
      console.log(`press CTRL+C to stop server`);
  });
})();
