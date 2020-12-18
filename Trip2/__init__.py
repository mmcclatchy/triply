from urllib import parse
from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
import requests
import copy
import json
import os
import datetime


class TripClass:
    def __init__(self, **kwargs):
        self.useThisUrlToGetCordsForAPoint = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&fields=place_id,geometry&key=" + os.environ.get("BACKEND_API_KEY") + "&input="
        self.basicDirectionUrl = "https://maps.googleapis.com/maps/api/directions/json?key=" + os.environ.get("BACKEND_API_KEY")
        return None
    
    def createNewTrip(self, start, end, milesToRefuel, timeBetweenStops, endTimeForDay, startDateTime, avoidTolls):
        # get the start coordinates for the trip from a string
        url = self.useThisUrlToGetCordsForAPoint + parse.quote(start)
        r = requests.get(url)
        r = r.json()
        startCor = r["candidates"][0]["geometry"]["location"]

        # get the end coordinates for the trip from a string
        url = self.useThisUrlToGetCordsForAPoint + parse.quote(end)
        r = requests.get(url)
        r = r.json()
        endCor = r["candidates"][0]["geometry"]["location"]

        # gets or estimates miles till refuel
        #  a safe bet for distance between refules by default
        self.cache = {}
        if milesToRefuel:
            self.cache["milesToRefuel"] = milesToRefuel
        else:
            self.cache["milesToRefuel"] = 12 * 25

        # generate direction from google
        url = self.basicDirectionUrl + "&origin=" + str(startCor["lat"]) + "," + str(startCor["lng"])
        url += "&destination=" + str(endCor["lat"]) + "," + str(endCor["lng"])
        if avoidTolls:
            url += "&avoid=tolls"
        r = requests.get(url)
        r = r.json()

        # set up cache
        cache = {
            "milesToRefuel": milesToRefuel,
            "timeBetweenStops": timeBetweenStops,
            "endTimeForDay": endTimeForDay,
            "stopArray": [{"time": startDateTime, "gas": True}],
            "startLocation" : startCor,
            "endLocation": endCor
        }
        self.cache = cache

        # attach cache to directions and return directions
        r["cache"] = cache
        return json.dumps(r)

    def createFromJson(self, json):
        info = json.loads(json)
        self.cache = info[cache]
        





t = TripClass()
t.createNewTrip("Santa Rosa, California", "Petaluma, California", 100, 2, 2, 2, False)    