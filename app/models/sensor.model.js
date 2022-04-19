const {connection: sql} = require("./db.js");
const {connection2: sql2} = require("./db.js");
// constructor
const Sensor = function(sensor) {
  this.email = sensor.email;
  this.name = sensor.name;
  this.token = sensor.token;
  this.password = sensor.password;
  this.active = sensor.active;
};

Sensor.create = (newSensor, result) => {
  sql.query("INSERT INTO users SET ?", newSensor, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("User Saved: ", { id: res.insertId, ...newSensor });
    result(null, { id: res.insertId, ...newSensor });
  });
};

Sensor.verifyFtoken = (body, result) => {
    sql.query(`select token from user_token where username = '${body.username}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length > 0) {
        if(res[0].token != body.token){
          result({ kind: "Invalid token" }, null);
          return;
        }
        
      }
      result(null, {...body});
      return;

    });
};

Sensor.tcheck = (user, result) => {
  sql.query(`select COUNT(*) as allcount from user_token where username = '${user.email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res[0].allcount > 0) {
      sql.query(`update user_token set token = '${user.token}' where username = '${user.email}'`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          // not found Sensor with the id
          result({ kind: "not_found" }, null);
          return;
        }
    
        console.log("updated user-token: ", { ...user });
        result(null, { ...user });
        return;
      });

    }else{
      sql.query("insert into user_token(username, token) values(?, ?)", [user.email, user.token], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          // not found Sensor with the id
          result({ kind: "not_found" }, null);
          return;
        }
    
        console.log("user-token inserted: ", { ...user });
        result(null, { ...user });
      });
    }
  });
};

Sensor.signin = (newUser, result) => {
  sql.query(`SELECT * FROM users WHERE email = '${newUser.user}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    }

    if (res.length) {
      //console.log("found sensor: ", res[0]);
      
      result(null, res[0]);
      return;
    }

    // not found Sensor with the id
    result({ kind: "not_found" }, null);
    return;
    //return res.json({ user: res[0], token: res[0].token });
  });
};

Sensor.findById = (sensorId, result) => {
  sql.query(`SELECT * FROM sensors WHERE id = ${sensorId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found sensor: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Sensor with the id
    result({ kind: "not_found" }, null);
  });
};

Sensor.getAll = (tableId, value, result) => {
  var sDate = value.split(",");
  sql.query(`SELECT * FROM sensor${tableId} WHERE (timeat BETWEEN '${sDate[0]}' AND '${sDate[1]}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getTAll = (value, result) => {
  var sDate = value.split(",");
  sql.query(`SELECT timeat, s1_pm25, s1_pm10, s2_pm25, s2_pm10, s3_pm25, s3_pm10, s4_pm25, s4_pm10, s5_pm25, s5_pm10, s6_pm25, s6_pm10, s7_pm25, s7_pm10, s8_pm25, s8_pm10, s9_pm25, s9_pm10, s10_pm25, s10_pm10, s11_pm25, s11_pm10, s12_pm25, s12_pm10 FROM sensors WHERE (timeat BETWEEN '${sDate[0]}' AND '${sDate[1]}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


Sensor.getCPAll = (tableId, value, result) => {
  var sDate = value.split(",");
  sql2.query(`SELECT * FROM cp${tableId} WHERE (timeat BETWEEN '${sDate[0]}' AND '${sDate[1]}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getAVAll = (tableId, value, result) => {
  var sDate = value.split(",");
  sql2.query(`SELECT * FROM av${tableId} WHERE (timeat BETWEEN '${sDate[0]}' AND '${sDate[1]}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getWeeklyAll = (tableId, result) => {
  sql.query(`SELECT avg(pm25) as pm25, avg(pm10) as pm10, timeat from sensor${tableId} where DATE_SUB(timeat, INTERVAL 1 WEEK ) group by Week(timeat) order by id desc limit 12`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getMonthlyAll = (tableId, result) => {
  sql.query(`SELECT avg(pm25) as pm25, avg(pm10) as pm10, timeat from sensor${tableId} where DATE_SUB(timeat, INTERVAL 1 MONTH ) group by Month(timeat) order by id desc limit 12`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getData = (tableId, result) => { 
  sql.query(`SELECT avg(pm25), avg(pm10), timeat from sensor${tableId} where DATE_SUB(timeat, INTERVAL 1 HOUR ) group by HOUR(timeat) order by id desc limit 72`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Sensor.getPm25 = (tableId, result) => {
  sql.query(`SELECT avg(pm25), avg(pm10), timeat  FROM sensor${tableId} where DATE_SUB(timeat, INTERVAL 1 DAY) group by DAY(timeat) order by id desc limit 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


Sensor.updateById = (id, sensor, result) => {
  sql.query(
    "UPDATE sensors SET email = ?, name = ?, active = ? WHERE id = ?",
    [sensor.email, sensor.name, sensor.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Sensor with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated sensor: ", { id: id, ...sensor });
      result(null, { id: id, ...sensor });
    }
  );
};

Sensor.remove = (id, result) => {
  sql.query("DELETE FROM sensors WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Sensor with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted sensor with id: ", id);
    result(null, res);
  });
};

Sensor.removeAll = result => {
  sql.query("DELETE FROM sensors", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} sensors`);
    result(null, res);
  });
};

module.exports = Sensor;