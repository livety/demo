$(document).ready(function(){
  var database = firebase.database().ref('demo/');
  $('#Start').on('click',function(){
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log(database);
  });
});
