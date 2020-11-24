from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
from .Stop import Stop
import requests
# How to use the trip:
#  To get the distance of a polyline, pass the hashed value to the "getDistance" function


class Trip:


    ##todo: add method that converts to things that can easily save
    ##      add static method to give id from database and builds a trip
    def __init__(self, **kwargs):
        self.endBuffer = 0


        self.basicDirectionUrl = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBmKKKPntFx-1yFUAIgXjWQU3wykVlBt3Y"
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
            origin = str(self.startCor["lat"]) + "," + str(self.startCor["lgn"])
            destination = str(self.endCor["lat"]) + "," + str(self.endCor["lgn"])
            url = self.makeUrl(origin=origin, destination=destination)
            print(url)
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
            self.totalTravelDistance = round(distance * 0.000621371)
            self.totalTravelTime = time * 1000

            start = Stop(self.startCor, 0)
            end = Stop(self.endCor, self.totalTravelTime)
            self.stops = [start, end]

            self.indexSteps()


    def indexSteps(self):
        index = []
        current = 0
        for i in range(len(self.directions)):
            current += (self.directions[i]["duration"]["value"] * 1000)
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
        # approximate radius of earth in km
        R = 3963.2

        lat1 = radians(c1["lat"])
        lon1 = radians(c1["lgn"])
        lat2 = radians(c2["lat"])
        lon2 = radians(c2["lgn"])

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
    
    def getLocationsOfNextStop(self):
        print(self.stops)
        if self.travelPerIncrement[0] < ((self.stops[-1].time - self.stops[-2].time) + self.endBuffer):
            lastStopTime = self.stops[-2].time
            current = 0
            for i in range(len(self.stepTimeIndex)):
                print("....................", self.stepTimeIndex[i][1] - self.stops[-2].time)
                if self.travelPerIncrement[0] < (self.stepTimeIndex[i][1] - self.stops[-2].time):
                    break
            cordinates = self.decodePolyline(self.directions[i-1]["polyline"]["points"])

            currentTime = self.stepTimeIndex[i - 1][1]
            for j in range(len(cordinates)):
                if j == (len(cordinates) - 1):
                    #Handle edge case
                    return "It was the last jabroni"
                else:
                    !!!!!!currentTime += self.getDistanceBetweenTwoPoints(cordinates[j], cordinates[j+1])!!!!!!!! #current time needs to be added with speedlimit
                    print(currentTime)
                    if currentTime - lastStopTime > self.travelPerIncrement[0]:
                        return cordinates[j]


        else:
            return None





t = Trip()
# print(t.getDistance("cwoiGvvacNGAEAECUK_@QuAm@]OyB}@u@]C?ECmBy@OGSIWKo@Y[KgAe@oAg@sAi@m@[OGg@]USIIMKi@m@W[i@k@IKMQQOIKa@g@MMqA_Bo@}@s@w@g@o@SU_CoCiBuB{AiBa@i@MSIQKOIOGSIMQa@Sc@IWMYQo@yAwEgAmD[iAc@mA[gAIYG]AECQEYOkAo@}FK{@O{@qAsISuA{@qGy@yFIc@Gk@Ew@QeGAUAa@C{@Ci@EkBIiCMeDCk@QyEAIQ_EAYOqDA[SsDGqACo@Gs@Mu@G]Mm@I_@[{AWoAGWqAoEsAuEMi@]cAKWWm@Q]Uc@U_@k@_AeAcB_@k@gAiBWc@aA}Ao@cAiAiBu@mAmB_DeAcBYg@OWmCwEiBsCeEmHa@q@w@uAU]c@y@i@eAO[Q]MY[o@O_@kBaEyC{GMYYk@q@wAKSGOIMe@{@g@}@aAyAWa@S[W]_@k@a@k@OUm@y@e@o@_@i@?E?E?AAAACGIi@w@q@aAaAwA_@k@wCiE[c@i@u@OSSWCEOOMMMO]]][UUKIWWMKKKA?]Yg@_@MKCCIG[Og@YOIo@[kAo@gE{B_CmAi@[_Ag@s@_@yAw@mAq@ECECCCE?E?G?ECkCaBMIo@]]QgAo@]OwEiCWMcAi@_@OcAi@e@U[SgBaAg@We@Wc@UOIMGq@]cAk@IEOG_Ai@g@WOGmAq@}A{@WMUMWQ_CyAGE]S{@q@AAg@a@a@]EEo@k@UWY[MMGI_AgAcAkAWYw@aAg@m@QSkAsAwAcBOSwAeBg@m@cAmAc@i@kByB_CmCs@}@]a@sA}AoA{A{AiBeD_EiC}CiAsAUY_AiA]a@EEqA_B]_@SYKKi@o@w@_A_AkAuAaBsA_BcBsBaAiAiAuAg@m@[]cBuBaAkAW[e@i@_AiAGIm@u@a@c@k@s@Y][_@_AiAu@}@gC{CwBkCkBwBY]s@{@i@m@y@_AKKy@_A_@c@aAgAw@{@SW_BiBi@m@i@o@oB{BkAuAGG{@_Ak@s@gE}EEG{@aAg@k@qCaDkC{CkAsAACw@}@k@m@m@q@w@aAOSY]s@y@gAmAmAqAe@i@_BgBs@y@q@u@cBmB{AcBkC{Cg@k@cAkAiAoAOQgBqBi@k@SSk@m@i@k@QQe@a@EEGECCCAKIYWm@k@SSGIGGsAmAwBmBMOy@q@CCC?CAAC[YUUSUWWaA{@g@e@eB}Aw@s@y@w@WSeB{Aq@i@a@]qAgAcA{@_@Y]Y]Yy@o@{@s@cBsAq@k@u@o@_Au@yAqAKIaA_A[Yi@g@WWg@i@QQ}@w@i@i@e@i@WUc@a@m@i@wAmAyCgCoCcCqAiAiEyD}CsCg@c@kCaC[Yk@g@cA}@qAmAcA}@uEcEWS{@w@US}@y@MKg@e@q@m@o@i@i@e@gAaAMMs@m@OOi@e@a@_@GGKIw@q@_@[Y[k@e@g@c@aA_Ay@q@uCiC}AuAUSSQUUSSWSUSMMIGkAeAyAqA][}CoCQD[Wc@c@Ma@ACCCSUa@a@QYYe@We@O[O_@IUMi@"))
# print(t.getDistanceBetweenTwoPoints({"lat":43.6672211, "lgn":-79.3125987}, {"lat": 43.7739717, "lgn": -79.1830736}))
# t.addStop(123, food=1, gas=2)
# print(t.stops[0].food)
# print("NEW STUFFFFFF!!!!!!!!!!")
t.setEndCor({"lat": 40.712776, "lgn": -74.005974})
t.setStartCor({"lat":42.789379, "lgn":-86.107201})
# print(t.stops)
# print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
# print(t.directions)
# print(t.totalTravelTime)
# print(t.totalTravelDistance)
print(t.stepTimeIndex)
t.setTravelPerIncrement((21600000, 21600000))
print(t.getLocationsOfNextStop())
