const connection = require("../commons/connect")

const get_stage= async (req, res)=> {
    try {
        connection.query("SELECT * FROM stage", (err, data)=> {
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

module.exports= get_stage