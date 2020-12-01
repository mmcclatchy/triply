from urllib import parse
from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
from .Stop import Stop
import requests
import copy
import json
import os


#todo:
    #tailor the hotel search to stars!!!


class TripClass:
    def __init__(self, **kwargs):
        self.endBuffer = 3600
        self.searchDistanceAlongRoad = 16093
        self.searchDistanceAwayFromRoad = 1609
        self.searchRadius = 11265 #meters


        # photos, opening_hours,rating
        # locationbias=rectangle:
        self.useThisUrlToGetCordsForAPoint = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&fields=place_id,geometry&key=" + os.environ.get("BACKEND_API_KEY") + "&input="
        self.basicLocalSearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + os.environ.get("BACKEND_API_KEY")
        self.basicDirectionUrl = "https://maps.googleapis.com/maps/api/directions/json?key=" + os.environ.get("BACKEND_API_KEY")
        self.basicRoadsUrl = "https://roads.googleapis.com/v1/speedLimits?key=" + os.environ.get("BACKEND_API_KEY") + "&units=MPH&path="
        self.startCor = kwargs.get('startCor')
        self.endCor = kwargs.get('endCor')
        self.travelPerDay = kwargs.get('dailyTimeLimit')
        self.travelPerIncrement = kwargs.get('incrementTimeLimit')
        if not self.travelPerIncrement:
            self.travelPerIncrement = 86400
        self.travelPerIncrement = (self.travelPerIncrement, "This is a placeholder... lol")
        self.foodType = kwargs.get('foodTypes')
        self.milesToRefuel = kwargs.get("milesToRefuel")
        if self.milesToRefuel:
            self.milesToRefuel *= .90
        if not self.milesToRefuel:
            #Small car average tank size times average miles per gallon
            self.milesToRefuel = 12 * 25
        self.tolls = kwargs.get("avoidTolls")
        if self.tolls is None:
            self.tolls = False
        self.stopKey = kwargs.get("stopKey")
        if not self.stopKey:
            self.stopKey = []
        self.departureTime = self.convertDepartureTime(kwargs.get("departureTime"))



        self.directionsFromGoogle = None
        self.timeBeforeRunningOutOfGas = None
        self.stops = []
        self.stopTimeIndex = [0]
        self.directions = []
        self.stepTimeIndex = []
        self.totalTravelTime = None
        self.totalTravelDistance = None
        self.gasEveryStop = False


    def convertDepartureTime(self, dt):
        if not dt:
            return
        t = dt.split("T")[1]
        t = t.split(":")
        hours = int(t[0])
        minutes = int(t[1])
        return (minutes * 60) + ((hours * 60) * 60)

    def setStartLocationFromString(self, startLocationString):
        url = self.useThisUrlToGetCordsForAPoint + parse.quote(startLocationString)
        r = requests.get(url)
        r = r.json()
        print('*******\n\n', r, '\n\n')
        self.startCor = r["candidates"][0]["geometry"]["location"]

    def setEndLocationFromString(self, endLocationString):
        url = self.useThisUrlToGetCordsForAPoint + parse.quote(endLocationString)
        r = requests.get(url)
        r = r.json()
        self.endCor = r["candidates"][0]["geometry"]["location"]


    def setStartCor(self, startCor):
        self.startCor = startCor

    def setEndCor(self, endCor):
        self.endCor = endCor

    def createDirection(self, **kwargs):
        if self.startCor and self.endCor:
            origin = str(self.startCor["lat"]) + "," + str(self.startCor["lng"])
            destination = str(self.endCor["lat"]) + "," + str(self.endCor["lng"])
            url = self.makeUrl(origin=origin, destination=destination)
            print('*********\n\n', url, '\n\n\n')
            if kwargs.get("waypoints"):
                url += kwargs.get("waypoints")
            r = requests.get(url)
            r = r.json()
            
            legs = [i for i in r["routes"][0]["legs"]]
            directions = []
            for i in range(len(legs)):
                for j in range(len(legs[i]["steps"])):
                    directions.append(legs[i]["steps"][j])
            self.directions = directions

            r["departureTime"] = self.departureTime
            self.directionsFromGoogle = json.dumps(r)

            distance = 0
            time = 0
            for leg in legs:
                distance += leg["distance"]["value"]
                time += leg["duration"]["value"]
                self.stopTimeIndex.append(leg["duration"]["value"])
            self.stopTimeIndex.pop()
            self.totalTravelDistance = distance
            self.totalTravelTime = time
            if not self.travelPerDay:
                self.travelPerDay = self.totalTravelDistance * 1.5

            for waypointsInclusive in range(len(r["geocoded_waypoints"])):
                if waypointsInclusive == 0:
                    continue
                if waypointsInclusive == len(r["geocoded_waypoints"]) - 1:
                    break
                wp = r["geocoded_waypoints"][waypointsInclusive]
                self.stops.append(wp["place_id"])

            self.indexSteps()
            self.calcDistanceBeforeGasIsOut()

    def calcDistanceBeforeGasIsOut(self):
        averageMperS = self.totalTravelDistance / self.totalTravelTime
        self.timeBeforeRunningOutOfGas = ((self.milesToRefuel * 1609.34) / averageMperS) * .9
        if self.timeBeforeRunningOutOfGas < self.travelPerIncrement[0]:
            self.travelPerIncrement = (self.timeBeforeRunningOutOfGas, "placeholder...lol")
            self.gasEveryStop = True
        

    def indexSteps(self):
        index = []
        current = 0
        for i in range(len(self.directions)):
            current += (self.directions[i]["duration"]["value"])
            index.append((i, current))
        self.stepTimeIndex = index


    def makeUrl(self, **kwargs):
        url = self.basicDirectionUrl
        for i in kwargs:
            url = url + "&" + i + "=" + kwargs[i]
        if self.tolls:
            url += "&avoid=tolls"
        # print(url)
        return url

    def decodePolyline(self, encoded):
        return decodePolyline(encoded)

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


    def getDistance(self, hashedPolyline):
        cords = self.decodePolyline(hashedPolyline)
        d = 0
        for i in range(len(cords) -1):
            d += self.getDistanceBetweenTwoPoints(cords[i], cords[i+1])
        return d

    def addStop(self, newStops, stopKey):
        string = "&waypoints="
        for stop in newStops:
            self.stops.append(stop)
        for stop in self.stops:
            string = string+"place_id:"+stop+"|"
        string = string[:-1]
        self.createDirection(waypoints=string)
        self.stopKey = self.stopKey + stopKey


    def setTravelPerIncrement(self, tup):
        self.travelPerIncrement = tup
        self.travelPerIncrement = (self.travelPerIncrement, "This is a placeholder... lol")

    def getSpeedBetweenTwoDirections(self, di1):
        duration = di1["duration"]["value"]
        distance = di1["distance"]['value']
        return distance / duration


    def getPolyLineVertex(self):
        if self.travelPerIncrement[0] < ((self.totalTravelTime - self.stopTimeIndex[-1]) - self.endBuffer):
            lastStopTime = self.totalTravelTime
            current = 0
            for i in range(len(self.stepTimeIndex)):
                if self.travelPerIncrement[0] < (self.stepTimeIndex[i][1] - self.stopTimeIndex[-1]):
                    break
            cordinates = self.decodePolyline(self.directions[i-1]["polyline"]["points"])
            currentTime = self.stepTimeIndex[i - 1][1]

            speedLimitOfRoad = self.getSpeedBetweenTwoDirections(self.directions[i-1]) #in miles per milliseconds)
            currentDistance = 0
            for j in range(len(cordinates)):
                if j == (len(cordinates) - 1):
                    #Handling
                    #  edge case
                    return {"cords": cordinates, "index": j, "stepIndex": i - 1}
                else:

                    currentDistance = currentDistance + self.getDistanceBetweenTwoPoints(cordinates[j], cordinates[j+1])

                    toadd = (self.getDistanceBetweenTwoPoints(cordinates[j], cordinates[j+1]) / speedLimitOfRoad)
                    currentTime += toadd
                    if currentTime - lastStopTime > self.travelPerIncrement[0]:
                        return {"cords": cordinates, "index": j, "stepIndex": i - 1}


        else:
            return None


    def getPairForBuffer(self, mod=1):
        #find the base of our rectange
        vertexInfo = self.getPolyLineVertex()
        if not vertexInfo:
            return None
        #counter for going foward
        forwardTotal = 0
        i = vertexInfo["index"]
        #interate through the rest of the polyline that the base of the rectangle is in
        while (i < (len(vertexInfo["cords"]) - 1)) and (forwardTotal < self.searchRadius * mod):
            forwardTotal += self.getDistanceBetweenTwoPoints(vertexInfo["cords"][i], vertexInfo["cords"][i+1])
            i += 1
        #checking to see if we have reached the "top" of the rectangle
        if (forwardTotal > self.searchRadius * mod):
            return [vertexInfo["cords"][vertexInfo["index"]], vertexInfo["cords"][i]]

        #adding the final segment of the original polyline to the start of the next polyline
        forwardTotal += self.getDistanceBetweenTwoPoints(vertexInfo["cords"][i], self.directions[vertexInfo["stepIndex"] + 1]["start_location"])
        #checking to see if we have reached the "top" of the rectangle
        if (forwardTotal > self.searchRadius * mod):
            return [vertexInfo["cords"][vertexInfo["index"]], vertexInfo["cords"][len(vertexInfo["cords"]) - 1]]

        #find the step that will contain the "top" of the polyline
        j = vertexInfo["stepIndex"] + 1
        while forwardTotal < self.searchRadius * mod:
            forwardTotal += self.directions[j]["distance"]["value"]
            j += 1
        #reset total to point before the step that would exceed our search value
        j -= 1
        forwardTotal -= self.directions[j]["distance"]["value"]

        #get all the points within the polyline that contains the top of the rectangle
        finalCords = self.decodePolyline(self.directions[j]["polyline"]["points"])
        i = 0
        #go through all the verticies in the polyline to find where we reach the "top"
        while (i < (len(finalCords) - 1)) and (forwardTotal < self.searchRadius * mod):
            forwardTotal += self.getDistanceBetweenTwoPoints(finalCords[i], finalCords[i+1])
            i += 1
        if (forwardTotal > self.searchRadius * mod):
            return [vertexInfo["cords"][vertexInfo["index"]], finalCords[i]]
        #if it was none of those, then it is the last one!
        else:
            return [vertexInfo["cords"][vertexInfo["index"]], finalCords[len(finalCords) - 1]]


    def getFirstWayPoint(self, searchBuffer):
        #this can be improved for speed at a later date
        return self.startCor

    def getSecondWayPoint(self, searchBuffer):
        #this can be improved for speed at a later date
        return self.endCor

    def placeSearchUrlGenerator(self, searchQuery, searchCord, **kwargs):
        url = self.basicLocalSearch
        url = url + "&location="
        url = url + str(searchCord["lat"]) + "," + str(searchCord["lng"])
        url = url + "&keyword=" + parse.quote(searchQuery)
        url = url + "&rankby=distance"
        if kwargs.get("type"):
            url = url + "&type=" + kwargs.get("type")
        return url

    def checkIfGasIsNeeded(self, cords):
        averageMetersPerSecond = self.totalTravelDistance / self.totalTravelTime
        lastWas = 0
        for i in range(len(self.stopKey)):
            j = len(self.stopKey) - 1 - i
            if self.stopKey[j] == "g":
                lastWas = j
        dictOfGoogle = json.loads(self.directionsFromGoogle)
        wp = dictOfGoogle["routes"][0]["legs"][lastWas]
        aproxDistance = self.getDistanceBetweenTwoPoints(cords, wp["start_location"])
        if aproxDistance * 2 >= self.milesToRefuel * 1609.34:
            return True
        else:
            return False

    def checkIfHotelIsNeeded(self, cords):
        averageMetersPerSecond = self.totalTravelDistance / self.totalTravelTime
        lastWas = 0
        for i in range(len(self.stopKey)):
            j = len(self.stopKey) - 1 - i
            if self.stopKey[j] == "h":
                lastWas = j
        dictOfGoogle = json.loads(self.directionsFromGoogle)
        wp = dictOfGoogle["routes"][0]["legs"][lastWas]
        legs = dictOfGoogle["routes"][0]["legs"]
        timeSinceLastSleep = 0
        j = lastWas
        while j < len(legs) - 2:
            timeSinceLastSleep += legs[j]["duration"]["value"]
            j += 1
        timeSinceLastSleep += (self.getDistanceBetweenTwoPoints(cords, wp["start_location"]) / averageMetersPerSecond) * 2
        if timeSinceLastSleep > self.travelPerDay:
            return (2, 4)
        else:
            return False
        
    def getCordsFromPlaceId(self, placeId):
        url = "https://maps.googleapis.com/maps/api/place/details/json?fields=geometry&key=" + os.environ.get("BACKEND_API_KEY")
        r = requests.get(url + "&place_id=" + placeId)
        r = r.json()
        return r["result"]["geometry"]["location"]

    def getFoodAndGasNearLocation(self, searchQuery, place_Id):
        cords = self.getCordsFromPlaceId(place_Id)
        food = requests.get(self.placeSearchUrlGenerator(searchQuery, cords))
        food = food.json()
        gas = self.getGasNearLocation(place_Id, cords=cords)
        f = []
        g = []
        for item in food["results"]:
            f.append(item)
        for item in gas:
            g.append(item)
        return {"food": f, "gas": g}

    def getGasNearLocation(self, place_Id, **kwargs):
        cords = kwargs.get("cords")
        if not cords:
            cords = self.getCordsFromPlaceId(place_Id)
        r = requests.get(self.placeSearchUrlGenerator("gas station", cords, type="gas_station"))
        r = r.json()
        r = [i for i in r["results"]]
        return {"gas": r}


    def getNextStopDetails(self, **kwargs):
        s = self.getPairForBuffer()
        if not s:
            return None
        searchBuffer = [x for x in s]
        firstWayPoint = self.getFirstWayPoint(searchBuffer)
        endWayPoint = self.getSecondWayPoint(searchBuffer)

        foodQuery = kwargs.get("foodQuery")

        if not foodQuery:
            foodQuery = "restaurant"
        hotel = kwargs.get("hotel")
        gas = kwargs.get("gas")
        mod = 1
        if not gas:
            gas = self.checkIfGasIsNeeded(searchBuffer[0])
        if not gas:
            gas = self.gasEveryStop
        if not hotel:
            hotel = self.checkIfHotelIsNeeded(searchBuffer[0])
            mod = 3
        listOfFoundSpots = []
        numberOfCheckedSpots = 0
        while len(listOfFoundSpots) < 3*mod and numberOfCheckedSpots < 3:
            numberOfCheckedSpots += 1
            searchQuery = foodQuery
            url = self.placeSearchUrlGenerator(searchQuery, searchBuffer[len(searchBuffer) - 1])
            if hotel:
                searchQuery = str(int((hotel[0]+hotel[1])/2)) + " star hotel" 
                url = self.placeSearchUrlGenerator(searchQuery, searchBuffer[len(searchBuffer) - 1], type="lodging")
                # print(url)
            r = requests.get(url)
            r = r.json()
            for option in r["results"]:
                listOfFoundSpots.append(option)
                if len(listOfFoundSpots) >= 3:
                    break
            #appends the next point to search buffer
            searchBuffer.append(self.getPairForBuffer(((len(searchBuffer)) * 2) + 1)[1])
        timeOfStop = self.convertSecondsTravelSecondsToDTOfStop(self.stopTimeIndex[-1] + self.travelPerIncrement[0])
        if gas and not hotel:
            gasOptions = self.getGasNearLocation("placeholder", cords=listOfFoundSpots[0]["geometry"]["location"])
            listOfFoundSpots = {"time": timeOfStop, "Restaurant": [self.convertToFrontEndFormat(x, "food") for x in listOfFoundSpots], "Gas": [self.convertToFrontEndFormat(x, gas) for x in gasOptions["gas"]]}
        elif hotel:
            listOfFoundSpots = {"time": timeOfStop, "Hotel": [self.convertToFrontEndFormat(x, "hotel") for x in listOfFoundSpots]}
        else:
            listOfFoundSpots = {"time": timeOfStop, "Restaurant": [self.convertToFrontEndFormat(x, "food") for x in listOfFoundSpots]}
        return listOfFoundSpots




        #use the top and bottom function to get where we are searching
        #change the function so that the top is not as far into the road (maybe 7 mins?)
        #use it one more time so that we have 3 points
        #do a radius search from the middle
        #depending on the results, hit again using the third as the middle...etc

        #once we have all the stuff, use the directions api setting the options as waypoints
        #get the directions from last step to future step (far enough away) and use that to compare extra driving time
        #do this with all results to get the ranking
        #send to frontend to present to user
        #profit

    def getDirections(self):
        d = json.loads(self.directionsFromGoogle)
        d["stopKey"] = self.stopKey
        return json.dumps(d)
    
    def constructFromDirections(self, directionsAsJson):
        directionsFromGoogle = directionsAsJson
        self.directionsFromGoogle = directionsFromGoogle
        d = json.loads(directionsFromGoogle)
        self.stopKey = d["stopKey"]
        legs = [i for i in d["routes"][0]["legs"]]
        directions = []
        for i in range(len(legs)):
            for j in range(len(legs[i]["steps"])):
                directions.append(legs[i]["steps"][j])
        self.directions = directions

        self.departureTime = d["departureTime"]

        distance = 0
        time = 0
        for leg in legs:
            distance += leg["distance"]["value"]
            time += leg["duration"]["value"]
            self.stopTimeIndex.append(leg["duration"]["value"])
        self.stopTimeIndex.pop()
        self.totalTravelDistance = distance
        self.totalTravelTime = time
        if not self.travelPerDay:
            self.travelPerDay = self.totalTravelDistance * 1.5
  
        for waypointsInclusive in range(len(d["geocoded_waypoints"])):
            if waypointsInclusive == 0:
                continue
            if waypointsInclusive == len(d["geocoded_waypoints"]) - 1:
                break
            wp = d["geocoded_waypoints"][waypointsInclusive]
            self.stops.append(wp["place_id"])

        self.indexSteps()
        self.calcDistanceBeforeGasIsOut()

    def toDictForDatabase(self):
        result = {
            "daily_timelimit": self.travelPerDay,
            "stop_timelimit": self.travelPerIncrement,
            "toll": self.tolls,
            "start_location": self.startCor,
            "end_location": self.endCor,
            "directions": self.getDirections()
        }
        return result

    def prettyPrintDuration(self):
        miles = round(self.totalTravelDistance * 0.000621371)
        return str(miles) + " miles"
    
    def prettyPrintTime(self):
        totalDuration = self.totalTravelTime
        totalMinutes = round(totalDuration / 60)
        minutes = totalMinutes % 60
        totalMinutes -= minutes
        hours = totalMinutes / 60
        result = str(int(hours)) + " Hours"
        if minutes:
            result += " and " + str(minutes) + " Minutes"
        return result

    def editStop(self, newPlaceId, **kwargs):
        i = kwargs.get("stopIndex")
        oldId = kwargs.get("oldPlaceId")
        if i:
            self.stops[i] = newPlaceId
        elif oldPlaceId:
            self.stops[self.stops.index(oldPlaceId)] = newPlaceId
        else:
            return None
        self.createDirection()

    def setFoodPreferences(self, foodPreferences):
        if not self.directionsFromGoogle:
            return None
        d = json.loads(self.directionsFromGoogle)
        d["foodPreferences"] = foodPreferences
        self.directionsFromGoogle = json.dumps(d)

    def getFoodPreferences(self):
        if not self.directionsFromGoogle:
            return None
        d = json.loads(self.directionsFromGoogle)
        return d["foodPreferences"]

    def convertToFrontEndFormat(self, obj, type):
        result = {
          "name": obj["name"],
          'place_id': obj["place_id"],
          'type': type,
          'city': obj["vicinity"].split(",")[1],
          'img_url':
            "https://img.icons8.com/ios-filled/50/000000/next-location.png",
          'street_address': obj["vicinity"].split(",")[0],
        }
        if obj.get("photo"):
            result["img_url"] = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + obj["photos"][0]["photo_reference"] + "&key=" + os.environ.get("FRONTEND_API_KEY")
        return result

    def getCordsOfWayPoints(self):
        d = json.loads(self.directionsFromGoogle)
        result = []
        for leg in d["routes"][0]['legs']:
            result.append(leg["end_location"])
        result.pop()
        return result

    def convertSecondsTravelSecondsToDTOfStop(self, seconds):
        collector = seconds % self.travelPerDay
        collector += self.departureTime
        collector = round(collector / 60)
        minutes = collector % 60
        collector -= minutes
        hours = collector / 60
        sign = "AM"
        if hours > 12:
            hours -= 12
            sign = "PM"
        return "2020-12-01 " + str(int(hours)) + ":" + str(minutes) + sign


