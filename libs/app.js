$(document).ready(function(){
  var data = AFRAME.utils.entity.getComponentProperty;
  var positionCube = data('#cube','position',components['position']);
  $('#Start').on('click',function(){
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log(positionCube);
  });
});
