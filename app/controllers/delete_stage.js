const connection = require("../commons/connect")

const delete_stage= async (req, res)=> {
    try {
        const {stageId }= req.body
        connection.query("DELETE FROM stage WHERE stage_id= ?", [stageId], (err, data)=> {
            if(err) throw err
            else {
                // connection.query("SELECT * FROM ")
                connection.query("DELETE FROM stage_item WHERE stage_id= ?", [stageId], (err, data)=> {
                    if(err) throw err
                    return res.status(200).json({delete: true})
                })
            }
        })
    } catch (error) {
       return res.status(500).json(error) 
    }
}

module.exports= delete_stage