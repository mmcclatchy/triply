# Trip Class I/O

## Initialization

- ### startCor

  - kwarg
  - dictionary {'lat': int, 'lng': int}

- ### endCor

  - kwarg
  - dictionary {'lat': int, 'lng': int}

- ### travelPerDay

  - kwarg
  - in seconds

- ### travelPerIncrement

  - travel time between stops
  - kwarg
  - in seconds

- ### milesToRefuel

  - kwarg

- ### avoidTolls

  - kwarg
  - Boolean

---

## .createDirection()

- Makes initial fetch call prior to adding way points
- Use only when Origin and Destination are being set

---

## .addStop(placeIdList, newStopKeysList)

- placeIds
  - list of placeIds in order
- newStopKeys
  - list of first letters of the stops in the same order as the Ids were in

---

## .getFoodAndGasNearLocation(searchQuery, coords)

- Inputs
  - searchQuery
    - String
    - For Food
  - coords
    - Coords of the Hotel
- Output
  - Restaurant and Gas options to be fed to the front end
- The followup to the a Hotel

---

## .getGasNearLocation(coords)

- Inputs
  - coords
    - Coords of the Restaurant
- Output
  - Gas options to be fed to the front end
- The followup to the a Restaurant on a Stop where they should gas up

---

## .getNextStopDetails(**kwargs)

- Inputs
  - Highly recommended  kwarg
    - foodQuery
      - If nothing is passed in, it will just search for 'restaurant'
  - Optional kwargs
    - hotel
      - tuple
        - (min_stars, max_stars)
    - gas
      - boolean
      - defaults to False
- Outputs
- Will return Hotel Options even if foodQuery is passed in
- Will override gas=False if gas is determined that it's needed
- If Hotel:
  - When hotels are brought back to the backend, prompt User with `.getFoodAndGasNearLocation()`
  - When the backend receives the next prompt, give to the database

---

## .getDirections()

    - SAVES DIRECTIONS TO DATABASE
    - Use anytime the directions change

---

## .constructFromDirections(directionsAsJson)

    - use to reconstruct Directions from Database
    - First Initialize the Class Instance with the properties at the top
    - Then use this method to reestablish the Trip Directions

---

## .toDictForDatabase()

    - pretty self explainitory

`Both of these are likely only needed when a new stop is fully created and when the Trip is first Initialized`
    .prettyPrintDuration()

    .prettyPrintTime()

---
---
---

# Front End / Back End Workflow

- All endpoints begin with `/api`, so it's best to add that to the end of `REACT_APP_BASE_URL`
- PUT requests are structured so that all you need to send is what is being modified

## General Workflow

1. FE - Post User's Car details
2. FE - Post Initial Trip details

    - POST: /users/{userId}/trip

3. BE - Returns a Trip Object and Directions
4. FE - Prompts user for Stop Details

    - POST: /trips/{tripId}/stops

5. BE - 

## Creating a Car

- Necessary info for signup                 `backtick not nullable values`

  - userId
  - apiId
  - make
  - model
  - year
  - mpg
  - tankSize

- Car dispatch actions:

```js
// Get all Cars associated with a User
getCars(userId)

// Get a specific Car
getCar(carId)

// Create a new Car for a User
postCar(car, userId)

// Delete a Car
deleteCar(carId)
```

## Creating a Trip

- Necessary info for Trip endpoint

  - userId
  - name
  - carId
  - toll
  - dailyTimeLimit
  - stopTimeLimit
  - startLocation
  - endLocation
  - startTime || endTime

- Trip dispatch actions:

    ```js
    // Get all Trips associated with a User
    getTrips(userId)

    // Get a specific Trip
    getTrip(tripId)

    // Create a new Trip for a User
    postTrip(trip, userId)

    // Modify a Trip
    putTrip(trip, tripId)

    // Delete a Trip
    deleteTrip(tripId)
    ```

## Creating a Stop

- Info for Stop Endpoint

  - foodQuery = string
  - gas = boolean
  - hotel = boolean
  