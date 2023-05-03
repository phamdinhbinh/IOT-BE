const connection = require("../commons/connect")

const add_stage_item= async (req, res)=> {
    // console.log(req.body)
    try {
        const {device, mode, startPoint, endPoint, timeStart, timeEnd, stage_id, state, date }= req.body
        connection.query("INSERT INTO stage_item(device, mode, startPoint, endPoint, state, timeStart, timeEnd, stage_id, date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [device, mode, startPoint, endPoint, state, timeStart, timeEnd, stage_id, date], (err, data)=> {
            if(err) {
                throw err
            }
            return res.status(200).json({add: true})
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

module.exports= add_stage_item