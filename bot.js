//require request
const request = require('request');

//require file strucure
const fs = require('fs');

//require jsdom
const jsdom = require("jsdom");

const { JSDOM } = jsdom;


//url to check for codes
const url = "https://patriots.win/";

//require the discord.js module
const MessageEmbed = require('discord.js');
const MessageAttachment = require('discord.js');
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

//import login token
const auth = require('./auth.json');

function get_stickies(message, pg_source) {
	//stickied class = post stickied mobile_user 
	request(url, function (error, response, pg_source) {
		if(error || (response && response.statusCode) != "200")
			message.channel.send("Error reading stickies. Please message #neverson42#1672 so I can fix it! Thanks, fren.");
		else {
			var stickies_form = new Array();
			var doc = new JSDOM(pg_source);
			var numsticks = doc.window.document.getElementsByClassName("post stickied").length;
			//message.channel.send("There are currently "+ numsticks +" stickies on Patriots.win:");
			for (var i = 0; i < numsticks; i++) {
				format_post( message,
					//title
						doc.window.document.getElementsByClassName("post stickied")[i].getElementsByClassName('title')[0].innerHTML,
					//pic link or null
					//console.log(doc.window.document.getElementsByClassName("post stickied")[i].getElementsByClassName('draggable')[0].getAttribute('data-src'));
						((doc.window.document.getElementsByClassName("post stickied")[i].innerHTML.match('draggable')) ? doc.window.document.getElementsByClassName("post stickied")[i].getElementsByClassName('draggable')[0].getAttribute('data-src') : null),
					//link url
						doc.window.document.getElementsByClassName("post stickied")[i].getElementsByClassName('title')[0].getAttribute('href')
				);
			}
			return;
		}
	});
}

function format_post(message, title, pic, url) {
	const pref = "https://patriots.win"
	var discEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle(title)
		.setURL(pref+url);
	if(pic)
		discEmbed.setImage(pic);
	try {
		message.channel.send(discEmbed);
	}
	catch (e) {
		console.log(e);
	}
}

// this event will only trigger one time after logging in
// when the client is ready, run this code
client.once('ready', () => {
	client.user.setActivity("Patriots.win stickies bot!");
	console.log('Ready!');
});

client.on('message', message => {
	if(message.content.toLowerCase() == "!stickies") {
		request(url, function (error, response, pg_source) {
			if(error || (response && response.statusCode) != "200")
				message.channel.send("Error reading codes. Please message #neverson42#1672 so I can fix it! Thanks.");
			else {
				get_stickies(message, pg_source);
			}
		});
	}
});

// login to Discord with your app's token
client.login(auth.token);