var phantom = require('phantom');
var http = require('http');
var sys = require('sys');

phantom.create('--config=/phantom_proxy.json', function(ph){
  function requestHandler(req, res) {
    var proxySettings = {
      port: process.env.ORIGIN_PORT,
      host: process.env.ORIGIN_HOST,
      url: "http://"+process.env.ORIGIN_HOST + ":" + process.env.ORIGIN_PORT + req.url
    };

    var toBeProxied = (req.url == '/' && req.method == "GET");

    if (toBeProxied == false) {
      try {
        sys.log("No JS Proxy Request");
        sys.log(req.connection.remoteAddress + ": " + req.method + " " + req.url);
        var request_options = { 
          hostname: proxySettings.host, 
          port: proxySettings.port,
          path: req.url,
          method: req.method, 
          headers: req.headers
        };

        var proxy_request = http.request(request_options, function (proxy_response) {
          proxy_response.addListener('data', function(chunk) {
            sys.log("proxyresponse receiving data");
            res.write(chunk, 'binary');
          });
          proxy_response.addListener('end', function() {
            sys.log("proxyresponse about to end");
            res.end();
          });
          res.writeHead(proxy_response.statusCode, proxy_response.headers);
          sys.log("Status: "+proxy_response.statusCode);
        });
        req.addListener('data', function(chunk) {
          sys.log("proxyrequest receiving data");
          proxy_request.write(chunk, 'binary');
        });
        req.addListener('end', function() {
          sys.log("proxyrequest receiving data");
          proxy_request.end();
        });
      } catch (exception) {
        sys.log(exception);
      }
    } else {
      sys.log("JS Proxy Request")
      sys.log(req.connection.remoteAddress + ": " + req.method + " " + req.url);
      ph.createPage(function(page){
        page.set("onCallback", function() {
          sys.log("calling Back");
          page.evaluate(function() {
            return document.getElementsByTagName('html')[0].innerHTML;
          }, function(result){
            res.write(result);
            res.end();
            sys.log("Response written")
            sys.log((""+result+"").slice(0, 500))
            //page.close();
          });
        });

        page.set("onConsoleMessage", function(msg) {
          try{
            if(msg)
              sys.log("page console: " + msg);
          } catch(err) {
            sys.log(err);
          }
        });

        page.set("onInitialized", function() {
          sys.log("initialized");
          page.evaluate(function(){
            var started_at = (new Date).getTime();
            var ready = function(){
              var is_ready = document.getElementsByTagName('body')[0].getAttribute("ready");
              var time_expired = (((new Date).getTime()-started_at) > 5000);
              if(is_ready == "true" || time_expired){
                if(time_expired && console && console.log){
                  console.log("time expired"); 
                }
                window.callPhantom();
              } else {
                setTimeout(ready, 100);
              };
            };
            ready();
          });
        });

        page.open(proxySettings.url, function(status){
          sys.log("PhantomJS Page.open ", proxySettings.url);
          res.writeHead(200, {'Content-Type': 'text/html'});
        });
      });
    };
  };
     
  http.createServer(requestHandler).listen(process.env.PROXY_LISTEN_PORT);
});
