$(document).ready(function(){
  var data = AFRAME.utils.entity.getComponentProperty;
  $('#Start').on('click',function(){
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log(data);
  });
});
