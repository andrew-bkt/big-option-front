import streamlit as st
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL")

st.title("Big Option API Interface")

# Collect Data Section
st.header("Collect Option Data")

symbol = st.text_input("Symbol")
multiplier = st.number_input("Multiplier", min_value=1, value=1)
timespan = st.selectbox("Timespan", ["minute", "hour", "day", "week", "month", "quarter", "year"])
from_date = st.date_input("From Date")
to_date = st.date_input("To Date")

if st.button("Collect Data"):
    payload = {
        "symbol": symbol,
        "multiplier": multiplier,
        "timespan": timespan,
        "from_date": from_date.isoformat(),
        "to_date": to_date.isoformat()
    }
    try:
        response = requests.post(f"{API_BASE_URL}/collect_data/", json=payload)
        response.raise_for_status()
        st.success(response.json()["message"])
    except requests.exceptions.RequestException as e:
        st.error(f"An error occurred: {str(e)}")

# Fetch Data Section
st.header("Fetch Option Data")

fetch_symbol = st.text_input("Symbol to Fetch")
start_date = st.date_input("Start Date")
end_date = st.date_input("End Date")

if st.button("Fetch Data"):
    params = {
        "symbol": fetch_symbol,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat()
    }
    try:
        response = requests.get(f"{API_BASE_URL}/option_data/", params=params)
        response.raise_for_status()
        data = response.json()
        st.write(data)
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to fetch data: {str(e)}")
