exports.responseText = function(res,msg,contentStr)
{
	var time = Math.round(new Date().getTime() / 1000);
	
	res.writeHead(200,
	{
		'Content-Type' : 'text/xml'
	});

	var textMsg = "" + 
		"<xml>" +
      "<ToUserName><![CDATA[" + msg.FromUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + msg.ToUserName + "]]></FromUserName>" +
      "<CreateTime>" + time + "</CreateTime>" +
      "<MsgType><![CDATA[text]]></MsgType>" +
      "<Content><![CDATA[" + contentStr + "]]></Content>" +
		"</xml>";
	
	res.end(textMsg);
};

exports.responseImage = function(res,msg,mediaId)
{
	var time = Math.round(new Date().getTime() / 1000);
	res.writeHead(200,
	{
		'Content-Type' : 'text/xml'
	});

	var imageMsg =  "" + 
		"<xml>" +
      "<ToUserName><![CDATA[" + msg.FromUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + msg.ToUserName + "]]></FromUserName>" +
      "<CreateTime>" + time + "</CreateTime>" +
      "<MsgType><![CDATA[image]]></MsgType>" +
      "<Image>" +
				"<MediaId><![CDATA[" + mediaId + "]]></MediaId>" +
			"</Image>" +
		"</xml>";

	res.end(imageMsg);
};

exports.responseVoice = function(res,msg,mediaId)
{
	var time = Math.round(new Date().getTime() / 1000);
	
	res.writeHead(200,
	{
		'Content-Type' : 'text/xml'
	});

	var imageMsg =  "" + 
		"<xml>" +
      "<ToUserName><![CDATA[" + msg.FromUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + msg.ToUserName + "]]></FromUserName>" +
      "<CreateTime>" + time + "</CreateTime>" +
      "<MsgType><![CDATA[voice]]></MsgType>" +
      "<Voice>" +
				"<MediaId><![CDATA[" + mediaId + "]]></MediaId>" +
			"</Voice>" +
		"</xml>";

	res.end(imageMsg);
};

exports.responseNews = function(res,msg,articles)
{
	var time = Math.round(new Date().getTime() / 1000);
	
	res.writeHead(200,
	{
		'Content-Type' : 'text/xml'
	});

	var newsMsg =  "" + 
		"<xml>" +
      "<ToUserName><![CDATA[" + msg.FromUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + msg.ToUserName + "]]></FromUserName>" +
      "<CreateTime>" + time + "</CreateTime>" +
      "<MsgType><![CDATA[news]]></MsgType>" +
			"<ArticleCount>" + articles.length + "</ArticleCount>" +
			"<Articles>";

  for (var i in articles)
  {
    newsMsg +=
      "<item>" + 
      "<Title><![CDATA[" + (articles[i].Title || '') + "]]></Title>" + 
      "<Description><![CDATA[" + (articles[i].Description || '') + "]]></Description>" + 
      "<PicUrl><![CDATA[" + (articles[i].PicUrl || '') + "]]></PicUrl>" + 
      "<Url><![CDATA[" + (articles[i].Url ||'') + "]]></Url>" + 
      "</item>";
  }
  
  newsMsg +=
  		"</Articles>" + 
  	"</xml>";
  
	res.end(newsMsg);
};
