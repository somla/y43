#!/usr/bin/env python

import tornado.ioloop
import tornado.web
import tornado.websocket

import logging
import json
import numpy
import pandas
import time

class y43MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect("/index.html")
    
    def post(self):
        self.write("Hello post")
    
    def file(self):
        self.write("Hello file")


class y43WebSocket(tornado.websocket.WebSocketHandler):
    def __init__(self, *args, **kwargs):
        super(y43WebSocket, self).__init__(*args, **kwargs)
        self.functions = {}
        self.register_web_function(self.debug_echo)


    def debug_echo(self, *args, **kwargs):
        return {"args":list(args),"kwargs":dict(kwargs)}


    def register_web_function(self,func, func_name = None):
        if func_name is None:
            func_name = func.__name__
        if func_name in self.functions:
            raise "Function has beeen registrated"
        self.functions[func_name] = func
    

    def open(self):
        logging.debug("WebSocket opened client ip: {}".format(self.request.remote_ip))

    def on_message(self, message):
        try:
            res = {
                "req_arrive_time": time.time(),
                "req_sending_time": None,
                "call_id":None,
            }
            logging.debug(message)
            js_message = json.loads(message)
            func_name = js_message["function"]
            if "call_id" in js_message:
                res["call_id"] = js_message["call_id"]
            if "req_sending_time" in js_message:
                res["req_sending_time"] = js_message["req_sending_time"]
            if func_name not in self.functions:
                raise Exception("{} function not found".format(func_name))
            if "kwargs" in js_message and "args" in js_message:
                res["res"] = self.functions[func_name](*js_message["args"],**js_message["kwargs"])
            elif "args" in js_message:
                res["res"] = self.functions[func_name](*js_message["args"])
            elif "kwargs" in js_message:
                res["res"] = self.functions[func_name](**js_message["kwargs"])
            else:
                res["res"] = self.functions[func_name]()
            res["success"] = True
            res["error_msg"] = None
        except Exception, e:
            res["success"]=False
            res["error_msg"]=str(e)
            res["res"]=None
        finally:
            #res["resp_sending_time"] = time.time()
            self.write_message(json.dumps(res))
    
    def on_close(self):
        logging.debug("WebSocket closed client ip: {}".format(self.request.remote_ip))

class StaticFileHandlerWithNoCache(tornado.web.StaticFileHandler):
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

class y43():
    def __init__(self, socket = y43WebSocket, cache=True):
        StaticFileHandler = tornado.web.StaticFileHandler
        if not cache:
            StaticFileHandler = StaticFileHandlerWithNoCache
        self.functions = {}
        self.web_app = tornado.web.Application([
        (r"/", y43MainHandler),
        (r"/websocket", socket),
        (r"/(.*)", StaticFileHandler, {"path": "./www"}),
        ])

    def register_web_function(self, func):
        self.functions[func.__name__] = func
        logging.info("registered function: {}".format(func.__name__))
        return func
    
    def start(self, port = 8888):
        self.port = port
        logging.info("Server is starting on {:d} port...".format(port))
        self.web_app.listen(port)
        tornado.ioloop.IOLoop.current().start()

class my_y43WebSocket(y43WebSocket):
    def __init__(self,*args, **kwargs):
        super(my_y43WebSocket, self).__init__(*args, **kwargs)
        self.register_web_function(self.hello_world)
        self.register_web_function(self.random_table)
    
    def hello_world(self):
        return "hello world with register_web_function"

    def random_table(self,length = 100, width = 4,orient="values" ):
        df = pandas.DataFrame(numpy.random.randint(0,100,size=(length, width)), columns=list('ABCD'))
        return df.to_json(orient=orient)

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    server = y43(my_y43WebSocket, cache=False)
    server.start(8888)
