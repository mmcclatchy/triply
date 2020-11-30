from urllib import parse
import requests
import os


api_key = os.environ['FRONTEND_API_KEY']


def camelCase(string):
    if not isinstance(string, str):
        return string
    i = 0
    new_str = ''
    while i < len(string):
        if string[i] == '_':
            new_str += string[i+1].upper()
            i += 2
        else:
            new_str += string[i]
            i += 1
    return new_str


def normalize(lst):
    if not isinstance(lst, list):
        lst = [lst]
    normalized = {}
    for x in lst:
        y = {}
        for key in x:
            y[camelCase(key)] = camelCase(x[key])
        normalized[y['id']] = y
    return normalized


def snake_case(string):
    if not isinstance(string, str):
        return string
    i = 0
    new_str = ''
    while i < len(string):
        if string[i].isupper():
            new_str += f'_{string[i].lower()}'
            i += 1
        else:
            new_str += string[i]
            i += 1
    return new_str


def to_dict(inst):
    inst_dict = {}
    for col in inst.__table__.columns:
        i = col.index('.')
        key = col[i+1:]
        inst_dict[key] = inst[key]
    return inst_dict


def get_place_coords(place):
    formatted_place = parse.quote(place)
    url = f'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={formatted_place}&inputtype=textquery&fields=formatted_address,name,geometry,place_id&key={api_key}'
    res = requests.get(url)
    res = res.json()
    lat = res['candidates'][0]['geometry']['location']['lat']
    lng = res['candidates'][0]['geometry']['location']['lng']
    return {'lat': lat, 'lng': lng}


def coords_to_str(coords):
    return f'{coords["lat"]},{coords["lng"]}'


def coords_from_str(coords):
    return coords.split(',')


def create_stop_keys(data):
    return [place_id[0] for place_id in data['placeIds']]


def create_place_id_list(data):
    return [data['placeIds'][key] for key in data['placeIds']]
