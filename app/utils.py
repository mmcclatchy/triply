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
    if isinstance(lst, dict):
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
