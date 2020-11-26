from urllib import parse
from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
from .Stop import Stop
import requests
import copy
# How to use the trip:
#  To get the distance of a polyline, pass the hashed value to the "getDistance" function


class Trip:


    ##todo: add method that converts to things that can easily save
    ##      add static method to give id from database and builds a trip
    def __init__(self, **kwargs):
        self.endBuffer = 1800
        self.searchDistanceAlongRoad = 16093
        self.searchDistanceAwayFromRoad = 1609
        self.searchRadius = 11265 #meters


        # photos, opening_hours,rating
        # locationbias=rectangle:
        self.basicLocalSearch = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=restaurant&key=AIzaSyBmKKKPntFx-1yFUAIgXjWQU3wykVlBt3Y"
        self.basicDirectionUrl = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBmKKKPntFx-1yFUAIgXjWQU3wykVlBt3Y"
        self.basicRoadsUrl = "https://roads.googleapis.com/v1/speedLimits?key=AIzaSyBmKKKPntFx-1yFUAIgXjWQU3wykVlBt3Y&units=MPH&path="
        self.startCor = kwargs.get('startCor')
        self.endCor = kwargs.get('endCor')
        self.travelPerDay = kwargs.get('travelPerDay')
        self.travelPerIncrement = kwargs.get('travelPerIncrement')
        self.foodType = kwargs.get('foodTypes')
        self.car = kwargs.get('car')

        self.stops = []
        self.directions = []
        self.stepTimeIndex = []
        self.totalTravelTime = None
        self.totalTravelDistance = None
        
        self.checkCorAndSetDirections()

    def setStartCor(self, startCor):
        self.startCor = startCor
        self.checkCorAndSetDirections()

    def setEndCor(self, endCor):
        self.endCor = endCor
        self.checkCorAndSetDirections()

    def checkCorAndSetDirections(self):
        if self.startCor and self.endCor:
            origin = str(self.startCor["lat"]) + "," + str(self.startCor["lng"])
            destination = str(self.endCor["lat"]) + "," + str(self.endCor["lng"])
            url = self.makeUrl(origin=origin, destination=destination)
            r = requests.get(url)
            r = r.json()

            legs = [i for i in r["routes"][0]["legs"]]
            directions = []
            for i in range(len(legs)):
                for j in range(len(legs[i]["steps"])):
                    directions.append(legs[i]["steps"][j])
            self.directions = directions

            distance = 0
            time = 0
            for leg in legs:
                distance += leg["distance"]["value"]
                time += leg["duration"]["value"]
            self.totalTravelDistance = distance
            self.totalTravelTime = time

            start = Stop(self.startCor, 0)
            end = Stop(self.endCor, self.totalTravelTime)
            self.stops = [start, end]

            self.indexSteps()


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

    def addStop(self, cord, **kwargs):
        self.stops.append(Stop(cord, **kwargs))

    def setTravelPerIncrement(self, tup):
        self.travelPerIncrement = tup

    def getSpeedBetweenTwoDirections(self, di1):
        duration = di1["duration"]["value"]
        distance = di1["distance"]['value']
        return distance / duration
        

    def getPolyLineVertex(self):    
        if self.travelPerIncrement[0] < ((self.stops[-1].time - self.stops[-2].time) - self.endBuffer):
            lastStopTime = self.stops[-2].time
            current = 0
            for i in range(len(self.stepTimeIndex)):
                if self.travelPerIncrement[0] < (self.stepTimeIndex[i][1] - self.stops[-2].time):
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

    def getSearchQuery(self):
        #user input and sort user input
        return parse.quote("fast food")

    def placeSearchUrlGenerator(self, searchQuery, searchCord):
        url = self.basicLocalSearch
        url = url + "&location="
        url = url + str(searchCord["lat"]) + "," + str(searchCord["lng"])
        url = url + "&keyword=" + searchQuery
        url = url + "&rankby=distance"
        return url
        


    def getLocationsOfNextStop(self):
        searchBuffer = [x for x in self.getPairForBuffer()]
        firstWayPoint = self.getFirstWayPoint(searchBuffer)
        endWayPoint = self.getSecondWayPoint(searchBuffer)
        searchQuery = self.getSearchQuery()

        listOfFoundSpots = []
        numberOfCheckedSpots = 0
        while len(listOfFoundSpots) < 3 and numberOfCheckedSpots < 3:
            numberOfCheckedSpots += 1
            searchQuery = self.getSearchQuery()
            url = self.placeSearchUrlGenerator(searchQuery, searchBuffer[len(searchBuffer) - 1])
            r = requests.get(url)
            r = r.json()
            for option in r["results"]:
                listOfFoundSpots.append(option)
                if len(listOfFoundSpots) >= 3:
                    break
            #appends the next point to search buffer
            searchBuffer.append(self.getPairForBuffer(((len(searchBuffer) - 1) * 2) + 1)[1])
            print(searchBuffer)
        
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
        


        




