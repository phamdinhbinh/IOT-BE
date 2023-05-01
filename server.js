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
                console.log("Message sent")
            }
        });
    }
}

publishMessage('esp8266-master/sub', '{"relay_1":0}')

const app = express()
const port = 3001

/*
Cấu hình CORS policy
 */
app.use(cors(
    {
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        // origin: '*',
        credentials: true,
        exposedHeaders: ["set-cookie"]
    }
));

/*
Cấu hình body parser
*/
var bodyParser = require('body-parser');
const connection = require('./app/commons/connect');
const moment = require('moment');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
cron.schedule('* * * * *', () => {
    let c= (JSON.parse(condition.message))
    // console.log('This function will run minute second');
    connection.query("SELECT state, device, startPoint, endPoint, timeStart, timeEnd, mode FROM stage_item WHERE date= ?", [moment(new Date()).format("DD/MM/YYYY")], (err, data)=> {
        if(err) throw err
        const {startPoint, endPoint, device, state, timeStart, timeEnd, mode }= data[0]
        if(device=== 1) { // máy bơm
            if(mode=== 1) { // độ ẩm
                if(parseFloat(startPoint) <= parseFloat(c?.humi) && parseFloat(endPoint) >= parseFloat(c?.humi)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                       if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                            console.log("ON máy bơm")
                            publishMessage('esp8266-master/sub', '{"relay_1":1}') // bật máy bom

                       }
                       else { // trong khoảng thời gian và trạng thái tắt
                            // không làm gì cả

                       }
                    }
                    else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                        if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                            console.log("OFF máy bơm")
                            publishMessage('esp8266-master/sub', '{"relay_1":0}') // Tắt máy bơm
                        }
                        else { // ngoài khoảng thời gian và trạng thái tắt
                           // không làm gì cả
                        }
                    }
                }
            }
            if(mode=== 2) { // nhiệt độ
                if(parseFloat(startPoint) <= parseFloat(c?.temp) && parseFloat(endPoint) >= parseFloat(c?.temp)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON máy bơm")
                             publishMessage('esp8266-master/sub', '{"relay_1":1}') // bật máy bom
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF máy bơm")
                             publishMessage('esp8266-master/sub', '{"relay_1":0}') // Tắt máy bơm
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
            if(mode=== 3) { // ánh sáng
                if(parseFloat(startPoint) <= parseFloat(c?.light) && parseFloat(endPoint) >= parseFloat(c?.light)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON máy bom")
                             publishMessage('esp8266-master/sub', '{"relay_1":1}') // bật máy bom
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF máy bơm")
                             publishMessage('esp8266-master/sub', '{"relay_1":0}') // Tắt máy bơm
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
        }
        // 
        if(device=== 2) { // quạt 
            if(mode=== 1) { // độ ẩm
                if(parseFloat(startPoint) <= parseFloat(c?.humi) && parseFloat(endPoint) >= parseFloat(c?.humi)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                       if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                            console.log("ON quạt")
                            publishMessage('esp8266-master/sub', '{"relay_2":1}') // bật quạt

                       }
                       else { // trong khoảng thời gian và trạng thái tắt
                            // không làm gì cả

                       }
                    }
                    else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                        if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                            console.log("OFF quạt")
                            publishMessage('esp8266-master/sub', '{"relay_2":0}') // Tắt quạt
                        }
                        else { // ngoài khoảng thời gian và trạng thái tắt
                           // không làm gì cả
                        }
                    }
                }
            }
            if(mode=== 2) { // nhiệt độ
                if(parseFloat(startPoint) <= parseFloat(c?.temp) && parseFloat(endPoint) >= parseFloat(c?.temp)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON quạt")
                             publishMessage('esp8266-master/sub', '{"relay_2":1}') // bật quạt
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF quạt")
                             publishMessage('esp8266-master/sub', '{"relay_2":0}') // Tắt quạt
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
            if(mode=== 3) { // ánh sáng
                if(parseFloat(startPoint) <= parseFloat(c?.light) && parseFloat(endPoint) >= parseFloat(c?.light)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON quạt")
                             publishMessage('esp8266-master/sub', '{"relay_2":1}') // bật quạt
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF quạt")
                             publishMessage('esp8266-master/sub', '{"relay_2":0}') // Tắt quạt
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
        }
        //
        if(device=== 3) { // đèn
            if(mode=== 1) { // độ ẩm
                if(parseFloat(startPoint) <= parseFloat(c?.humi) && parseFloat(endPoint) >= parseFloat(c?.humi)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                       if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                            console.log("ON đèn")
                            publishMessage('esp8266-master/sub', '{"relay_3":1}') // bật đèn

                       }
                       else { // trong khoảng thời gian và trạng thái tắt
                            // không làm gì cả

                       }
                    }
                    else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                        if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                            console.log("OFF đèn")
                            publishMessage('esp8266-master/sub', '{"relay_3":0}') // Tắt đèn
                        }
                        else { // ngoài khoảng thời gian và trạng thái tắt
                           // không làm gì cả
                        }
                    }
                }
            }
            if(mode=== 2) { // nhiệt độ
                if(parseFloat(startPoint) <= parseFloat(c?.temp) && parseFloat(endPoint) >= parseFloat(c?.temp)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON")
                             publishMessage('esp8266-master/sub', '{"relay_3":1}') // bật máy bom
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF đèn")
                             publishMessage('esp8266-master/sub', '{"relay_3":0}') // Tắt đèn
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
            if(mode=== 3) { // ánh sáng
                if(parseFloat(startPoint) <= parseFloat(c?.light) && parseFloat(endPoint) >= parseFloat(c?.light)) {
                    if(moment(timeStart, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) && moment(timeEnd, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đang trong khoảng thời gian
                        if(state=== 1) { // trong khoảng thời gian và trạng thái bật
                             console.log("ON")
                             publishMessage('esp8266-master/sub', '{"relay_3":1}') // bật máy bom
 
                        }
                        else { // trong khoảng thời gian và trạng thái tắt
                             // không làm gì cả
 
                        }
                     }
                     else if(moment(timeStart, "HH:mm:ss").isAfter( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss")) || moment(timeEnd, "HH:mm:ss").isBefore( moment(moment(new Date()).format("HH:mm:ss"), "HH:mm:ss"))) { // Đã ngoài khoảng thời gian
                         if(state=== 1) { // Đã ngoài khoảng thời gian và trạng thái bật
                             console.log("OFF đèn")
                             publishMessage('esp8266-master/sub', '{"relay_3":0}') // Tắt đèn
                         }
                         else { // ngoài khoảng thời gian và trạng thái tắt
                            // không làm gì cả
                         }
                     }
                }
            }
        }
        
    })

  });
/*
Các routers 
*/
require('./app/routers/history_data.router')(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})