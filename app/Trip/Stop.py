class Stop:
    def __init__(self, cord, **kwargs):
        self.cord = cord
        
        self.food = kwargs.get("food")
        self.gas = kwargs.get("gas") 
        self.hotel = kwargs.get("hotel") 

    def setFood(rest):
        self.food = rest

    def setGas(gas):
        self.gas = gas

    def setHotel(hotel):
        self.hotel = hotel