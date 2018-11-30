var URL = '192.168.0.250'
var PORT = '9091'

var ros2 = new ROSLIB.Ros({
  url : 'ws://192.168.0.250:9091'
});

var ros = new ROSLIB.Ros({
  url : 'ws://' + URL + ':' + PORT
});


ros.on('connection', function() {
  console.log('Connected to websocket server.');
  document.getElementById("connection_status").style.borderColor = "green";
  document.getElementById("connection_status").style.color = "green";
  document.getElementById("connection_status").innerHTML = "CONNECTED";
});

ros.on('error', function(error) {
  console.log('Error connecting to websocket server: ', error);
  document.getElementById("connection_status").style.borderColor = "red";
  document.getElementById("connection_status").style.color = "red";
  document.getElementById("connection_status").innerHTML = "ERROR";
});

ros.on('close', function() {
  console.log('Connection to websocket server closed.');
  document.getElementById("connection_status").style.borderColor = "red";
  document.getElementById("connection_status").style.color = "red";
  document.getElementById("connection_status").innerHTML = "CLOSED";
});

// Emotion topic
// -----------------


var behaviorClient = new ROSLIB.ActionClient({
  ros : ros,
  serverName : '/flexbe/execute_behavior',
  actionName : 'flexbe_msgs/BehaviorExecutionAction'
});

var cmdvel_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/cmd_vel',
  messageType : 'geometry_msgs/Twist'
});

var emotion_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/sara_face/Emotion',
  messageType : 'std_msgs/UInt8'
});

var brightness_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/sara_face/Brightness',
  messageType : 'std_msgs/UInt8'
});

var head_pitch_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/sara_head_pitch_controller/command',
  messageType : 'std_msgs/Float64'
});

var flexbe_execute_behavior_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/flexbe/execute_behavior/goal',
  messageType : 'flexbe_msgs/BehaviorExecutionActionGoal'
});

var sara_say_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/sara_say',
  messageType : 'std_msgs/String'
});

var head_yaw_topic = new ROSLIB.Topic({
  ros : ros,
  name : '/sara_head_yaw_controller/command',
  messageType : 'std_msgs/Float64'
});

var wm_say = new ROSLIB.Service({
  ros : ros,
  name : '/wm_say',
  serviceType : 'wm_tts/say_service'
});

var wm_soundboard = new ROSLIB.Service({
  ros : ros,
  name : '/wm_play_sound',
  serviceType : 'wm_sound_library/play_service'
});

var run_trajectory = new ROSLIB.Service({
  ros : ros,
  name : '/run_trajectory',
  serviceType : 'wm_trajectory_manager/run_trajectory'
});

function play_sound(filename) {
  var str = new ROSLIB.Message({data : filename});
  var request = new ROSLIB.ServiceRequest({play : str});
  wm_soundboard.callService(request, function(result){});
}

function move(filename) {

var request = new ROSLIB.ServiceRequest({
      file : filename
});
run_trajectory.callService(request, function(result) {});
}

function emotion(emo){
var emotion = new ROSLIB.Message({
  data : emo
});
console.log("Emotion : " + emo);
emotion_topic.publish(emotion)
}



function move_front(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.2,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}

function move_stop(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}

function twist_left(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.5
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}

function front_twist_left(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.2,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.4
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}
function front_twist_right(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.2,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : -0.4
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}

function twist_right(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : -0.5
  }
});
console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}



function move_back(){
var mvmt = new ROSLIB.Message({
  linear : {
    x : -0.2,
    y : 0.0,
    z : 0.0
  },
  angular : {
    x : 0.0,
    y : 0.0,
    z : 0.0
  }
});

console.log("Move : " + mvmt);
cmdvel_topic.publish(mvmt)
}

function brightness(value){
var bright = new ROSLIB.Message({
  data : Number(value)
});
console.log("Brightness : " + value);
brightness_topic.publish(bright)
}

function setHeadPitch(value){
var pitch = new ROSLIB.Message({
  data : Number(value)
});
console.log("Head pitch : " + value);
head_pitch_topic.publish(pitch)
}

function setHeadYaw(value){
var yaw = new ROSLIB.Message({
  data : Number(value)
});
console.log("Head Yaw : " + value);
head_yaw_topic.publish(yaw)
}

function sayText(value){

  var msg = new ROSLIB.Message({
    sentence : value,
    emotion : 0
  });

  var request = new ROSLIB.ServiceRequest({say : msg});

  wm_say.callService(request, function(result) {});
}

function sayHelloBehavior(){

  var behaviorGoal = new ROSLIB.Goal({
    actionClient : behaviorClient,
    goalMessage : {
      behavior_name : "Say_Hello",
      arg_keys : [],
      arg_values : [],
      input_keys : [],
      input_values : []
    }
  });

  behaviorGoal.send();
}

function stopBehavior(){

  var behaviorGoal = new ROSLIB.Goal({
    actionClient : behaviorClient,
    goalMessage : {
      behavior_name : "",
      arg_keys : [],
      arg_values : [],
      input_keys : [],
      input_values : []
    }
  });

  behaviorGoal.send();
}
function startTestBehavior(){

  var behaviorGoal = new ROSLIB.Goal({
    actionClient : behaviorClient,
    goalMessage : {
      behavior_name : "A Test Sandbox",
      arg_keys : [],
      arg_values : [],
      input_keys : [],
      input_values : []
    }
  });

  behaviorGoal.send();
}

function ActionWrapper_Pick_behavior_backup(){

  var behaviorGoal = new ROSLIB.Goal({
    actionClient : behaviorClient,
    goalMessage : {
      behavior_name : "ActionWrapper_Pick",
      arg_keys : [],
      arg_values : [],
      input_keys : ["Action"],
      input_values : ["Pick",object]
    }
  });

  behaviorGoal.send();
}

function ActionWrapper_Pick_behavior(){

  var behaviorGoal = new ROSLIB.Goal({
    actionClient : behaviorClient,
    goalMessage : {
      behavior_name : "ActionWrapper_Pick",
      arg_keys : [],
      arg_values : [],
      input_keys : [],
      input_values : []
    }
  });

  behaviorGoal.send();
}
