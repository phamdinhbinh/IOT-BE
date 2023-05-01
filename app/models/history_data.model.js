const { domainToUnicode } = require('url');
const db = require('../commons/connect');

const HistoryData = function (historyData) {
    this.id = historyData.id;
    this.temp = historyData.temp;
    this.humi = historyData.humi;
    this.soil_moisture = historyData.soil_moisture;
    this.light = historyData.light;
    this.date_time = historyData.date_time;
}

HistoryData.all = function (data, result) {
    try {
        var queryString = `SELECT * FROM history_data ORDER BY id DESC`;
        
        db.query(queryString, function (err, history_data) {
            if (err) {
                result(
                    {
                        "status": "error",
                        "data": null,
                        "message": err
                    }
                );
            }
            else {
                result(
                    {
                        "status": "success",
                        "data": history_data,
                        "message": null
                    }
                );
            }
        });
    } catch (error) {
        return null;
    }

}

HistoryData.filter = function (from, to, sort, result) {
    try {
        var queryString = `SELECT * FROM history_data WHERE date_time BETWEEN '${from}' AND '${to}' ORDER BY id ${sort}`;
        db.query(queryString, function (err, history_data) {
            if (err) {
                result(
                    {
                        "status": "error",
                        "data": null,
                        "message": err
                    }
                );
            }
            else {
                result(
                    {
                        "status": "success",
                        "data": history_data,
                        "message": null
                    }
                );
            }
        });
    } catch (error) {
        return null;
    }

}


HistoryData.add = function (data, result) {
    try {
        db.query("INSERT INTO history_data SET ?", data, function (err, history_data) {
            if (err) {
                result(
                    {
                        "status": "error",
                        "data": null,
                        "message": err
                    }
                );
            }
            else {
                result(
                    {
                        "status": "success",
                        "data": { id: history_data.insertId, ...data },
                        "message": null
                    }
                );
            }
        });
    } catch (error) {
        return null;
    }
}

HistoryData.delete = function (id, result) {
    try {
        db.query(`DELETE FROM lbcs_lightbox WHERE Id = ?`, id, function (err, history_data) {
            if (err) {
                result(
                    {
                        "status": "error",
                        "data": null,
                        "message": err
                    }
                );
            }
            else {
                result(
                    {
                        "status": "success",
                        "data": history_data,
                        "message": null
                    }
                );
            }
        });
    } catch (error) {
        return null;
    }
}

module.exports = HistoryData;