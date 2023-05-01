var HistoryData = require('../models/history_data.model');

exports.all = function (req, res) {
    var data = req.body;
    HistoryData.all(data, function (response) {
        res.send({ result: response });
    });
}

exports.filter = function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var sort = req.params.sort;
    HistoryData.filter(from, to, sort, function (response) {
        res.send({ result: response });
    });
}

exports.add = function (req, res) {
    var data = req.body;
    HistoryData.add(data, function (response) {
        res.send({ result: response });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    HistoryData.delete(id, function (response) {
        res.send({ result: response });
    });
};

exports.update = function (req, res) {
    var data = req.body;
    HistoryData.update(data, function (response) {
        res.send({ result: response });
    });
};