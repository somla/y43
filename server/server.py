#!/usr/bin/env python

import tornado.ioloop
import tornado.web
import tornado.websocket

import logging
import json
import numpy
import pandas
import time

from y43.y43 import *

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
