# Front End / Back End Workflow

## Creating a Trip

1. Frontend API Actions:

    - Necessary info for Trip endpoint

    - All endpoints begin with `/api`, so it's best to add that to the end of `REACT_APP_BASE_URL`

    ```js
    const returningAction = payload => ({ type: ACTION_NAME, payload })

    // add id to parameters if the endpoint url necessitates
    const action = payload => ({
        type: API,
        // import API from constants/constants.js
        method: 'GET/POST/PUT/DELETE',
        // add ${id} if the endpoint requires one
        endpoint: `/the/correct/endpoint`,
        // The action to take place when the fetch data is returned
        altAction: (data) => returningAction(data)
    })
    ```

    - Example:

    ```js
    const setTrip = trip => ({ type: SET_TRIP, trip })

    export const postTrip = (trip, userId) => ({
        type: API,
        payload: {
        method: 'POST',
        endpoint: `/users/${userId}/trips`,
        body: trip,
        action: trip => setTrip(trip),
        },
    });
    ```

