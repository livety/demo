$(document).ready(function(){
  var data = document.querySelector('a-scene').systems.firebase.data;
  $('#Start').on('click',function(){
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log(data);
  });
});
