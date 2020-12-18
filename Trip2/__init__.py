from urllib import parse
from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
import requests
import copy
import json
import os
import datetime


# To Do:
    #  work with datetimes properly
    #  check hotel as we go through

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
            "metersToRefuel": metersToRefuel,
            "timeBetweenStops": timeBetweenStops,
            "endTimeForDay": endTimeForDay,
            "stopArray": [{"time": startDateTime, "gas": True}],
            "startLocation": startCor,
            "endLocation": endCor
        }
        self.cache = cache

        # attach cache to directions and return directions
        r["cache"] = cache
        self.directions = r
        return json.dumps(r)

    def createFromJson(self, Json):
        info = json.loads(Json)
        self.directions = info
        self.cache = info["cache"]

    def getDistanceBetweenTwoPoints(self, c1, c2):
        # approximate radius of earth in meters
        R = 6378137

        lat1 = radians(c1["lat"])
        lon1 = radians(c1["lng"])
        lat2 = radians(c2["lat"])
        lon2 = radians(c2["lng"])

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))

        distance = R * c
        return distance

    def getNextStopLocation(self):
        legs = self.directions["routes"][0]["legs"]
        buffer = 0
        distance = 0
        timeTillNextHotel = self.getTimeTillNextHotel
        # to figure out if there is another stop
        end = False
        for leg in legs:
            end = False
            if leg["duration"]["value"] + buffer > self.cache["timeBetweenStops"]:
                break
            if leg["duration"]["value"] + buffer > timeTillNextHotel:
                break
            buffer += leg["duration"]["value"]
            distance += leg["distance"]["value"]
            end = True
        if end:
            return None

        # at this point, we have the correct leg and know there will be another stop

        for step in leg["steps"]:
            if step["duration"]["value"] + buffer > self.cache["timeBetweenStops"]:
                break
            if step["duration"]["value"] + buffer > timeTillNextHotel:
                break
            buffer += step["duration"]["value"]
            distance += step["distance"]["value"]
        
        averageMetersPerMileInStep = step["distance"]["value"] / step["duration"]["value"]
        vertextes = decodePolyline(step["polyline"]["points"])
        lastVertext = step["start_location"]
        
        hotelStop = False
        for vertext in vertextes:
            distanceToNextVertext = self.getDistanceBetweenTwoPoints(lastVertext, vertext)
            timeToNextVertext = 1 / (distanceToNextVertext * averageMetersPerMileInStep)
            if buffer + timeToNextVertext > self.cache["timeBetweenStops"]:
                break
            if buffer + timeToNextVertext > timeTillNextHotel:
                hotelStop = True
                break
            buffer += timeToNextVertext
            distance += distanceToNextVertext
            lastVertext = vertext

        #we now have the vertext. Now we need to look for the places nearby
        needGas = distance * 2 > self.cache["metersToRefuel"]
        return{
            "location": vertext,
            'hotelStop': hotelStop,
            'gasStop': needGas
        }

    def getTimeTillNextHotel(self):
        return 100000000

    def nextNextStopDetails(self, foodQuery):
        

    
        


        





t = TripClass()
# t.createNewTrip("Santa Rosa, California", "Petaluma, California", 100, 2, 2, 2, False) 
t.createFromJson(t.createNewTrip("4625 Parktrail ct, santa rosa, ca", "San Diego, California", 100, 5555, 2, 2, False))
t.getNextStopDetails("mexican")