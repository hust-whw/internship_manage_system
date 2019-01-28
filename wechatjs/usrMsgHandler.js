var msgResponser = require('./wechat/msgResponser');
var http = require('http');
var JSON = require('JSON');
var base64Code = require('./base64Code/base64Code');

//Text
exports.handleText = function (res, msg)
{
	var keyword = msg.Content;
	
	msgResponser.responseText(res, msg, "usr 文本：" + keyword );
};

//Image
exports.handleImage = function (res, msg)
{
	var PicUrl = msg.PicUrl;
	var MediaId = msg.MediaId;

	console.log("MediaId:"+MediaId);

	var articles = [];
	articles[0] = 
	{
	    Title : "usr图片",
	    Description : "图片链接",
	    PicUrl : PicUrl,
	    Url : PicUrl
	};

	msgResponser.responseNews(res, msg, articles);
};

//Voice
exports.handleVoice = function (res, msg)
{
	var MediaId = msg.MediaId;
	var Format = msg.Format;
	var Recognition = msg.Recognition;
	
	console.log("MediaId:"+MediaId);

	if(!Recognition)//null
	{
		msgResponser.responseVoice(res, msg, MediaId);
	}
	else
	{
		msgResponser.responseText(res, msg, "usr 语音识别：" + Recognition );
	}
};

//Video
exports.handleVideo = function (res, msg)
{
	var MediaId = msg.MediaId;
	var ThumbMediaId = msg.ThumbMediaId;
	
	msgResponser.responseImage(res, msg, ThumbMediaId);
};

//location
exports.handleLocation = function (res, msg)
{
	var Latitude = msg.Location_X;
	var Longitude = msg.Location_Y;
	var Scale = msg.Scale;
	var Label = msg.Label;

	var convertUrl = "http://api.map.baidu.com/ag/coord/convert?x="+Longitude+"&y="+Latitude+"&from=2&to=4&mode=0";
	http.get(convertUrl, function(response)
	{
		var json = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk)
		{
			json += chunk;
		});
		
		response.on('end', function ()
		{
			var data=JSON.parse(json);
			var xCode=data.x;
			var yCode=data.y;
			Longitude=base64Code.base64decode(xCode.toString());
			Latitude=base64Code.base64decode(yCode.toString());
			
			var renderUrl = "http://api.map.baidu.com/telematics/v3/reverseGeocoding?&location="+Longitude+","+Latitude+"&coord_type=bd09ll&output=json&ak=KmVaLtYGzplEZOk0Wvy3ZXHK";
			http.get(renderUrl, function(response1)
			{
				var json1 = '';
				response1.setEncoding('utf8');
				response1.on('data', function (chunk1)
				{
					json1 += chunk1;
				});
				
				response1.on('end', function ()
				{
					var data1=JSON.parse(json1);
					var description=data1.description;
					
					var mapPic = "http://api.map.baidu.com/staticimage?center="+Longitude+","+Latitude+"&width=360&height=640&zoom=16&scale=2&markers="+Longitude+","+Latitude+"&markerStyles=l,";
					var mapUrl = "http://api.map.baidu.com/marker?location="+Latitude+","+Longitude+"&title=手动上报位置&output=html&src=汉擎定位";
					
					var articles = [];
					articles[0] = 
					{
					    Title : "手动上报地理位置",
					    Description : description.toString(),
					    PicUrl : mapPic,
					    Url : mapUrl
					};
				
					msgResponser.responseNews(res, msg, articles);
				});
			});

		});
	});
};

//event
exports.handleEvent_Subscribe = function (res, msg)
{
	msgResponser.responseText(res, msg, "欢迎订阅汉擎服务!");
};
exports.handleEvent_Scan = function (res, msg)
{
	var EventKey = msg.EventKey;
	msgResponser.responseText(res, msg, "扫描二维码："+EventKey);
};
exports.handleEvent_Location = function (res, msg)
{
	var Latitude = msg.Latitude;
	var Longitude = msg.Longitude;
	var Precision = msg.Precision;

	var convertUrl = "http://api.map.baidu.com/ag/coord/convert?x="+Longitude+"&y="+Latitude+"&from=0&to=4&mode=0";

	http.get(convertUrl, function(response)
	{
		var json = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk)
		{
			json += chunk;
		});
		
		response.on('end', function ()
		{
			var data=JSON.parse(json);
			var xCode=data.x;
			var yCode=data.y;
			Longitude=base64Code.base64decode(xCode.toString());
			Latitude=base64Code.base64decode(yCode.toString());
			
			var renderUrl = "http://api.map.baidu.com/telematics/v3/reverseGeocoding?&location="+Longitude+","+Latitude+"&coord_type=bd09ll&output=json&ak=KmVaLtYGzplEZOk0Wvy3ZXHK";
			http.get(renderUrl, function(response1)
			{
				var json1 = '';
				response1.setEncoding('utf8');
				response1.on('data', function (chunk1)
				{
					json1 += chunk1;
				});
				
				response1.on('end', function ()
				{
					var data1=JSON.parse(json1);
					var description=data1.description;
					
					var mapPic = "http://api.map.baidu.com/staticimage?center="+Longitude+","+Latitude+"&width=360&height=640&zoom=16&scale=2&markers="+Longitude+","+Latitude+"&markerStyles=l,";
					var mapUrl = "http://api.map.baidu.com/marker?location="+Latitude+","+Longitude+"&title=自动上报位置&output=html&src=汉擎定位";
					
					var articles = [];
					articles[0] = 
					{
					    Title : "自动上报地理位置",
					    Description : description.toString(),
					    PicUrl : mapPic,
					    Url : mapUrl
					};
				
					msgResponser.responseNews(res, msg, articles);
				});
			});

		});
	});
};
exports.handleEvent_Menu = function (res, msg)
{
	var EventKey = msg.EventKey;
	
	if(EventKey=="Event_Login")
	{
		msgResponser.responseText(res, msg, "usr 按键：登录" );
	}
	else
	{
		msgResponser.responseText(res, msg, "usr 按键：这是个什么按键..." );
	}

};
