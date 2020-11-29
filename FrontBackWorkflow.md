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
  