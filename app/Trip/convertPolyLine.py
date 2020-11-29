def decodePolyline(encoded):
    if not encoded:
        return []

    poly = []
    index = 0
    length = len(encoded)
    lat = 0
    lng = 0

    while index < length:
        b = None
        shift = 0
        result = 0

        b = ord(encoded[index]) - 63
        index = index + 1
        result = result | ((b & 0x1f) << shift)
        shift += 5

        while b >= 32:
            b = ord(encoded[index]) - 63
            index = index + 1
            result = result | ((b & 0x1f) << shift)
            shift += 5

        dlng = ~(result >> 1) if (result & 1) != 0  else (result >> 1)
        lat += dlng

        shift = 0
        result = 0

        b = ord(encoded[index]) - 63
        index = index + 1
        result = result | ((b & 0x1f) << shift)
        shift += 5

        while b >= 32:
            b = ord(encoded[index]) - 63
            index = index + 1
            result = result | ((b & 0x1f) << shift)
            shift += 5

        dlng = ~(result >> 1) if (result & 1) != 0  else (result >> 1)
        lng += dlng

        p = {
            "lat": lat / 100000,
            "lng": lng / 100000,
        }
        poly.append(p)
    return poly


# print(decodePolyline("ynxiGf}vbNQEUIOEEAKESQUQGEIGOOQSMMWSa@a@WWYSKIKEMGc@QWIOGCAAAEEG?ICIECECGACAI_@QOGGCM?K?G@GAK?MEMGWOOGq@c@}@m@cC{AmAs@qAs@ECiBgAGYIQCGIKY_@OUCEGKEKAEEUAAIo@AAO_ACOCGACACAAA?A?A?SD"))
