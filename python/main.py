import json
import time
import datetime
from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, text

with open('config.json', 'r+') as f:
    data = json.load(f)
    database_url = data["database_url"]
    osu_api_key = data["osu_api_key"]

app = FastAPI()
engine = create_engine(database_url)
conn = engine.connect()

@app.get("/")
def read_root():
    return {"Hello": "Pony"}

@app.get("/get_recent_matches")
def read_item():
    result_dict = {"matches": []}
    matches = result_dict["matches"]
    result = conn.execute(text(f"SELECT * FROM WC_22 ORDER BY match_start DESC;")).fetchall()
    for record in result:
        record_dict = {}
        for index, value in enumerate(record):
            if index == 0:
                record_dict["matchID"] = value
            if index == 1:
                team_data = conn.execute(text(f"SELECT * FROM Teams_WC_22 WHERE team_id = {value};")).fetchall()
                team_name = team_data[0][1]
                team_flag = team_data[0][2]
                record_dict["team1"] = {"teamName": team_name, "logo": team_flag}
            if index == 2:
                record_dict["score1"] = int(value)
            if index == 3:
                record_dict["score2"] = int(value)
            if index == 4:
                team_data = conn.execute(text(f"SELECT * FROM Teams_WC_22 WHERE team_id = {value};")).fetchall()
                team_name = team_data[0][1]
                team_flag = team_data[0][2]
                record_dict["team2"] = {"teamName": team_name, "logo": team_flag}
            if index == 5:
                record_dict["date"] = value
            if index == 6:
                record_dict["finished"] = (value != None)
        
        matches.append(record_dict)
        result_dict["matches"] = matches
    return result_dict

@app.get("/search/{search_id}")
def search_item(search_id: str):
    print("in 2")
    return {search_id}

