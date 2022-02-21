module.exports = app => {
    const sensors = require("../controllers/sensor.controller.js");
  

    // Create a new Product
    app.post("/users/register", sensors.create);

    // Sign in User
    app.post("/users/signin", sensors.signin);

    // Signout User
    app.post("/users/signout", sensors.signout);
  
    // Retrieve all Data
    app.get("/sensors/:tableId/:value", sensors.findAll);

    // Retrieve All tables data
    app.get("/sensor/all/:value", sensors.findTAll);

    // Retrieve CP Data
    app.get("/cp/:tableId/:value", sensors.findCPAll);

    // Retrieve AV Data
    app.get("/av/:tableId/:value", sensors.findAVAll);

     // Retrieve weekly Data
     app.get("/sensor/week/:tableId", sensors.findWeeklyAll);

     // Retrieve monthly Data
     app.get("/sensor/month/:tableId", sensors.findMonthlyAll);

    //Retrieve bar informations
    app.get("/sensor/bar/:tableId", sensors.findData);

    //Retrieve live value of pm25
    app.get("/sensor/pm25/:tableId", sensors.findPm25);

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