t = Trip()
# print(t.getDistance("cwoiGvvacNGAEAECUK_@QuAm@]OyB}@u@]C?ECmBy@OGSIWKo@Y[KgAe@oAg@sAi@m@[OGg@]USIIMKi@m@W[i@k@IKMQQOIKa@g@MMqA_Bo@}@s@w@g@o@SU_CoCiBuB{AiBa@i@MSIQKOIOGSIMQa@Sc@IWMYQo@yAwEgAmD[iAc@mA[gAIYG]AECQEYOkAo@}FK{@O{@qAsISuA{@qGy@yFIc@Gk@Ew@QeGAUAa@C{@Ci@EkBIiCMeDCk@QyEAIQ_EAYOqDA[SsDGqACo@Gs@Mu@G]Mm@I_@[{AWoAGWqAoEsAuEMi@]cAKWWm@Q]Uc@U_@k@_AeAcB_@k@gAiBWc@aA}Ao@cAiAiBu@mAmB_DeAcBYg@OWmCwEiBsCeEmHa@q@w@uAU]c@y@i@eAO[Q]MY[o@O_@kBaEyC{GMYYk@q@wAKSGOIMe@{@g@}@aAyAWa@S[W]_@k@a@k@OUm@y@e@o@_@i@?E?E?AAAACGIi@w@q@aAaAwA_@k@wCiE[c@i@u@OSSWCEOOMMMO]]][UUKIWWMKKKA?]Yg@_@MKCCIG[Og@YOIo@[kAo@gE{B_CmAi@[_Ag@s@_@yAw@mAq@ECECCCE?E?G?ECkCaBMIo@]]QgAo@]OwEiCWMcAi@_@OcAi@e@U[SgBaAg@We@Wc@UOIMGq@]cAk@IEOG_Ai@g@WOGmAq@}A{@WMUMWQ_CyAGE]S{@q@AAg@a@a@]EEo@k@UWY[MMGI_AgAcAkAWYw@aAg@m@QSkAsAwAcBOSwAeBg@m@cAmAc@i@kByB_CmCs@}@]a@sA}AoA{A{AiBeD_EiC}CiAsAUY_AiA]a@EEqA_B]_@SYKKi@o@w@_A_AkAuAaBsA_BcBsBaAiAiAuAg@m@[]cBuBaAkAW[e@i@_AiAGIm@u@a@c@k@s@Y][_@_AiAu@}@gC{CwBkCkBwBY]s@{@i@m@y@_AKKy@_A_@c@aAgAw@{@SW_BiBi@m@i@o@oB{BkAuAGG{@_Ak@s@gE}EEG{@aAg@k@qCaDkC{CkAsAACw@}@k@m@m@q@w@aAOSY]s@y@gAmAmAqAe@i@_BgBs@y@q@u@cBmB{AcBkC{Cg@k@cAkAiAoAOQgBqBi@k@SSk@m@i@k@QQe@a@EEGECCCAKIYWm@k@SSGIGGsAmAwBmBMOy@q@CCC?CAAC[YUUSUWWaA{@g@e@eB}Aw@s@y@w@WSeB{Aq@i@a@]qAgAcA{@_@Y]Y]Yy@o@{@s@cBsAq@k@u@o@_Au@yAqAKIaA_A[Yi@g@WWg@i@QQ}@w@i@i@e@i@WUc@a@m@i@wAmAyCgCoCcCqAiAiEyD}CsCg@c@kCaC[Yk@g@cA}@qAmAcA}@uEcEWS{@w@US}@y@MKg@e@q@m@o@i@i@e@gAaAMMs@m@OOi@e@a@_@GGKIw@q@_@[Y[k@e@g@c@aA_Ay@q@uCiC}AuAUSSQUUSSWSUSMMIGkAeAyAqA][}CoCQD[Wc@c@Ma@ACCCSUa@a@QYYe@We@O[O_@IUMi@"))
# print(t.getDistanceBetweenTwoPoints({"lat":43.6672211, "lng":-79.3125987}, {"lat": 43.7739717, "lng": -79.1830736}))
# t.addStop(123, food=1, gas=2)
# print(t.stops[0].food)
# print("NEW STUFFFFFF!!!!!!!!!!")
t.setEndCor({"lat": 40.712776, "lng": -74.005974})
t.setStartCor({"lat":42.789379, "lng":-86.107201})
# print(t.stops)
# print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
# print(t.directions)
# print(t.totalTravelTime)
# print(t.totalTravelDistance)
# t.setStartCor({"lat": 40.365232, "lng": -98.109069})
# t.setEndCor({"lat":40.524798, "lng": -98.108422})
print(t.stepTimeIndex)
# t.setTravelPerIncrement((34710, 36296))
t.setTravelPerIncrement((39825, 20189))

print(t.getLocationsOfNextStop())