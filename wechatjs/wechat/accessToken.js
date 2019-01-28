var http = require('http');
var https = require('https');
//var JSON = require('JSON');
var child_process = require('child_process');
var fs =require('fs');

var appID = 'wx71e215af5551f27f';
var appSecret = 'f984b69e27b6fe04e22af1d88826f50f';

var ACCESS_TOKEN = "";

//GetAccessToken
//��Ҫ��ʱ�������û�ȡ��΢�ŷ�������ͨ����Կ
exports.GetAccessToken = function (appid, secret)
{
	appID=appid||appID;
	appSecret=secret||appSecret;

	var tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appID+"&secret="+appSecret;

	try
	{
		https.get(tokenUrl, function(response)
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
				console.log("here: access_token: "+data.access_token.toString());
				//johnny
				ACCESS_TOKEN = data.access_token.toString();
				console.log('ACCESS_TOKEN = ' + ACCESS_TOKEN);
			});
		});

	}
	catch(err)
	{
		console.log('GetAccessToken abnormal error!');
	}
	
}

//GetMedia
//����curl��ʹ��http������ʽ
exports.GetMedia = function (accessToken, mediaid, filepath)
{
	aToken = accessToken || ACCESS_TOKEN;
	var mediaUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token="+aToken+"&media_id="+mediaid;
	http.get(mediaUrl, function(response)
	{
		var chunks = [];
		var size = 0;
		
		response.on('data', function (chunk)
		{
			chunks.push(chunk);
			size += chunk.length;
		});
		
		response.on('end', function ()
		{
			var data = new Buffer(size);
			for (var i = 0, pos = 0, l = chunks.length; i < l; i++)
			{
				var chunk = chunks[i];
				chunk.copy(data, pos);
				pos += chunk.length;
			}
			fs.writeFile(filepath, data, function (err)
			{
				if(err)
					throw err;
				else
					console.log('GetMedia saved!');
			});
		});

	});
}


//GetMediaEx
//�ݹ����ԣ���ʽʹ��ǧ������ô��
exports.GetMediaTest = function (mediaid, filepath)
{
	var tokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appID+"&secret="+appSecret;
	https.get(tokenUrl, function(res)
	{
		var json = '';
		res.setEncoding('utf8');
		res.on('data', function (body)
		{
			json += body;
		});
		
		res.on('end', function ()
		{
			var data=JSON.parse(json);
			console.log("access_token: "+data.access_token.toString());
			
			var mediaUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token="+data.access_token.toString()+"&media_id="+mediaid;
			http.get(mediaUrl, function(response)
			{
				var chunks = [];
				var size = 0;
				
				response.on('data', function (chunk)
				{
					chunks.push(chunk);
					size += chunk.length;
				});
				
				response.on('end', function ()
				{
					var datas = new Buffer(size);
					for (var i = 0, pos = 0, l = chunks.length; i < l; i++)
					{
						var chunk = chunks[i];
						chunk.copy(datas, pos);
						pos += chunk.length;
					}
					fs.writeFile(filepath, datas, function (err)
					{
						if(err)
							throw err;
						else
							console.log('GetMedia saved!');
					});
				});
			});
			
		});
	});
}
