# Front End / Back End Workflow

## Creating a Trip

1. Frontend API Actions:

```js
export const postTrip = trip => {

  return {
    type: API,
    payload: {
      endpoint: `/users/${userId}/trips`,
      body: trip
      action: trip => setTrip(trip),
    },
  };
};
```

