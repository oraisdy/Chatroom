var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// app.get("/", function (req, res) {
// 	// res.send("hello world");
// 	res.sendFile(__dirname+'/public/index.html');
// });

// Routing
app.use(express.static(__dirname + '/public'));

var users = 0;
var system = '系统';
var roles = ['狼人', '预言家', '女巫', '猎人', '守卫', '村民'];
var roleNums = [0,0,0,0,0,0];

io.on('connection', function(client) {
	users++;
	client.index = Math.floor(Math.random() * 6);
	client.username = roles[client.index] + (roleNums[client.index]++||'');
	client.emit("user joined", {
		username: client.username
	});
	client.broadcast.emit('message arrived', {
		username: system,
		message: client.username + ' 加入',
	});
	client.broadcast.emit('message arrived', {
		username: system,
		message: '当前人数 ' + users,
	});
	client.emit('message arrived', {
		username: system,
		message: "你获得身份 " + client.username,
	});
	client.emit('message arrived', {
		username: system,
		message: '当前人数 ' + users,
	});

	client.on('disconnect', function() {
		users--;
		roleNums[client.index]--;
		client.broadcast.emit('message arrived', {
			username: system,
			message: client.username + ' 退出',
		});
		client.broadcast.emit('message arrived', {
			username: system,
			message: '当前人数 ' + users,
		});
	});

	client.on('send', function(data) {
		client.broadcast.emit('message arrived', {
			username: data.username,
			message: data.message,
		});
		client.emit('message arrived', {
			username: data.username,
			message: data.message,
		});
	});
});

server.listen(3000, function() {
	console.log("server is listerning port 3000");
});