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
        self.basicLocalSearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + os.environ.get("BACKEND_API_KEY")
        self.buffer = []
        return None

    def createNewTrip(self, start, end, metersToRefuel, timeBetweenStops, endTimeForDay, startISO, avoidTolls):
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
        #  a safe bet for distance between refuels by default
        self.cache = {}
        if metersToRefuel:
            self.cache["metersToRefuel"] = metersToRefuel
        else:
            self.cache["metersToRefuel"] = 12 * 25

        # generate direction from google
        url = self.basicDirectionUrl + "&origin=" + str(startCor["lat"]) + "," + str(startCor["lng"])
        url += "&destination=" + str(endCor["lat"]) + "," + str(endCor["lng"])
        if avoidTolls:
            url += "&avoid=tolls"

        r = requests.get(url)
        r = r.json()

        # set up cache
        cache = {
            "startISO": startISO,
            "metersToRefuel": metersToRefuel,
            "timeBetweenStops": timeBetweenStops,
            "endTimeForDay": endTimeForDay,
            "stopArray": [{"time": startISO, "gas": True}],
            "startLocation": startCor,
            "endLocation": endCor,
            "avoidTolls": avoidTolls
        }
        self.cache = cache

        # attach cache to directions and return directions
        r["cache"] = cache
        self.directions = r
        return json.dumps(r)

    def createFromJson(self, directions_json):
        info = json.loads(directions_json)
        # print(f'***\n\n{info}\n\n***')
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
        leg = self.directions["routes"][0]["legs"][-1]
        buffer = 0
        distance = 0
        timeTillNextHotel = self.getTimeTillNextHotel()

        # "end" to signify that the trip is ending
        end = False
        for step in leg["steps"]:
            end = False
            if step["duration"]["value"] + buffer > self.cache["timeBetweenStops"]:
                break
            if step["duration"]["value"] + buffer > timeTillNextHotel:
                break
            buffer += step["duration"]["value"]
            distance += step["distance"]["value"]
            end = True
        if end:
            return None
        
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

        # we now have the vertext. Now we need to look for the places nearby
        needGas = distance * 2 > self.cache["metersToRefuel"]
        return{
            "location": vertext,
            'hotelStop': hotelStop,
            'gasStop': needGas
        }

    def getTimeTillNextHotel(self):
        print("YOU NEED TO CALCULATE TIME TILL NEXT STOP")
        return 100000000

    # kwargs: hotel as bool, gas as bool

    def getNextStopDetails(self, foodQuery, **kwargs):
        self.updateDirections()
        queries = self.getNextStopLocation()
        if not queries:
            return None
        print('***\n\nQueries: ', queries, '\n\n***')
        if kwargs.get("hotel"):
            queries["hotelStop"] = kwargs.get("hotel")
        if kwargs.get("gas"):
            queries["gasStop"] = kwargs.get("gas")
        url = self.basicLocalSearch + "&location="+str(queries["location"]["lat"]) + "," + str(queries["location"]["lng"])
        
        hotelResults = False
        if queries["hotelStop"]:
            r = requests.get(url + "&rankby=distance&type=lodging")
            hotelResults = r.json()

        gasResults = False
        if queries["gasStop"] or hotelResults:
            r = requests.get(url + "&rankby=distance&keyword=gasstation")
            gasResults = r.json()
        
        r = requests.get(url + "&rankby=distance&keyword=" + parse.quote(foodQuery))
        foodResults = r.json()

        return {
            "centerOfSearch": queries["location"],
            'restaurants': self.filterResults(foodResults),
            'gasStations': self.filterResults(gasResults),
            'hotels': self.filterResults(hotelResults)
        }

    def filterResults(self, result):
        if result is False:
            return []
        return [*result['results']]

    def addGasStation(self, placeId):
        self.buffer.append((placeId, "gas"))
    
    def addFood(self, placeId):
        self.buffer.append((placeId, "food"))

    def addHotel(self, placeId):
        self.buffer.insert(0, (placeId, "hotel"))

    def skipStop(self, placeId):
        self.buffer.append((placeId, "skip"))

    def updateDirections(self):
        if len(self.buffer) == 0:
            return

        placeIds = []
        for i in range(len(self.cache["stopArray"])):
            if i == 0:
                continue
            stop = self.cache["stopArray"][i]
            print(stop)
            for id in stop:
                if id == "time":
                    continue
                placeIds.append(stop[id])
        
        newStop = {}
        for stop in self.buffer:
            placeIds.append(stop[0])
            newStop[stop[1]] = stop[0] 
            # if stop[1] == "food":
            #     newStop["food"] = stop[0]
            # if stop[1] == "gas":
            #     newStop["gas"] = stop[0]
            # if stop[1] == "hotel":
            #     newStop["hotel"] = stop[0]

        print("YOU NEED TO ADD IN THE TIME FOR THE NEXT STOP")
        # print(self.buffer, placeIds)
        url = self.basicDirectionUrl + "&origin=" + str(self.cache['startLocation']["lat"]) + "," + str(self.cache['startLocation']["lng"])
        url += "&destination=" + str(self.cache['endLocation']["lat"]) + "," + str(self.cache['endLocation']["lng"])
        if self.cache["avoidTolls"]:
            url += "&avoid=tolls"
        url += "&waypoints="
        for waypoint in placeIds:
            url += "place_id:" + waypoint + "|"
        url = url[:-1]
        r = requests.get(url)
        r = r.json()

        self.cache["stopArray"].append(newStop)

        r["cache"] = self.cache

        self.directions = r

    # returns directions as json
    def getDirections(self):
        self.updateDirections()
        return json.dumps(self.directions)

    
    def editStop(self, oldPlaceId, newPlaceId):
        for stop in self.cache["stopArray"]:
            for key in stop:
                if stop[key] == oldPlaceId:
                    stop[key] = newPlaceId

    def removeStop(self, oldPlaceId):
        scopedVar = None
        for stop in self.cache["stopArray"]:
            for key in stop:
                print(stop[key], oldPlaceId)
                if stop[key] == oldPlaceId:
                    print(key)
                    scopedVar = key
                    break
        del stop[scopedVar]

        





t = TripClass()
t.createNewTrip("Santa Rosa, California", "Petaluma, California", 100, 2, 2, 2, False) 

# t.createFromJson(t.createNewTrip("4625 Parktrail ct, santa rosa, ca", "San Diego, California", 100, 5555, 2, 2, False))
results = t.getNextStopDetails("mexican")
# print(json.dumps(results))
placeId = results["restaurants"][0]["place_id"]
t.addFood(placeId)
t.getDirections()
print(t.cache)
t.editStop(placeId, "asdf")
print(t.cache)
t.removeStop("asdf")
print(t.cache)
t.updateDirections()