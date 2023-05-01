const add_stage = require('../controllers/add_stage.controller');
const add_stage_item = require('../controllers/add_stage_item.controller');
const delete_stage = require('../controllers/delete_stage');
const delete_stage_item = require('../controllers/delete_stage_item');
const detail_stage = require('../controllers/detail_stage');
const edit_stage_item = require('../controllers/edit_stage_item.controller');
const get_stage = require('../controllers/get_stage');

module.exports = router = function(router){
    var historyData = require('../controllers/history_data.controller');
    
    router.get("/api/history-data/all/",  historyData.all);

    router.get("/api/history-data/filter/:from/:to/:sort",  historyData.filter);

    router.post("/api/history-data/add", historyData.add);
    
    router.delete("/api/history-data/delete/:id", historyData.delete);

    router.put("/api/history-data/update", historyData.update);

    router.post("/api/add-stage", add_stage)

    router.post("/api/add-stage/item", add_stage_item)
    
    router.get("/api/stage", get_stage)

    router.get("/api/detail-stage", detail_stage)

    router.patch("/api/edit/stage-item", edit_stage_item)

    router.delete("/api/delete-stage-item", delete_stage_item)

    router.delete("/api/delete/stage", delete_stage)
};