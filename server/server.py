#!/usr/bin/env python

import tornado.ioloop
import tornado.web
import tornado.websocket

import logging
import json
import pandas

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")
    
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
        print("WebSocket opened")

    def on_message(self, message):
        res = {}
        try:
            logging.debug(message)
            js_message = json.loads(message)
            func_name = js_message["function"]
            if func_name not in self.functions:
                raise Exception("{} function not found".format(func_name))
            if "kwargs" in js_message and "args" in js_message:
                res = self.functions[func_name](*js_message["args"],**js_message["kwargs"])
            elif "args" in js_message:
                res = self.functions[func_name](*js_message["args"])
            elif "kwargs" in js_message:
                res = self.functions[func_name](**js_message["kwargs"])
            else:
                res = self.functions[func_name]()
            res = {
                "success":True,
                "error_msg":None,
                "res": res
            }
        except Exception, e:
            res = {
                "success":False,
                "error_msg":str(e),
                "res":None
            }
        finally:
            self.write_message(json.dumps(res))
    
    def on_close(self):
        print("WebSocket closed")

class y43():
    def __init__(self, socket = y43WebSocket):
        self.functions = {}
        self.web_app = tornado.web.Application([
        (r"/", MainHandler),
        (r"/websocket", socket),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./www"}),
        ])

    def register_web_function(self, func):
        self.functions[func.__name__] = func
        print(func.__name__)
        return func
    
    def start(self, port = 8888):
        self.port = port
        logging.warning("Server is starting on {:d} port...".format(port))
        self.web_app.listen(port)
        tornado.ioloop.IOLoop.current().start()

class my_y43WebSocket(y43WebSocket):
    def __init__(self,*args, **kwargs):
        super(my_y43WebSocket, self).__init__(*args, **kwargs)
        self.register_web_function(self.hello_world)
    
    def hello_world(self):
        return "hello world with register_web_function"



if __name__ == "__main__":
    server = y43(my_y43WebSocket)
    server.start(8888)
