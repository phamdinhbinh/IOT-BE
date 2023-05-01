const connection = require("../commons/connect")

const edit_stage_item= async (req, res)=> {
    try {
        const {device, mode, startPoint, endPoint, state, timeStart, timeEnd, stageItemId }= req.body
        connection.query("UPDATE stage_item SET device= ?, mode= ?, startPoint= ?, endPoint= ?, state= ?, timeStart= ?, timeEnd= ? WHERE stage_item_id= ?", [device, mode, startPoint, endPoint, state, timeStart, timeEnd, stageItemId], (err, data)=> {
            if(err) throw err
            else {
                // connection.query("SELECT * FROM ")
                return res.status(200).json({update: true})
            }
        })
    } catch (error) {
       return res.status(500).json(error) 
    }
}

module.exports= edit_stage_item