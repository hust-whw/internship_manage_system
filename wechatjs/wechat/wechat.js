var TOKEN = 'wechat';

/*
 * include
 */
var url = require('url');
var querystring = require('querystring');
var crypto = require('crypto');
var xml2js = require('xml2js');

//默认消息处理器
var msgHandler = require('./defaultMsgHandler');

/***************
 * 入口
 ***************/
exports.process = function (req, res, usrMsgHandler, token)
{
	msgHandler=usrMsgHandler||msgHandler;
	TOKEN=token||TOKEN;
	
	var method = req.method;
	
	//处理wechat类型的请求
	if(method == 'GET')
	{
		console.log("method:GET");
		checkSignature(req, res);
	}
	else
	{
		console.log("method:POST");
		responseMsg(req, res);
	}
};

/***************
 * 签名认证
 ***************/
function checkSignature(req, res)
{
  var queryObj = querystring.parse(url.parse(req.url).query);
  
  var signature = queryObj.signature;
  var timestamp = queryObj.timestamp;
  var nonce = queryObj.nonce;

	var tmpArr = [TOKEN, timestamp, nonce];
	tmpArr = tmpArr.sort();
	
	var tmpStr = tmpArr[0] + tmpArr[1] + tmpArr[2];
	var sha1 = crypto.createHash('sha1');
	tmpStr = sha1.update(tmpStr).digest('hex');

	var echostr = queryObj.echostr;

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end((tmpStr === signature) ? echostr : '');
};

/***************
 * 消息响应
 ***************/
function responseMsg(req, res)
{
	var xml = '';
	
	req.setEncoding('utf8');
	req.on('data', function (chunk)
	{
		xml += chunk;
	});

	req.on('end', function ()
	{
		xml2js.parseString(xml, function (errors, response) 
		{
			if (null !== errors)
			{
				console.log(errors);
				
				return;
			}
			
			var data = response.xml;
			
			var msg = {};
			msg.ToUserName = data.ToUserName[0];
			msg.FromUserName = data.FromUserName[0];
			msg.CreateTime = data.CreateTime[0];
			msg.MsgType = data.MsgType[0];

			console.log("ToUserName: "+msg.ToUserName);
			console.log("FromUserName: "+msg.FromUserName);

			switch(msg.MsgType)
			{
				case "text":
					console.log("MsgType:text");
					msg.Content = data.Content[0];
        	
					msgHandler.handleText(res, msg);
					break;
				
				case "image":
					console.log("MsgType:image");
					msg.PicUrl = data.PicUrl[0];
					msg.MediaId = data.MediaId[0];
					
					msgHandler.handleImage(res, msg);
					break;
				
				case "voice":
					console.log("MsgType:voice");
					msg.MediaId = data.MediaId[0];
					msg.Format = data.Format[0];
					msg.Recognition = data.Recognition[0];
					
					msgHandler.handleVoice(res, msg);
					break;
				
				case "video":
					console.log("MsgType:video");
	        		msg.MediaId = data.MediaId[0];
	       			msg.ThumbMediaId = data.ThumbMediaId[0];

					msgHandler.handleVideo(res, msg);
					break;
				
				case "location":
					console.log("MsgType:location");
	    			msg.Location_X = data.Location_X[0];
	    			msg.Location_Y = data.Location_Y[0];
	    			msg.Scale = data.Scale[0];
	    			msg.Label = data.Label[0];
	   
					msgHandler.handleLocation(res, msg);
					break;
				
				case "event":
					console.log("MsgType:event");
    			msg.Event = data.Event[0];
    			
					//订阅
					if (msg.Event == "subscribe")
					{
						console.log("MsgType:event");
						msgHandler.handleEvent_Subscribe(res, msg);
					}
					else if (msg.Event == "SCAN")
					{
						msg.EventKey = data.EventKey[0];
						msg.Ticket = data.Ticket[0];
						msgHandler.handleEvent_Scan(res, msg);
					}
					else if (msg.Event == "LOCATION")
					{
						msg.Latitude=data.Latitude[0];
						msg.Longitude=data.Longitude[0];
						msg.Precision=data.Precision[0];
						
						msgHandler.handleEvent_Location(res, msg);
					}
					else if (msg.Event == "CLICK")
					{
						msg.EventKey = data.EventKey[0];
						msgHandler.handleEvent_Menu(res,msg);
					}
					else if(msg.Event=='unsubscribe')
					{
						msg.EventKey = data.EventKey[0];
						msgHandler.handleEvent_UnSubscribe(res,msg);
					}
					else
					{
						console.log('unhandled event: ' + msg.Event);
					}

					break;
				
				default:
					console.log("MsgType:default");
			}
			
		});
	});

};