# t = TripClass(departureTime="2012-12-12 14:10:20")
# # # print(t.getFoodAndGasNearLocation("Mexican", "ChIJ_yI7V3BFI4gR4K98PVlIEiQ"))
# t.setStartLocationFromString("Holland, mi")
# t.setEndLocationFromString("California")
# t.createDirection()
# # t.setFoodPreferences(["I want FOOOOOD!!", "and other stuff"])
# # n = TripClass()
# # n.constructFromDirections(t.getDirections())
# # print(n.getFoodPreferences())
# # # t.travelPerDay = 21600
# t.setTravelPerIncrement(20189)
# t.travelPerDay = (20189 * 2.1)
# # # print(t.getNextStopDetails())
# t.addStop(["ChIJQTPp6l2444cRXVrR1VRtz_U"], ["f"])
# print(t.getNextStopDetails())
# t.createDirection()

# t.milesToRefuel = 15

# print(json.dumps(t.getNextStopDetails()))


# # # # print(t.getDistance("cwoiGvvacNGAEAECUK_@QuAm@]OyB}@u@]C?ECmBy@OGSIWKo@Y[KgAe@oAg@sAi@m@[OGg@]USIIMKi@m@W[i@k@IKMQQOIKa@g@MMqA_Bo@}@s@w@g@o@SU_CoCiBuB{AiBa@i@MSIQKOIOGSIMQa@Sc@IWMYQo@yAwEgAmD[iAc@mA[gAIYG]AECQEYOkAo@}FK{@O{@qAsISuA{@qGy@yFIc@Gk@Ew@QeGAUAa@C{@Ci@EkBIiCMeDCk@QyEAIQ_EAYOqDA[SsDGqACo@Gs@Mu@G]Mm@I_@[{AWoAGWqAoEsAuEMi@]cAKWWm@Q]Uc@U_@k@_AeAcB_@k@gAiBWc@aA}Ao@cAiAiBu@mAmB_DeAcBYg@OWmCwEiBsCeEmHa@q@w@uAU]c@y@i@eAO[Q]MY[o@O_@kBaEyC{GMYYk@q@wAKSGOIMe@{@g@}@aAyAWa@S[W]_@k@a@k@OUm@y@e@o@_@i@?E?E?AAAACGIi@w@q@aAaAwA_@k@wCiE[c@i@u@OSSWCEOOMMMO]]][UUKIWWMKKKA?]Yg@_@MKCCIG[Og@YOIo@[kAo@gE{B_CmAi@[_Ag@s@_@yAw@mAq@ECECCCE?E?G?ECkCaBMIo@]]QgAo@]OwEiCWMcAi@_@OcAi@e@U[SgBaAg@We@Wc@UOIMGq@]cAk@IEOG_Ai@g@WOGmAq@}A{@WMUMWQ_CyAGE]S{@q@AAg@a@a@]EEo@k@UWY[MMGI_AgAcAkAWYw@aAg@m@QSkAsAwAcBOSwAeBg@m@cAmAc@i@kByB_CmCs@}@]a@sA}AoA{A{AiBeD_EiC}CiAsAUY_AiA]a@EEqA_B]_@SYKKi@o@w@_A_AkAuAaBsA_BcBsBaAiAiAuAg@m@[]cBuBaAkAW[e@i@_AiAGIm@u@a@c@k@s@Y][_@_AiAu@}@gC{CwBkCkBwBY]s@{@i@m@y@_AKKy@_A_@c@aAgAw@{@SW_BiBi@m@i@o@oB{BkAuAGG{@_Ak@s@gE}EEG{@aAg@k@qCaDkC{CkAsAACw@}@k@m@m@q@w@aAOSY]s@y@gAmAmAqAe@i@_BgBs@y@q@u@cBmB{AcBkC{Cg@k@cAkAiAoAOQgBqBi@k@SSk@m@i@k@QQe@a@EEGECCCAKIYWm@k@SSGIGGsAmAwBmBMOy@q@CCC?CAAC[YUUSUWWaA{@g@e@eB}Aw@s@y@w@WSeB{Aq@i@a@]qAgAcA{@_@Y]Y]Yy@o@{@s@cBsAq@k@u@o@_Au@yAqAKIaA_A[Yi@g@WWg@i@QQ}@w@i@i@e@i@WUc@a@m@i@wAmAyCgCoCcCqAiAiEyD}CsCg@c@kCaC[Yk@g@cA}@qAmAcA}@uEcEWS{@w@US}@y@MKg@e@q@m@o@i@i@e@gAaAMMs@m@OOi@e@a@_@GGKIw@q@_@[Y[k@e@g@c@aA_Ay@q@uCiC}AuAUSSQUUSSWSUSMMIGkAeAyAqA][}CoCQD[Wc@c@Ma@ACCCSUa@a@QYYe@We@O[O_@IUMi@"))
# # # # print(t.getDistanceBetweenTwoPoints({"lat":43.6672211, "lng":-79.3125987}, {"lat": 43.7739717, "lng": -79.1830736}))
# # # # print(t.stops[0].food)
# # # # print("NEW STUFFFFFF!!!!!!!!!!")
# # t.setEndCor({"lat": 40.712776, "lng": -74.005974})
# # t.setStartCor({"lat":42.789379, "lng":-90.207801})
# # t.createDirection()
# # print("GOT TO THIS SPOT")
# # # # print(t.stops)
# # # # print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
# # # # print(t.directions)
# # # # print(t.totalTravelTime)
# # # # print(t.totalTravelDistance)
# # t.setStartCor({"lat": 40.365232, "lng": -98.109069})
# # t.setEndCor({"lat":40.524798, "lng": -98.108422})
# # t.createDirection()
# # print(t.prettyPrintDuration(), t.prettyPrintTime())
# # # # print(t.stepTimeIndex)
# # # t.setTravelPerIncrement((34710, 36296))
# # # t.setTravelPerIncrement((7200, 20189))
# # # t.travelPerDay = 7200 * 2

