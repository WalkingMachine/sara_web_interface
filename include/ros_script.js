var ros = new ROSLIB.Ros({
  url : 'ws://192.168.1.229:9091'
});

ros.on('connection', function() {
  console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
  console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
  console.log('Connection to websocket server closed.');
});

// Emotion topic
// -----------------

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

function brightness(value){
var bright = new ROSLIB.Message({
  data : Number(value)
});
console.log("Brightness : " + value);
brightness_topic.publish(bright)
}
