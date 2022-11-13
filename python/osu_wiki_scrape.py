import os
import json
import lxml
import requests
import cchardet
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, text

# Store our environment specific data in a config file. Could likely be done in a better way.
with open('config.json', 'r+') as f:
    data = json.load(f)
    first_run = data["first_run"]
    country_codes = data["countries"]
    database_url = data["database_url"]
    osu_api_key = data["osu_api_key"]

engine = create_engine(database_url)
conn = engine.connect()

# This script pre-populates our database with existing World Cup tournament data obtained from the OSU wiki (https://osu.ppy.sh/wiki/en/Tournaments/OWC/2022)
response = requests.get("https://osu.ppy.sh/wiki/en/Tournaments/OWC/2022")
soup = BeautifulSoup(response.content, 'lxml', from_encoding="utf8")

if first_run:
    conn.execute(text("DROP TABLE IF EXISTS Teams_WC_22;"))
    conn.execute(text("DROP TABLE IF EXISTS WC_22;")) 

    conn.execute(text("CREATE TABLE IF NOT EXISTS Teams_WC_22(team_id OID PRIMARY KEY, t_name STRING, t_icon STRING);")) # Use OID to conserve memory, though the docs recommend against it.
    insert_rows = ""
    separator = ","
    participants = soup.find(id="participants") # Find id = participants
    teams_table = participants.findNext("table") # Find the first table that follows the participants text
    # Build table consisting of World Cup 2022 team data (team id, team name, team flag).
    rows = teams_table.findAll('tr')
    for row_index, tr in enumerate(rows):
        cols = tr.findAll('td')
        for col_index, td in enumerate(cols):
            if col_index == 1: 
                country = td.text.strip(" ")
                insert_rows += f"({row_index-1}, '{country}', 'https://osuflags.omkserver.nl/{country_codes[country]}.png')"
                if row_index + 1 == len(rows):
                    separator = ""
                insert_rows += separator

    conn.execute(text(f"INSERT INTO Teams_WC_22 (team_id, t_name, t_icon) VALUES {insert_rows};"))

    # Create table consisting of World Cup 2022 match data
    conn.execute(text("CREATE TABLE IF NOT EXISTS WC_22(match_id OID PRIMARY KEY, t1_id OID, t1_score OID, t2_score OID, t2_id OID, match_start TIMESTAMP, match_end TIMESTAMP)"))

    match_dates = ["Saturday, 5 November 2022:", "Sunday, 6 November 2022:", "Saturday, 29 October 2022:", "Sunday, 30 October 2022:", "Saturday, 22 October 2022:", "Sunday, 23 October 2022:"]
    for count, date in enumerate(match_dates):
        insert_rows = ""
        separator = ","
        match_date = soup.find('p',text=date) # Find table below the appropriate date
        match_table = match_date.findNext("table") # Find the first table that follows the date text
        # Build table consisting of World Cup 2022 team data (team id, team name, team flag).
        rows = match_table.findAll('tr')
        for row_index, tr in enumerate(rows):
            insert_row = ""
            cols = tr.findAll('td')
            for col_index, td in enumerate(cols):
                if (col_index == 0) or (col_index == 3):
                    team_name = td.text.strip(" ")
                    team_id = conn.execute(text(f"SELECT team_id FROM Teams_WC_22 WHERE t_name = '{team_name}'")).fetchall()[0][0]
                    insert_row += f"{team_id},"

                elif (col_index == 1) or (col_index == 2):
                    team_score = td.text.strip(" ")
                    insert_row += f"{team_score},"

                else:
                    match_url = td.find("a")['href']
                    match_id = match_url.split("/")[5]
                    insert_row = "(" + match_id + "," + insert_row
                    response = requests.get(f"https://osu.ppy.sh/api/get_match?k={osu_api_key}&mp={match_id}").json()
                    start_match_ts = response["match"]["start_time"] 
                    end_match_ts = response["match"]["end_time"]
                    if row_index == len(rows) - 1:
                        separator = ""
                    insert_row += "TIMESTAMP " + "'" + start_match_ts + "'" + "," + "TIMESTAMP " + "'" + end_match_ts + "'" +")" + separator
                    insert_rows += insert_row

        conn.execute(text(f"INSERT INTO WC_22 (match_id, t1_id, t1_score, t2_score, t2_id, match_start, match_end) VALUES {insert_rows};"))
    
        with open('config.json', 'r+') as f:
            data = json.load(f)
            data["first_run"] = False
            f.seek(0)        
            json.dump(data, f, indent=4)
            f.truncate()

