from .convertPolyLine import decodePolyline
from math import sin, cos, sqrt, atan2, radians
from .Stop import Stop

# How to use the trip:
#  To get the distance of a polyline, pass the hashed value to the "getDistance" function


class Trip:
    def __init__(self, startCor, endCor, travelPerDay, travelPerIncrement, foodTypes):
        self.startCor = startCor
        self.endCor = endCor
        self.travelPerDay = travelPerDay
        self.travelPerIncrement = travelPerIncrement
        self.foodType = foodTypes
        
        self.stops = []


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




t = Trip(1,2,3,4,5)
print(t.getDistance("cwoiGvvacNGAEAECUK_@QuAm@]OyB}@u@]C?ECmBy@OGSIWKo@Y[KgAe@oAg@sAi@m@[OGg@]USIIMKi@m@W[i@k@IKMQQOIKa@g@MMqA_Bo@}@s@w@g@o@SU_CoCiBuB{AiBa@i@MSIQKOIOGSIMQa@Sc@IWMYQo@yAwEgAmD[iAc@mA[gAIYG]AECQEYOkAo@}FK{@O{@qAsISuA{@qGy@yFIc@Gk@Ew@QeGAUAa@C{@Ci@EkBIiCMeDCk@QyEAIQ_EAYOqDA[SsDGqACo@Gs@Mu@G]Mm@I_@[{AWoAGWqAoEsAuEMi@]cAKWWm@Q]Uc@U_@k@_AeAcB_@k@gAiBWc@aA}Ao@cAiAiBu@mAmB_DeAcBYg@OWmCwEiBsCeEmHa@q@w@uAU]c@y@i@eAO[Q]MY[o@O_@kBaEyC{GMYYk@q@wAKSGOIMe@{@g@}@aAyAWa@S[W]_@k@a@k@OUm@y@e@o@_@i@?E?E?AAAACGIi@w@q@aAaAwA_@k@wCiE[c@i@u@OSSWCEOOMMMO]]][UUKIWWMKKKA?]Yg@_@MKCCIG[Og@YOIo@[kAo@gE{B_CmAi@[_Ag@s@_@yAw@mAq@ECECCCE?E?G?ECkCaBMIo@]]QgAo@]OwEiCWMcAi@_@OcAi@e@U[SgBaAg@We@Wc@UOIMGq@]cAk@IEOG_Ai@g@WOGmAq@}A{@WMUMWQ_CyAGE]S{@q@AAg@a@a@]EEo@k@UWY[MMGI_AgAcAkAWYw@aAg@m@QSkAsAwAcBOSwAeBg@m@cAmAc@i@kByB_CmCs@}@]a@sA}AoA{A{AiBeD_EiC}CiAsAUY_AiA]a@EEqA_B]_@SYKKi@o@w@_A_AkAuAaBsA_BcBsBaAiAiAuAg@m@[]cBuBaAkAW[e@i@_AiAGIm@u@a@c@k@s@Y][_@_AiAu@}@gC{CwBkCkBwBY]s@{@i@m@y@_AKKy@_A_@c@aAgAw@{@SW_BiBi@m@i@o@oB{BkAuAGG{@_Ak@s@gE}EEG{@aAg@k@qCaDkC{CkAsAACw@}@k@m@m@q@w@aAOSY]s@y@gAmAmAqAe@i@_BgBs@y@q@u@cBmB{AcBkC{Cg@k@cAkAiAoAOQgBqBi@k@SSk@m@i@k@QQe@a@EEGECCCAKIYWm@k@SSGIGGsAmAwBmBMOy@q@CCC?CAAC[YUUSUWWaA{@g@e@eB}Aw@s@y@w@WSeB{Aq@i@a@]qAgAcA{@_@Y]Y]Yy@o@{@s@cBsAq@k@u@o@_Au@yAqAKIaA_A[Yi@g@WWg@i@QQ}@w@i@i@e@i@WUc@a@m@i@wAmAyCgCoCcCqAiAiEyD}CsCg@c@kCaC[Yk@g@cA}@qAmAcA}@uEcEWS{@w@US}@y@MKg@e@q@m@o@i@i@e@gAaAMMs@m@OOi@e@a@_@GGKIw@q@_@[Y[k@e@g@c@aA_Ay@q@uCiC}AuAUSSQUUSSWSUSMMIGkAeAyAqA][}CoCQD[Wc@c@Ma@ACCCSUa@a@QYYe@We@O[O_@IUMi@"))
print(t.getDistanceBetweenTwoPoints({"lat":43.6672211, "lgn":-79.3125987}, {"lat": 43.7739717, "lgn": -79.1830736}))
t.addStop(123, food=1, gas=2)
print(t.stops[0].food)