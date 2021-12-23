const sql = require("./db.js");

// constructor
const Sensor = function(sensor) {
  this.email = sensor.email;
  this.name = sensor.name;
  this.active = sensor.active;
};

Sensor.create = (newSensor, result) => {
  sql.query("INSERT INTO sensors SET ?", newSensor, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created sensor: ", { id: res.insertId, ...newSensor });
    result(null, { id: res.insertId, ...newSensor });
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

Sensor.getAll = (tableId, result) => {
  sql.query(`SELECT * FROM sensor${tableId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("sensors: ", res);
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