import json
import re
from datetime import datetime, timedelta, timezone

def load_tickers():
    with open("data_const/ticker.json", 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def get_timestamp_for_interval(interval):
    current_time = datetime.utcnow()
    end_time = int(current_time.timestamp() * 1e9)  # API might need seconds; adjust accordingly

    intervals = {
        '1h': 3600,
        '8h': 8 * 3600,
        '1d': 86400,
        '7d': 7 * 86400,
        '1M': 30 * 86400,
        '1y': 365 * 86400
    }

    if interval not in intervals:
        raise ValueError("Invalid interval")

    start_time = end_time - int(intervals[interval] * 1e9)
    return int(start_time), int(end_time)

def get_timeframe(timeframe: str):
    now = datetime.now()
    if timeframe == '1h':
        since = now - timedelta(hours=2)
    elif timeframe == '8h':
        since = now - timedelta(hours=8)
    elif timeframe == '1d':
        since = now - timedelta(days=1)
    elif timeframe == '7d':
        since = now - timedelta(days=7)
    elif timeframe == '1M':
        since = now - timedelta(days=30)  # Approximation for 1 month
    elif timeframe == '1y':
        since = now - timedelta(days=365)
    else:
        raise ValueError("Unsupported timeframe. Use '1h', '8h', '1d', '7d', '1M', or '1y'.")

    since_timestamp = int(since.timestamp() * 1000)
    until_timestamp = int(now.timestamp() * 1000)
    return since_timestamp, until_timestamp

def get_logo_url(symbol, file_path='data_const/crypto_logos.json'):
    # Load the JSON content from the file
    with open(file_path, 'r', encoding='utf-8') as file:
        cc_coins = json.load(file)
    
    # Search for the coin with the matching symbol
    coin = next((coin for coin in cc_coins.values() if coin['symbol'].lower() == symbol.lower()), None)
    
    if coin:
        # Construct the logo URL
        logo_url = f"https://cryptologos.cc/logos/{coin['name'].lower().replace(' ', '-')}-{symbol.lower()}-logo.png"
        return logo_url, coin['name']
    
    return None, None


def time_converter(timestamp):
    time_in_hour = {
        '1h': 1,
        '8h': 8,
        '1d': 24,
        '7d': 168,
        '1M': 720,
        '1y': 8760
    }

    time_delta = datetime.now(timezone.utc) - timedelta(hours=time_in_hour[timestamp])
    since = int(time_delta.timestamp() * 1000)

    return since