const key = process.env.REACT_APP_CAR_KEY;

const xmlToJson = xml => {
  var obj = {};

  if (xml.nodeType == 1) {
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    obj = xml.nodeValue;
  }

  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == 'undefined') {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

export const getMakes = async year => {
  const xmlResponse = await fetch(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`
  );
  const xmlText = await xmlResponse.text();
  const xml = await new window.DOMParser().parseFromString(
    xmlText,
    'text/xml'
  );
  const data = await xmlToJson(xml).menuItems.menuItem;
  return data;
};

export const getModels = async (year, make) => {
  const xmlResponse = await fetch(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`
  );
  const xmlText = await xmlResponse.text();
  const xml = await new window.DOMParser().parseFromString(
    xmlText,
    'text/xml'
  );
  const data = await xmlToJson(xml).menuItems.menuItem;
  return data;
};

export const getVehicleId = async (year, make, model) => {
  const xmlResponse = await fetch(
    `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`
  );
  const xmlText = await xmlResponse.text();
  const xml = await new window.DOMParser().parseFromString(
    xmlText,
    'text/xml'
  );
  const data = await xmlToJson(xml).menuItems.menuItem;
  if (data) {
    return data;
  } else {
    console.error('Something went wrong...');
  }
};

export const getMPG = async vehicleID => {
  const xmlResponse = await fetch(
    `https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleID}`
  );
  const xmlText = await xmlResponse.text();
  const xml = await new window.DOMParser().parseFromString(
    xmlText,
    'text/xml'
  );
  const data = await xmlToJson(xml).vehicle['comb08']['#text'];
  if (data) {
    return data;
  } else {
    console.error('Something went wrong...');
  }
};

export const getTankSize = async (make, model, year) => {
  const response = await fetch(
    `https://apis.solarialabs.com/shine/v1/vehicle-stats/specs?make=${make}&model=${model}&year=${year}&full-data=true&apikey=${key}`
  );
  const data = await response.json();
  return data;
};
