window.onload = function() {

  var socket = io.connect(location.origin.replace(/^http/, 'ws'));

  var user = new User();

  socket.on('connect', function(){

    socket.emit('loadAll', user);

  });

  socket.on('loadAll', function(users){
    console.log(users);

    users.forEach(function(user, index){
      generateAvatar(user);
    });
  });

  socket.on('register', function(user){
    generateAvatar(user);
  });

  socket.on('logOff', function(user){
    var selector = '#id-' + user.id;
    $(selector).remove();
  });

  socket.on('updateColor', function(user){
    var selector = '#id-' + user.id;
    $(selector).css('background', user.color);
  });



  $(document).mouseup(function(){
    if(user.mobile){
      console.log('clicked');

      user.color = user.generateColor();
      $('body').css('background', user.color);

      socket.emit('updateColor', user);
    }
  });

}
