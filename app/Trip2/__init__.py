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

    def createNewTrip(self, start, end, metersToRefuel, timeBetweenStops, endTimeForDay, startISO, avoidTolls, dailyStartTime):
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
            "dailyStartTime": dailyStartTime,
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

    def getNextStopLocation(self, **kwargs):
        leg = self.directions["routes"][0]["legs"][-1]
        buffer = 0
        distance = 0
        h = True
        if "hotel" in kwargs and not kwargs.get("hotel"):
            h = False
        timeTillNextHotel = self.getTimeTillNextHotel(h)

        hotelStop = timeTillNextHotel < 0
        if hotelStop:
            timeTillNextHotel = 1000000000

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

        
        averageMetersPerSecondInStep = step["distance"]["value"] / step["duration"]["value"]
        vertextes = decodePolyline(step["polyline"]["points"])
        lastVertext = step["start_location"]
        
        
        for vertext in vertextes:
            distanceToNextVertext = self.getDistanceBetweenTwoPoints(lastVertext, vertext)
            timeToNextVertext = (distanceToNextVertext / averageMetersPerSecondInStep)
            # print(distanceToNextVertext, timeToNextVertext, averageMetersPerSecondInStep)
            # print(buffer + timeToNextVertext, timeTillNextHotel, ":comparing these:", self.cache["timeBetweenStops"])
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

        delta = datetime.timedelta(seconds=buffer)
        lastStopTime = datetime.datetime.fromisoformat(self.cache["stopArray"][-1]["time"])
        stopISO = (lastStopTime + delta).isoformat()
        
        return{
            "stopISO": stopISO,
            "location": vertext,
            'hotelStop': hotelStop,
            'gasStop': needGas
        }

    def calculateTimeAtStopAndLastDrive(self, r):
        lastStop = self.cache["stopArray"][-1]
        estimatedTimeThere = 0
        if lastStop.get("hotel"):
            # there has got to be an easier way to do this...but I don't know it
            # python does not support subtraction between time objects and so...
            # I am converting to a date and then back to time
            # it is convulted and ugly... but, so it seems, so is python's time handling
            # so who is really at fault?
            ref = datetime.time.fromisoformat(self.cache["dailyStartTime"])
            startTime = datetime.datetime(year=1, month=1, day=2, hour=ref.hour, minute=ref.minute, second=ref.second)
            ref = datetime.datetime.fromisoformat(self.cache["stopArray"][-1]['time']).time()
            lastStopTime = datetime.datetime(year=1, month=1, day=1, hour=ref.hour, minute=ref.minute, second=ref.second)
            delta = startTime - lastStopTime
            return delta.total_seconds()
        if lastStop.get("gas"):
            estimatedTimeThere += 10 * 60
        if lastStop.get("food"):
            estimatedTimeThere += 20 * 60
        return estimatedTimeThere + r["routes"][0]["legs"][-2]["duration"]["value"]

    def getTimeTillNextHotel(self, hotelForce):
        #checks if last stop was hotel and then forces next stop not to be
        if not self.cache["endTimeForDay"]:
            return 1000000000
        if self.cache["stopArray"][-1].get("hotel") or not hotelForce:
            return 10000000
        ref = datetime.time.fromisoformat(self.cache["endTimeForDay"])
        endTimeForDay = datetime.datetime(year=1, month=1, day=1, hour=ref.hour, minute=ref.minute, second=ref.second)
        ref = ref = datetime.datetime.fromisoformat(self.cache["stopArray"][-1]['time']).time()
        lastStopTime = datetime.datetime(year=1, month=1, day=1, hour=ref.hour, minute=ref.minute, second=ref.second)
        delta = endTimeForDay - lastStopTime

        #check if different day to see if delta needs to be flipped
        currentStop = lastStopTime + datetime.timedelta(seconds=self.cache["timeBetweenStops"])

        mod = 1
        if currentStop.hour - lastStopTime.hour < 0:
            mod = -1

        seconds = delta.total_seconds() * mod

        if seconds <  -1 * (4 * 60 * 60):
            return 10000000

        return seconds

    # kwargs: hotel as bool, gas as bool

    def getNextStopDetails(self, foodQuery, **kwargs):
        self.tempCache = self.cache
        if kwargs.get("push"):
            if not self.cache['endTimeForDay']:
                self.tempCache['endTimeForDay'] = 100000000
            else:
                endTimeOfDay = datetime.time.fromisoformat(self.tempCache["endTimeForDay"])
                self.tempCache["endTimeForDay"] = (datetime.datetime(year=1, month=1, day=1, hour=endTimeOfDay.hour, minute=endTimeOfDay.minute, second=endTimeOfDay.second) + datetime.timedelta(hours=1)).time().isoformat()
            self.tempCache["timeBetweenStops"] += 60 * 60
        self.updateDirections()
        queries = self.getNextStopLocation(**kwargs)
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
        if kwargs.get("push"):
            r = requests.get(url + "&rankby=distance&type=food")
        else:
            r = requests.get(url + "&rankby=distance&keyword=" + parse.quote(foodQuery))
        foodResults = r.json()
        if not len(foodResults["results"]):
            push = True if self.cache['endTimeForDay'] else False
            print("got in here")
            return self.getNextStopDetails(foodQuery, push=True, **kwargs)

        return {
            "stopISO": queries["stopISO"],
            "centerOfSearch": queries["location"],
            'restaurants': self.filterResults(foodResults),
            'gasStations': self.filterResults(gasResults),
            'hotels': self.filterResults(hotelResults),
            'tripComplete': False
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

        # create a time delta from the most recent added leg
        delta = datetime.timedelta(seconds=self.calculateTimeAtStopAndLastDrive(r))
        newTime = datetime.datetime.fromisoformat(self.cache["stopArray"][-1]["time"]) + delta
        newStop["time"] = newTime.isoformat()

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
                if stop[key] == oldPlaceId:
                    scopedVar = key
                    break
        del stop[scopedVar]

        





# t = TripClass()
# t.createNewTrip("Santa Rosa, California", "Holland, Mi", 100, 4 * 60 * 60, datetime.time(hour=2).isoformat(), datetime.datetime(year=2020, month=12, day=29, hour=10, minute=13).isoformat(), False, datetime.time(hour=8).isoformat()) 
# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l

# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l

# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l

# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l

# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l

# results = t.getNextStopDetails("mexican")
# placeId = results["restaurants"][0]["place_id"]
# t.addFood(placeId)
# l = TripClass()
# l.createFromJson(t.getDirections())
# t = l
# print(t.cache)



# l = TripClass()
# l.createFromJson(t.getDirections())
# print(t.cache)
# l.addFood(results["restaurants"][4]["place_id"])
# l.addGasStation(results["restaurants"][2]["place_id"])
# directions = json.loads(l.getDirections())
# # print(directions)
# # print("\n \n",l.cache)
# print(l.getDirections())