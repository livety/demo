$(document).ready(function(){
  $('#Start').on('click',function(){
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log(document.querySelector('a-scene').systems.firebase.firebase.entities);
);
  });
});
