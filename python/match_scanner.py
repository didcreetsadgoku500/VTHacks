import requests
import json
import time
import traceback
from sqlalchemy import create_engine, text

# Store our environment specific data in a config file. Could likely be done in a better way.
with open('config.json', 'r+') as f:
    data = json.load(f)
    match_id = data["initial_match_id"]
    database_url = data["database_url"]
    osu_api_key = data["osu_api_key"]

engine = create_engine(database_url)
conn = engine.connect()
retries = 0

# This script takes a different approach, monitoring matches via their (predictable) match ID, to gain (nearly) real-time insights.
conn.execute(text("CREATE TABLE IF NOT EXISTS Matches(match_id INT PRIMARY KEY, user_ids OID[]);")) # Use OID to conserve memory, though the docs recommend against it.

while True:
    try:
        response = requests.get(f"https://osu.ppy.sh/api/get_match?k={osu_api_key}&mp={match_id}").json()
        if response["match"] != 0:
            if response["match"]["name"].startswith("OWC2022: "):
                print("Potential WC22 match, updating database!")

                t1_name = response["match"]["name"].split("(")[1].split(")")[0]
                t2_name = response["match"]["name"].split("(")[2].split(")")[0]

                t1_id = conn.execute(text(f"SELECT team_id FROM Teams_WC_22 WHERE t_name = '{t1_name}'")).fetchall()[0][0]
                t2_id = conn.execute(text(f"SELECT team_id FROM Teams_WC_22 WHERE t_name = '{t2_name}'")).fetchall()[0][0]
                
                start_time = response["match"]["start_time"]
                end_time = response["match"]["end_time"]

                sum_t1, sum_t2 = 0
                points_t1, points_t2 = 0
                for game in response["games"]:
                    for score in game["scores"]:
                        if score["team"] == "1":
                            sum_t1 += score["score"]
                        else:
                            sum_t2 += score["score"]
                    if sum_t1 > sum_t2:
                        points_t1 += 1
                    else:
                        points_t2 += 1
                    
                # May have a situation where we come across a match that hasn't started, should recheck a few times.
                if response["games"] != []: 
                    conn.execute(text(f"INSERT INTO WC_22 (match_id, t1_id, t1_score, t2_score, t2_id, match_start, match_end) VALUES ({match_id}, {t1_id}, {points_t1}, {points_t2}, {t2_id}, TIMESTAMP '{start_time}', TIMESTAMP '{end_time}');"))
                    while end_time == None:
                        time.sleep(1) # Second delay to prevent ratelimit and give match time to update.
                        response = requests.get(f"https://osu.ppy.sh/api/get_match?k={osu_api_key}&mp={match_id}").json()

                        end_time = response["match"]["end_time"]

                        sum_t1, sum_t2 = 0
                        points_t1, points_t2 = 0
                        for game in response["games"]:
                            for score in game["scores"]:
                                if score["team"] == "1":
                                    sum_t1 += score["score"]
                                else:
                                    sum_t2 += score["score"]
                            if sum_t1 > sum_t2:
                                points_t1 += 1
                            else:
                                points_t2 += 1
                            
                        # May have a situation where we come across a match that hasn't started, should recheck a few times.
                        if response["games"] != []: 
                            conn.execute(text(f"UPDATE WC_22 SET (t1_score, t2_score, match_end) = ({points_t1}, {points_t2}, TIMESTAMP '{end_time}') WHERE match_id = '{match_id}';"))

            else:
                id_set = set()
                for game in response["games"]:
                    for score in game["scores"]:
                        id_set.add(int(score["user_id"]))
                if response["games"] != []:
                    ids = list(id_set)
                    conn.execute(text(f"INSERT INTO Matches (match_id, user_ids) VALUES ({match_id}, ARRAY{ids});"))
            match_id += 1
            retries = 0
            print(f"Checking Match ID: {match_id}")
            time.sleep(.5) # Prevent OSU API ratelimit, could use multiple api keys instead.
        else:
            if (retries % 10) == 0 and retries != 0:
                match_id += 1
                retries = 0
                print(f"Proceeding to Match ID: {match_id}")
            else:
                print(f"Rechecking Match ID: {match_id}")
                retries += 1

            time.sleep(1.5) # At this point, there is nothing to do but wait for the next match.
        
    except Exception as e:
        traceback.print_exc()
        print(f"Error Occurred: {e}")

    finally:
        with open('config.json', 'r+') as f:
            data = json.load(f)
            data["initial_match_id"] = match_id
            f.seek(0)        
            json.dump(data, f, indent=4)
            f.truncate()
            


