const { v4 } = require("uuid")
const connection = require("../commons/connect")

const add_stage= async (req, res)=> {
    try {
        const {startDate, endDate }= req.body
        const stage_id= v4()
        connection.query("INSERT INTO stage(stage_id, startDate, endDate) VALUES(?, ?, ?)", [stage_id, startDate, endDate], (err, data)=> {
            if(err) {
                throw err
            }
            return res.status(200).json({add: true, stage_id})
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

module.exports= add_stage