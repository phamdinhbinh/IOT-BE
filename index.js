const cors = require('cors');
const express = require('express')
const cron = require('node-cron');
const mqtt= require('mqtt');

var options = {
    protocol: "ws",
    username: "",
    password: "",
    keepalive: 2000,
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8), // clinetId
};
let condition= {}
var host = "mqtt://broker.hivemq.com:8000/mqtt";
const client= mqtt.connect(host, options)

client.on('connect', () => {
    client.subscribe('esp8266-master/pub');
    console.log('Connected');
});
client.on('error', (err) => {
    console.error('Connection error: ', err);
    client.end();
});
client.on('reconnect', () => {
    console.log('Reconnecting');
});
client.on('message', (topic, message) => {
    const payload = { topic, message: message.toString() };
    condition= payload
    // console.log(payload)
    // onMessage(payload);
});

function publishMessage(topic, message) {
    if (client) {
        client.publish(topic, message, 1, error => {
            if (error) {
                console.log('Publish error: ', error);
            }
            else {
                // console.log("Message sent")
            }
        });
    }
}

// publishMessage('esp8266-master/sub', '{"relay_1_stage":0}')

const app = express()
const port = 4000

/*
Cấu hình CORS policy
 */
app.use(cors());

/*
Cấu hình body parser
*/
var bodyParser = require('body-parser');
const connection = require('./app/commons/connect');
const moment = require('moment');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
cron.schedule(' * * * * *', () => {
    let c= (JSON.parse(condition.message))
    console.log('This function will run minute second');
    connection.query("SELECT state, device, startPoint, endPoint, timeStart, timeEnd, mode FROM stage_item WHERE date= ?", [moment(new Date()).format("DD/MM/YYYY")], (err, data)=> {
        console.log(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")
        if(err) throw err
        if(data?.length > 0) {
            data.forEach((row) => {
                const {startPoint, endPoint, device, state, timeStart, timeEnd, mode }= row;
        
                if(device=== 1) { // máy bơm
                    if(mode=== 1) { // độ ẩm
                        if(parseFloat(startPoint) <= parseFloat(c?.soil_moisture) && parseFloat(endPoint) >= parseFloat(c?.soil_moisture)) {
                            if(moment(timeStart, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_1_stage":1}')
                            }
                            if(moment(timeEnd, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_1_stage":0}')

                            }
                        }   
                        
                    }
                    
                }
                //
                if(device=== 2) { // quạt
                    if(mode=== 2) { // nhiệt độ
                        if(parseFloat(startPoint) <= parseFloat(c?.temp) && parseFloat(endPoint) >= parseFloat(c?.temp)) {
                            if(moment(timeStart, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_2_stage":1}')
                            }
                            if(moment(timeEnd, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_2_stage":0}')

                            }
                        }   
                        
                    }
                    
                }
                if(device=== 3) { // đèn
                    if(mode=== 3) { // light
                        if(parseFloat(startPoint) <= parseFloat(c?.light) && parseFloat(endPoint) >= parseFloat(c?.light)) {
                            if(moment(timeStart, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_3":1}')
                            }
                            if(moment(timeEnd, "HH:mm:ss").format("HH:mm") === moment(new Date()).format("HH:mm")) {
                                publishMessage('esp8266-master/sub', '{"relay_3":0}')

                            }
                        }   
                        
                    }
                    
                } 
                
               
            })
            console.log("* * * *")
            //  const {startPoint, endPoint, device, state, timeStart, timeEnd, mode }= data[0]
        
        }
       
        
    });

  });
/*
Các routers 
*/
require('./app/routers/history_data.router')(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})