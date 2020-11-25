export const registerCar = async () => {
  const response = await fetch(`/api/users/${userId}/cars`, {
    method: 'POST',
    headers: {

      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ,
      password
    })
  });
  const data = await response.json();
  return data;
};
