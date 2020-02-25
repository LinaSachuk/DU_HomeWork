import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
print(Base.classes.keys())

# Save references to the tables
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create session from Python to the DB
session = Session(engine)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        "Welcome to Hawaii climate database.<br/>"
        f"Available Routes:<br/>"
        f"-------------------------<br>"
        "Returns a JSON list of percipitation data for the dates from 2016-08-23 to 2017-08-23.<br/><br/>"
        f"/api/v1.0/precipitation<br/><br/>"
        f"-------------------------<br>"
        "Returns a JSON list of the weather stations.<br/><br/>"
        f"/api/v1.0/stations<br/><br/>"
        f"-------------------------<br>"
         "Returns a JSON list of the  Temperature Observations (tobs) for the previous year.<br/><br/>"
        f"/api/v1.0/tobs<br/><br/>"
         f"-------------------------<br>"
         "Return a JSON list of the minimum temperature, the average temperature, and the max temperature for all dates greater than and equal to the start date.<br/>"
         "Start date example:  2016-01-23 <br/><br/>"
        f"/api/v1.0/<start><br/><br/>"
        f"-------------------------<br>"
        "Return a JSON list of the minimum temperature, the average temperature, and the max temperature for for dates between the start and end date inclusive.<br/>"
        "Start_date/end_date  example:  2016-01-23/2016-06-01 <br/><br/>"
        f"/api/v1.0/<start>/<end><br/>"
    )

last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first().date
print(last_date)

date_365_days_ago = dt.datetime.strptime(last_date, '%Y-%m-%d') - dt.timedelta(days=365)
print(date_365_days_ago)



# Convert the query results to a Dictionary using date as the key and prcp as the value.
# Return the JSON representation of your dictionary.
@app.route("/api/v1.0/precipitation")
def precipitation():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of precipitation"""
    results = session.query(Measurement.date, Measurement.prcp).\
                    filter(Measurement.date >= date_365_days_ago).all()

    session.close()
    
# Create a dictionary from the row data and append to a list of all_precipitation_list
    all_precipitation_list = []
    for i in results:
        precipitation_dict = {}
        precipitation_dict["date"] = i.date
        precipitation_dict["precipitation"] = i.prcp
        all_precipitation_list.append(precipitation_dict)

    return jsonify(all_precipitation_list)



# Return a JSON list of stations from the dataset.
@app.route("/api/v1.0/stations")
def stations():
    """Return a json list of stations from the dataset."""
    
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all the stations
    results = session.query(Station).all()
    
    session.close()

    # Create a dictionary from the row data and append to a list of all_stations_list.
    all_stations_list = []
    for stations in results:
        stations_dict = {}
        stations_dict["Station"] = stations.station
        stations_dict["Station Name"] = stations.name
        stations_dict["Latitude"] = stations.latitude
        stations_dict["Longitude"] = stations.longitude
        stations_dict["Elevation"] = stations.elevation
        all_stations_list.append(stations_dict)
    
    return jsonify(all_stations_list)



# query for the dates and temperature observations from a year from the last data point.
# Return a JSON list of Temperature Observations (tobs) for the previous year.
@app.route("/api/v1.0/tobs")
def tobs():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of precipitation"""
    results = session.query(Measurement.station, Measurement.date,  Measurement.tobs).\
                    filter(Measurement.date >= date_365_days_ago).all()

    session.close()
    
# Create a dictionary from the row data and append to a list of all_tobs_list
    all_tobs_list = []
    for i in results:
        tobs_dict = {}
        tobs_dict["station"] = i.station
        tobs_dict["date"] = i.date
        tobs_dict["temperature observations"] = i.tobs
        all_tobs_list.append(tobs_dict)

    return jsonify(all_tobs_list)


# When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date.
@app.route("/api/v1.0/<start>")
#  This function called `calc_temps` will accept start date and end date in the format '%Y-%m-%d' 
# and return the minimum, average, and maximum temperatures for that range of dates
def calc_temps(start):
    """Returns:
        TMIN, TAVE, and TMAX
    """
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = session.query(func.min(Measurement.tobs), 
                            func.avg(Measurement.tobs), 
                            func.max (Measurement.tobs)).\
                            filter(Measurement.date >= start).all()

    session.close()
    
# Create a dictionary from the row data and append to a list of temp_start_date_list
    temp_start_date_list = []
    for Tmin,  Tavg , Tmax in results:
        temp_start_date_dict = {}
        temp_start_date_dict["Date"] = start
        temp_start_date_dict["Minimum Temperature"] = Tmin
        temp_start_date_dict["Average Temperature"] = round(Tavg, 0)
        temp_start_date_dict["Maximum Temperature"] = Tmax
        temp_start_date_list.append(temp_start_date_dict)

    return jsonify(temp_start_date_list)



# When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive.
@app.route("/api/v1.0/<start>/<end>")
def calc_temps_start_end(start, end):
    """TMIN, TAVG, and TMAX for a list of dates.
    Args:
        start_date (string): A date string in the format %Y-%m-%d
        end_date (string): A date string in the format %Y-%m-%d
    Returns:
        TMIN, TAVE, and TMAX
    """
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = session.query(func.min(Measurement.tobs), 
                         func.avg(Measurement.tobs), 
                         func.max(Measurement.tobs)).\
                         filter(Measurement.date >= start).\
                         filter(Measurement.date <= end).all()

    session.close()
    
# Create a dictionary from the row data and append to a list of temp_start_end_date_list
    temp_start_end_date_list = []
    for Tmin,  Tavg , Tmax in results:
        temp_start_end_date_dict = {}
        temp_start_end_date_dict["Start Date"] = start
        temp_start_end_date_dict["End Date"] = end
        temp_start_end_date_dict["Minimum Temperature"] = Tmin
        temp_start_end_date_dict["Average Temperature"] = round(Tavg, 0)
        temp_start_end_date_dict["Maximum Temperature"] = Tmax
        temp_start_end_date_list.append(temp_start_end_date_dict)

    return jsonify(temp_start_end_date_list)


if __name__ == '__main__':
    app.run(debug=True)
