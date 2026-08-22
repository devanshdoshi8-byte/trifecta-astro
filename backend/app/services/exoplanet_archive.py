import requests
import urllib.parse
from typing import Optional, Dict, Any, List

NASA_TAP_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

def query_nasa_exoplanet_archive(adql_query: str, timeout: int = 8) -> Optional[List[Dict[str, Any]]]:
    """
    Executes an ADQL query against the NASA Exoplanet Archive TAP service.
    Zero API key required.
    """
    try:
        encoded_query = urllib.parse.quote(adql_query)
        url = f"{NASA_TAP_URL}?query={encoded_query}&format=json"
        
        headers = {"User-Agent": "TrifectaFramework/0.1.0 (Astrophysics Research Prototype)"}
        resp = requests.get(url, headers=headers, timeout=timeout)
        
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and len(data) > 0:
                return data
    except Exception as e:
        print(f"[NASA TAP] Query warning ({e}): {adql_query[:60]}...")
    return None

def fetch_toi_metadata(toi_number: str) -> Optional[Dict[str, Any]]:
    """
    Lookup by TOI identifier (e.g. '700', '849', '1233.01')
    """
    clean_toi = toi_number.upper().replace("TOI", "").replace("-", "").strip()
    query = f"SELECT top 1 toi,tid,tfopwg_disp,ra,dec,pl_orbper,pl_trandep,pl_trandur,pl_rade,st_teff,st_rad,st_mass,st_tmag,st_logg FROM toi WHERE toi LIKE '%{clean_toi}%' OR tid LIKE '%{clean_toi}%'"
    rows = query_nasa_exoplanet_archive(query)
    if rows:
        return rows[0]
    return None

def fetch_tic_metadata(tic_id: str) -> Optional[Dict[str, Any]]:
    """
    Lookup by TIC identifier
    """
    clean_tic = tic_id.upper().replace("TIC", "").replace("-", "").strip()
    query = f"SELECT top 1 toi,tid,tfopwg_disp,ra,dec,pl_orbper,pl_trandep,pl_trandur,pl_rade,st_teff,st_rad,st_mass,st_tmag,st_logg FROM toi WHERE tid = {clean_tic}"
    rows = query_nasa_exoplanet_archive(query)
    if rows:
        return rows[0]
    return None

def fetch_confirmed_planet_metadata(planet_name: str) -> Optional[Dict[str, Any]]:
    """
    Lookup confirmed exoplanets from pscomppars table
    """
    clean_name = planet_name.strip()
    query = f"SELECT top 1 pl_name,hostname,discoverymethod,pl_orbper,pl_trandep,pl_trandur,pl_rade,pl_masse,pl_eqt,st_teff,st_rad,st_mass,st_tmag,ra,dec FROM pscomppars WHERE pl_name LIKE '%{clean_name}%' OR hostname LIKE '%{clean_name}%'"
    rows = query_nasa_exoplanet_archive(query)
    if rows:
        return rows[0]
    return None
