const Sensor = require("../models/sensor.model.js");
const utils = require('../../utils');
const jwt = require('jsonwebtoken');
const {connection: sql} = require("../models/db");
const mqtt = require('mqtt');

const host = '89.47.165.123'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'sasautomation',
  password: 'sasautomation',
  reconnectPeriod: 1000,
})
/*const topic = ''
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})*/
client.on('message', (topic, payload) => {
  //console.log('Received Message:', topic, payload.toString())
})
client.on('connect', () => {
  console.log("Connection established.")
  /*client.publish('iitb_sensor1/', 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })*/

})



// Create and Save a new Sensor
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const userData = {
    name: req.body.name,
    username: req.body.email,
    isAdmin: true
  };

  // generate token
  const token = utils.generateToken(userData);
  // Create a Sensor
  const user = new Sensor({
    email: req.body.email,
    name: req.body.name,
    token: token,
    password: req.body.password,
    active: false
  });
  // Save Sensor in the database
  Sensor.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Sensor."
      });
    else res.send(data);
  });
};

exports.signin = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  
  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }
  const u = {user, pwd};
  
  // Save Sensor in the database
  Sensor.signin(u, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while login."
      });
    }
    else{
      console.log(data); //res.send(data);
      if (user !== data.email || pwd !== data.password) {
        return res.status(401).json({
          error: true,
          message: "Username or Password is Wrong."
        });
      }
      if (!data.token) {
        return res.status(400).json({
          error: true,
          message: "Token is required."
        });
      }
      jwt.verify(data.token, process.env.JWT_SECRET, function (err, user) {
        if (err) return res.status(401).json({
          error: true,
          message: "Your License has been expired!"
        });
        
        });
        // Generate token here
        const userData = {
          username: user,
          name: data.name
        };
      
        // generate token
        const token = utils.generateFToken(userData);
        const userD = new Sensor({
          email: req.body.username,
          name: data.name,
          token: token
        });

        Sensor.tcheck(userD, (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while checking the user-token."
            });
          else
            console.log(data);
            
      });

        /*
        if (data.active) {
          return res.status(400).json({
            error: true,
            message: "Please logout from other device first!"
          });
        }
        sql.query("UPDATE users SET active = 1 WHERE email= ?",data.email , (err, res) => {
          if (err) {
            console.log("error: ", err);
            return res.status(500).json({
              error: true,
              message: "Some error occurred while login."
            });
          }
    
        });*/

        
        return res.json({ user: userD, token: data.token });
    } 
  });
};

exports.signout = (req, res) => {
  const email = req.body.email;
  
  sql.query("UPDATE users SET active = 0 WHERE email= ?",email , (err, res) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({
        error: true,
        message: "Some error occurred while logout."
      });
    }
    
  });
  return res.json({ email: email });
};

exports.verify = (req, res) => {
  const token = req.body.token || req.query.token; //this is F Token from user
  const username = req.body.user.email || req.query.user.email;
  const u = {token, username};
  Sensor.verifyFtoken(u, (err, data) => {
    if (err){
      console.log("error");
        res.status(401).send({
        message: err.message || "Token is required."
      });
    }
    else{ res.send(data); }
  });
};

// Retrieve all Sensors from the database.
exports.findAll = (req, res) => {
    Sensor.getAll(req.params.tableId, req.params.value, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      else res.send(data);
    });
  };

// Retrieve all Sensors from the database.
exports.findTAll = (req, res) => {
  Sensor.getTAll(req.params.value, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    else res.send(data);
  });
};