# t.getNextStopDetails()
# t.addStop(["ChIJ_yI7V3BFI4gR4K98PVlIEiQ", "ChIJ0XXQUFE-OogR2w6dkGjqhu0", "ChIJ7wHa54k-OogRdXZAth3Jz7M", "ChIJo0BrfAxSI4gR0XjDWhB5Ne8", "ChIJ0XXQUFE-OogR2w6dkGjqhu0"], ["f", "f", "f", "f", "f"])
# # print(t.getCordsOfWayPoints())
# n = TripClass()
# n.constructFromDirections(t.getDirections())
# print(n.convertSecondsToDT(n.departureTime))
# print(t.getNextStopDetails(fordQuery = "Mexican"))
# n = TripClass()
# n.constructFromDirections(t.getDirections())
# print(n.stopKey, n.stops)
# # # t.addStop(["ChIJ_yI7V3BFI4gR4K98PVlIEiQ"], ['f'])
# # # t.getNextStopDetails()

# # n = TripClass()
# # print(t.getDirections())
# # n.constructFromDirections(t.getDirections())
# # print(n.stopKey)

# # t.getNextStopDetails()
# # t.addStop(["ChIJ_yI7V3BFI4gR4K98PVlIEiQ", "ChIJ0XXQUFE-OogR2w6dkGjqhu0", "ChIJ7wHa54k-OogRdXZAth3Jz7M", "ChIJo0BrfAxSI4gR0XjDWhB5Ne8", "ChIJ0XXQUFE-OogR2w6dkGjqhu0"], ["f", "f", "f", "f", "f"])
# # print(t.getNextStopDetails())
