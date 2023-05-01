const connection = require("../commons/connect")

const detail_stage= async (req, res)=> {
    try {
        connection.query("SELECT * FROM stage_item WHERE stage_id= ?", [req.query.stage_id], (err, data)=> {
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

module.exports= detail_stage