export const registerCar = async (data, id) => {
  const response = await fetch(`/api/users/${id}/cars`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const res = await response.json();
  console.log(data);
  return res;
};
