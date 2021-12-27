module.exports = app => {
    const sensors = require("../controllers/sensor.controller.js");
  
    // Create a new Product
    app.post("/users/register", sensors.create);
  
    // Retrieve all Products
    app.get("/sensors/:tableId", sensors.findAll);

    // Retrieve all Users
    //app.post("/users/:userId", sensors.findAll);
  
    // Retrieve a single Product with sensorId
    app.get("/sensors/:sensorId", sensors.findOne);
  
    // Update a Product with sensorId
    app.put("/sensors/:sensorId", sensors.update);
  
    // Delete a Product with sensorId
    app.delete("/sensors/:sensorId", sensors.delete);
  
    // Create a new Product
    app.delete("/sensors", sensors.deleteAll);
  };