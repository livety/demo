$(document).ready(function(){
  $('#Start').on('click',function(){
    document.querySelector('#Start').emit('fade');
    var entities = [].slice.call(document.querySelectorAll("#Start"));
    entities.forEach(function (el) { el.emit('start'); });
    console.log("je suis cliqué");
  });
});
