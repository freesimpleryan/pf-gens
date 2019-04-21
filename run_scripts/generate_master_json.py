from os import listdir
from os.path import isfile, join
import os
import json

if __name__ == "__main__":
    mypath = "../data"
    try:
        os.remove("../data/master.json")
    except Exception:
        pass
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    data = {
        "data": []
    }
    d = data["data"]
    for f in onlyfiles:
        d.append(f)
    with open("../data/master.json", "w+") as outfile:
        outfile.write(json.dumps(data))