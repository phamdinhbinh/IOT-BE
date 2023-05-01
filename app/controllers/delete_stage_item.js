const connection = require("../commons/connect")

const delete_stage_item= async (req, res)=> {
    try {
        const {stageItemId }= req.body
        connection.query("DELETE FROM stage_item WHERE stage_item_id= ?", [stageItemId], (err, data)=> {
            if(err) throw err
            else {
                // connection.query("SELECT * FROM ")
                return res.status(200).json(data)
            }
        })
    } catch (error) {
       return res.status(500).json(error) 
    }
}

module.exports= delete_stage_item