exports.store = (req, res) => {
  accessKey = "habvuhybduifhbhjBinng"
  const key = req.headers['accesskey'];
  if(key != accessKey){
    res.status(401).send({
      message: err.message || "Invalid AccessKey."
  });
}
  else{
    const sensor_id = req.body["SensorId"];
    const pm25_atm_a = req.body["pm2_5_atm"];
    const pm25_atm_b = req.body["pm2_5_atm_b"];
    const pm25_cf_1_a = req.body["pm2_5_cf_1"];
    const pm25_cf_1_b = req.body["pm2_5_cf_1_b"];
    const pm10_atm_a = req.body["pm10_0_atm"];
    const pm10_atm_b = req.body["pm10_0_atm_b"];
    const pm10_cf_1_a = req.body["pm10_0_cf_1"];
    const pm10_cf_1_b = req.body["pm10_0_cf_1_b"];
    const pm25_atm = (pm25_atm_a + pm25_atm_b)/2;
    const pm10_atm = (pm10_atm_a + pm10_atm_b)/2;
    const temp_f = req.body["current_temp_f"];
    const humidity = req.body["current_humidity"];
    const pressure = req.body["pressure"];
    // write store logic here change as per table. [IMP]
    console.log(sensor_id);
    // Publishing HERE
    //const result = {sensor_id, pm25_atm, pm10_atm, temp_f, humidity, pressure}
    //String(sensor_id)
    //result = String(sensor_id)+","+String(pm25_atm)+","+String(pm10_atm)+","+String(temp_f)+","+String(humidity)+","+String(pressure)
    client.publish('iitb_sensor1/', String(sensor_id)+","+String(pm25_atm)+","+String(pm10_atm)+","+String(temp_f)+","+String(humidity)+","+String(pressure) , { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
    // compare sensorid then save
    sql.query("insert into iitb_sensor1(pm2_5_atm_a, pm2_5_atm_b, pm2_5_cf_1_a, pm2_5_cf_1_b, pm10_atm_a, pm10_atm_b, pm10_cf_1_a, pm10_cf_1_b, pm2_5_atm, pm10_atm, temp_f, humidity, pressure) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [pm25_atm_a, pm25_atm_b, pm25_cf_1_a, pm25_cf_1_b, pm10_atm_a, pm10_atm_b, pm10_cf_1_a, pm10_cf_1_b, pm25_atm, pm10_atm, temp_f, humidity, pressure], (err, res) => {
      if (err) {
        console.log("error: ", err);
        res.status(401).send({
          message: err.message || "Error occured while dumping."
    });
  }
});
    console.log("Record has been saved.");
  }
};

// Retrieve all Sensors from the database.
exports.findCPAll = (req, res) => {
  Sensor.getCPAll(req.params.tableId, req.params.value, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    else res.send(data);
  });
};

exports.retrieveSensor =(req, res) =>{
  Sensor.getRetrieveSensor(req.params.value, (err, data) => {
    if(err)
    res.status(500).send({
      message:
      err.message|| "Some error occurred while retrieving data."
    });
    else res.send(data);
  })
};

// Retrieve all Sensors from the database.
exports.findAVAll = (req, res) => {
  Sensor.getAVAll(req.params.tableId, req.params.value, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    else res.send(data);
  });
};

// Retrieve all Sensors data weekly from the database.
exports.findWeeklyAll = (req, res) => {
  Sensor.getWeeklyAll(req.params.tableId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving weekly data."
      });
    else res.send(data);
  });
};

// Retrieve all Sensors data weekly from the database.
exports.findMonthlyAll = (req, res) => {
  Sensor.getMonthlyAll(req.params.tableId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving monthly data."
      });
    else res.send(data);
  });
};

// Retrieve all Sensors for bar graph AQI from the database.
exports.findData = (req, res) => {
  Sensor.getData(req.params.tableId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving bar data."
      });
    else res.send(data);
  });
};

// Retrieve live value of PM25.
exports.findPm25 = (req, res) => {
  Sensor.getPm25(req.params.tableId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pm25 Live data."
      });
    else res.send(data);
  });
};



/*
// Retrieve all Registered Users from the database.
exports.findAll = (req, res) => {
  Sensor.getAll(req.params.userId, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    else res.send(data);
  });
};*/

// Find a single Sensor with a sensorId
exports.findOne = (req, res) => {
    Sensor.findById(req.params.sensorId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Sensor with id ${req.params.sensorId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Sensor with id " + req.params.sensorId
          });
        }
      } else res.send(data);
    });
  };

// Update a Sensor identified by the sensorId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Sensor.updateById(
    req.params.sensorId,
    new Sensor(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Sensor with id ${req.params.sensorId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Sensor with id " + req.params.sensorId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Sensor with the specified sensorId in the request
exports.delete = (req, res) => {
  Sensor.remove(req.params.sensorId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Sensor with id ${req.params.sensorId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Sensor with id " + req.params.sensorId
        });
      }
    } else res.send({ message: `Sensor was deleted successfully!` });
  });
};

// Delete all Sensors from the database.
exports.deleteAll = (req, res) => {
  Sensor.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sensors."
      });
    else res.send({ message: `All Sensors were deleted successfully!` });
  });
};