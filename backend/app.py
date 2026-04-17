from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import math
import time

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    lat = float(data.get('lat', 0.0))
    lon = float(data.get('lon', 0.0))
    temp = float(data.get('temp', 25))
    wind = float(data.get('wind', 10))
    rain = float(data.get('rain', 0))
    scenario = data.get('scenario', 'Fire')

    # Refined Scoring Logic (User Formula: (temp * 0.3) + (wind * 0.35) + (rain * 0.35))
    # Scenario weighting:
    # - Earthquake: No rainfall dependency
    # - Cyclone: Linked wind + rainfall
    # - Drought: Long-term focus (low intensity but high score over time)
    
    risk_score = 0
    if scenario == 'Earthquake':
        # Ignore rain, heavy weight on "Tectonic Stress" (simulated by temp/wind in this demo sliders)
        risk_score = (temp * 1.5) + random.uniform(20, 40)
    elif scenario == 'Cyclone':
        # Correlated wind + rain
        risk_score = (wind * 0.5) + (rain * 0.4) + (temp * 0.1)
    elif scenario == 'Drought':
        # Low but steady, temp driven
        risk_score = (temp * 0.8) - (rain * 0.5) + random.uniform(10, 20)
    elif scenario == 'Flood':
        risk_score = (rain * 0.7) + (wind * 0.2) + random.uniform(5, 15)
    else: # Fire
        risk_score = (temp * 0.6) + (wind * 0.4) - (rain * 0.3)

    # Apply the base formula as a normalized component
    base_formula = (temp * 0.3) + (wind * 0.35) + (rain * 0.35)
    final_score = (risk_score * 0.7) + (base_formula * 0.3)
    final_score = max(0, min(100, final_score))

    if final_score > 75:
        risk_level = "High"
    elif final_score > 40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    # Damage metrics
    density = random.uniform(1.5, 4.0)
    buildings_affected = int(final_score * density * random.uniform(10, 20))
    people_displaced = int(buildings_affected * random.uniform(2.5, 4.5))
    roads_blocked = max(0, int(final_score / 10 * random.uniform(0.5, 2.0)))

    # Zone generation
    radius = max(500, final_score * 50)
    zones = [{"lat": lat, "lng": lon, "radius": radius, "type": "danger", "color": "red", "scenario": scenario}]

    safe_lat = lat - 0.05
    safe_lon = lon - 0.05
    safe_route = [[lat, lon], [lat - 0.02, lon - 0.03], [safe_lat, safe_lon]]

    ts = time.strftime("[%H:%M]")
    logs = [
        f"{ts} NEXUS Intelligence analysis initiated...",
        f"{ts} Scenarios evaluated: {scenario}",
        f"{ts} Computed Score: {final_score:.1f}% (Base Algorithm)",
        f"{ts} Temporal context: Region profile matches historical cyclical patterns.",
        f"{ts} Recommendation: {risk_level} alert status issued."
    ]

    # 24-hour timeline
    timeline = []
    for hour in range(25):
        t = hour / 24.0
        peak = math.sin(math.pi * t * 0.85) if t < 0.85 else math.sin(math.pi * 0.85) * max(0, 1 - (t - 0.85) / 0.2)
        hr = max(0, min(100, final_score * (0.25 + peak * 0.95) + random.uniform(-3, 3)))
        timeline.append({
            "time": hour,
            "risk": round(hr, 1),
            "buildings": int(buildings_affected * (hr / max(final_score, 1))),
            "people": int(people_displaced * (hr / max(final_score, 1))),
        })

    return jsonify({
        "risk_level": risk_level,
        "risk_score": round(final_score, 1),
        "people_affected": people_displaced,
        "zones": zones,
        "safe_route": safe_route,
        "logs": logs,
        "damage": {"buildings": buildings_affected, "people": people_displaced, "roads": roads_blocked},
        "timeline": timeline,
    })

# Historical Dataset for Global Intelligence (expanded v3.4GA)
HISTORICAL_DATA = {
    "India": {
        "temporal_intel": {"frequency": "3-5 years", "last_event": 2019, "next_window": "2026-2028"},
        "disasters": [
            { "id": "ind-fld-2018", "year": 2018, "name": "Kerala Floods", "type": "Flood", "severity": 9, "damage_inr": 25000, "lat": 10.8505, "lng": 76.2711, "drilldown": { "description": "Unbalanced monsoon rainfall led to worst floods in nearly a century in Kerala.", "stats": {"houses": "120,000+", "displaced": "1.2 Million", "infra": "Critical"}, "timeline": ["Aug 8: Landslides", "Aug 15: Dam openings", "Aug 20: Peak inundation"] } },
            { "id": "ind-cyc-2019", "year": 2019, "name": "Odisha Cyclone Fani", "type": "Cyclone", "severity": 9, "damage_inr": 60000, "lat": 19.8135, "lng": 85.8312, "drilldown": { "description": "Extremely Severe Cyclonic Storm Fani made landfall near Puri, Odisha.", "stats": {"houses": "500,000+", "displaced": "1.5 Million", "infra": "Telecom Wipeout"}, "timeline": ["May 1: Formation", "May 3: Landfall at Puri", "May 5: Dissipation"] } },
            { "id": "ind-eq-2001", "year": 2001, "name": "Bhuj Earthquake", "type": "Earthquake", "severity": 10, "damage_inr": 21000, "lat": 23.2504, "lng": 69.6669, "drilldown": { "description": "Magnitude 7.7 earthquake in Gujarat, causing widespread destruction.", "stats": {"houses": "340,000+", "displaced": "600,000", "infra": "Complete Collapse"}, "timeline": ["08:46: Quake Strike", "09:00: Emergency declared", "Month: Reconstruction"] } },
            { "id": "ind-fld-2013", "year": 2013, "name": "Uttarakhand Floods", "type": "Flood", "severity": 10, "damage_inr": 15000, "lat": 30.7346, "lng": 79.0669 },
            { "id": "ind-cyc-1999", "year": 1999, "name": "Odisha Super Cyclone", "type": "Cyclone", "severity": 10, "damage_inr": 45000, "lat": 20.2505, "lng": 86.6669 },
            { "id": "ind-tsu-2004", "year": 2004, "name": "Indian Ocean Tsunami", "type": "Flood", "severity": 10, "damage_inr": 80000, "lat": 8.0883, "lng": 77.5385 }
        ],
        "stats": {"total": 143, "mostFrequent": "Flood", "maxDamageEvent": "Odisha Cyclone Fani"}
    },
    "Japan": {
        "temporal_intel": {"frequency": "10-15 years (Major)", "last_event": 2011, "next_window": "2025-2030"},
        "disasters": [
            { "id": "jpn-eq-2011", "year": 2011, "name": "Great East Japan Earthquake", "type": "Earthquake", "severity": 10, "damage_inr": 1800000, "lat": 38.322, "lng": 142.369, "drilldown": { "description": "Magnitude 9.1 megathrust earthquake followed by a massive tsunami.", "stats": {"houses": "400,000+", "displaced": "470,000", "infra": "Nuclear Meltdown"}, "timeline": ["14:46: Quake", "15:30: Tsunami impact", "16:00: Meltdown start"] } },
            { "id": "jpn-eq-1995", "year": 1995, "name": "Great Hanshin Earthquake", "type": "Earthquake", "severity": 9, "damage_inr": 1025000, "lat": 34.5822, "lng": 135.0305 },
            { "id": "jpn-fld-2018", "year": 2018, "name": "Western Japan Floods", "type": "Flood", "severity": 8, "damage_inr": 110000, "lat": 34.3963, "lng": 132.4594 },
            { "id": "jpn-eq-2024", "year": 2024, "name": "Noto Peninsula Earthquake", "type": "Earthquake", "severity": 8, "damage_inr": 85000, "lat": 37.3300, "lng": 137.0000 },
            { "id": "jpn-eq-1923", "year": 1923, "name": "Great Kanto Earthquake", "type": "Earthquake", "severity": 10, "damage_inr": 5000000, "lat": 35.1200, "lng": 139.1800 },
            { "id": "jpn-eq-2016", "year": 2016, "name": "Kumamoto Earthquakes", "type": "Earthquake", "severity": 8, "damage_inr": 400000, "lat": 32.8001, "lng": 130.7083 }
        ],
        "stats": {"total": 92, "mostFrequent": "Earthquake", "maxDamageEvent": "Tohoku Tsunami"}
    },
    "USA": {
        "temporal_intel": {"frequency": "Seasonal (Cyclones)", "last_event": 2022, "next_window": "2024-2025"},
        "disasters": [
            { "id": "usa-kat-2005", "year": 2005, "name": "Hurricane Katrina", "type": "Cyclone", "severity": 10, "damage_inr": 900000, "lat": 29.9511, "lng": -90.0715, "drilldown": { "description": "Category 5 hurricane caused massive destruction in New Orleans.", "stats": {"houses": "800,000+", "displaced": "1 Million", "infra": "Levee Breach"}, "timeline": ["Aug 28: Cat 5", "Aug 29: Landfall", "Sep 1: Rescue Peak"] } },
            { "id": "usa-snd-2012", "year": 2012, "name": "Hurricane Sandy", "type": "Cyclone", "severity": 9, "damage_inr": 650000, "lat": 39.46, "lng": -74.45 },
            { "id": "usa-eq-1906", "year": 1906, "name": "San Francisco Quake", "type": "Earthquake", "severity": 10, "damage_inr": 500000, "lat": 37.75, "lng": -122.50 },
            { "id": "usa-wnt-2021", "year": 2021, "name": "Texas Winter Storm", "type": "Drought", "severity": 8, "damage_inr": 190000, "lat": 31.9686, "lng": -99.9018 },
            { "id": "usa-fr-2023", "year": 2023, "name": "Maui Wildfires", "type": "Wildfire", "severity": 9, "damage_inr": 60000, "lat": 20.8893, "lng": -156.4729 },
            { "id": "usa-cyc-2017", "year": 2017, "name": "Hurricane Harvey", "type": "Cyclone", "severity": 10, "damage_inr": 1250000, "lat": 28.14, "lng": -96.99 }
        ],
        "stats": {"total": 284, "mostFrequent": "Cyclone", "maxDamageEvent": "Hurricane Katrina"}
    },
    "China": {
        "temporal_intel": {"frequency": "2-4 years", "last_event": 2023, "next_window": "2025-2027"},
        "disasters": [
            { "id": "chn-eq-2008", "year": 2008, "name": "Sichuan Earthquake", "type": "Earthquake", "severity": 10, "damage_inr": 650000, "lat": 31.000, "lng": 103.400, "drilldown": { "description": "Devastating magnitude 8.0 earthquake in Wenchuan.", "stats": {"houses": "15 Million", "displaced": "4.8 Million", "infra": "Total Failure"}, "timeline": ["May 12: Quake", "May 14: Rescue mobilization"] } },
            { "id": "chn-fld-1998", "year": 1998, "name": "Yangtze Floods", "type": "Flood", "severity": 10, "damage_inr": 300000, "lat": 29.500, "lng": 113.500 },
            { "id": "chn-eq-1976", "year": 1976, "name": "Tangshan Earthquake", "type": "Earthquake", "severity": 10, "damage_inr": 200000, "lat": 39.63, "lng": 118.18 },
            { "id": "chn-fld-2021", "year": 2021, "name": "Henan Floods", "type": "Flood", "severity": 9, "damage_inr": 120000, "lat": 34.76, "lng": 113.65 },
            { "id": "chn-eq-2023", "year": 2023, "name": "Gansu Earthquake", "type": "Earthquake", "severity": 7, "damage_inr": 15000, "lat": 35.70, "lng": 102.79 },
            { "id": "chn-fld-1931", "year": 1931, "name": "Yellow River Floods", "type": "Flood", "severity": 10, "damage_inr": 999999, "lat": 34.00, "lng": 114.00 }
        ],
        "stats": {"total": 210, "mostFrequent": "Earthquake", "maxDamageEvent": "Sichuan Quake"}
    },
    "Brazil": {
        "temporal_intel": {"frequency": "8-10 years", "last_event": 2022, "next_window": "2030-2032"},
        "disasters": [
            { "id": "bra-dr-2021", "year": 2021, "name": "Brazil Hydro Crisis", "type": "Drought", "severity": 10, "damage_inr": 15000, "lat": -23.55, "lng": -46.63, "drilldown": { "description": "Worst drought in 91 years led to a critical hydroelectric energy crisis.", "stats": {"houses": "Energy Rationing", "displaced": "Economic Impact", "infra": "Dam Depletion"}, "timeline": ["Jan: Low rain", "June: Hydro alert", "Sep: Peak crisis"] } },
            { "id": "bra-fld-2022", "year": 2022, "name": "Petropolis Floods", "type": "Flood", "severity": 8, "damage_inr": 8000, "lat": -22.51, "lng": -43.17 },
            { "id": "bra-fld-2011", "year": 2011, "name": "Rio Mount. Floods", "type": "Flood", "severity": 9, "damage_inr": 12000, "lat": -22.38, "lng": -42.87 },
            { "id": "bra-fld-2024", "year": 2024, "name": "Rio Grande do Sul Floods", "type": "Flood", "severity": 10, "damage_inr": 20000, "lat": -30.03, "lng": -51.22 },
            { "id": "bra-env-2015", "year": 2015, "name": "Mariana Dam Disaster", "type": "Flood", "severity": 9, "damage_inr": 18000, "lat": -20.23, "lng": -43.41 },
            { "id": "bra-dr-2010", "year": 2010, "name": "Amazon Drought", "type": "Drought", "severity": 8, "damage_inr": 5000, "lat": -3.10, "lng": -60.02 }
        ],
        "stats": {"total": 45, "mostFrequent": "Flood", "maxDamageEvent": "Petropolis"}
    },
    "Nigeria": {
        "temporal_intel": {"frequency": "5 years", "last_event": 2022, "next_window": "2027"},
        "disasters": [
            { "id": "nga-fld-2022", "year": 2022, "name": "2022 Great Floods", "type": "Flood", "severity": 10, "damage_inr": 12000, "lat": 9.08, "lng": 7.53, "drilldown": { "description": "Widespread flooding across 33 out of 36 states in Nigeria.", "stats": {"houses": "200,000+", "displaced": "1.4 Million", "infra": "Critical Road Failure"}, "timeline": ["July: Rains start", "Sep: Peak water", "Oct: Crisis mgmt"] } },
            { "id": "nga-fld-2012", "year": 2012, "name": "2012 Flood Crisis", "type": "Flood", "severity": 9, "damage_inr": 10000, "lat": 8.00, "lng": 6.50 },
            { "id": "nga-fld-2023", "year": 2023, "name": "Recurring Seasonal Floods", "type": "Flood", "severity": 7, "damage_inr": 5000, "lat": 7.00, "lng": 8.00 },
            { "id": "nga-fld-2018", "year": 2018, "name": "Severe Regional Floods", "type": "Flood", "severity": 8, "damage_inr": 8000, "lat": 6.50, "lng": 5.00 },
            { "id": "nga-fld-2010", "year": 2010, "name": "Major River Overflows", "type": "Flood", "severity": 8, "damage_inr": 7000, "lat": 10.0, "lng": 9.0 },
            { "id": "nga-fld-2019", "year": 2019, "name": "Flash Inundation Events", "type": "Flood", "severity": 7, "damage_inr": 4000, "lat": 5.50, "lng": 7.50 }
        ],
        "stats": {"total": 30, "mostFrequent": "Flood", "maxDamageEvent": "2022 Floods"}
    },
}

AI_REPORTS = [
    {
        "id": "rep-001", "title": "East Coast Cyclonic Accumulation", "severity": "High", "region": "Atlantic Coast",
        "description": "Satellite imagery indicates a rapid pressure drop in the Atlantic. Possible formation of Category 3 cyclone within 72 hours.",
        "analysis": "Expected intensity spike at 02:00 IST. High correlation with current surface water temperatures.",
        "insights": ["Thermal mass in Atlantic is 2.1C above baseline", "Current trajectory favors coastal landfall", "Evacuation protocols recommended"]
    },
    {
        "id": "rep-002", "title": "Sub-Saharan Drought Expansion", "severity": "Medium", "region": "North Africa",
        "description": "Long-term low-intensity drought spikes observed in agricultural belts. Crop failure risk exceeds 40%.",
        "analysis": "Temporal intelligence suggests a 15-year cycle peak. Last similar event: 2009.",
        "insights": ["Rainfall deficit at 65%", "Groundwater depletion accelerating", "Food security protocols engaged"]
    },
    {
        "id": "rep-003", "title": "Himalayan Tectonic Shift", "severity": "Critical", "region": "Nepal/North India",
        "description": "Minor seismic activity cluster detected in central Himalayas. Structural integrity check required for dam systems.",
        "analysis": "Stress accumulation at 88% of historical fracture points.",
        "insights": ["Seismic gap remains active", "Immediate infra-reinforcement needed", "Live monitoring active"]
    },
    {
        "id": "rep-004", "title": "South American Hydro Crisis", "severity": "High", "region": "Amazon Basin",
        "description": "Hydrological monitoring stations report record-low water levels in the Madeira River tributary.",
        "analysis": "Direct impact on hydroelectric output expected. Regional energy grid stress at 75%.",
        "insights": ["Rainfall shortfall at 45% annual mean", "Tugboat navigation halted", "Biodiversity stress indicators peak"]
    },
    {
        "id": "rep-005", "title": "Pacific Firefront Detection", "severity": "Medium", "region": "Eastern Australia",
        "description": "Infrared hotspots identified along the Dividing Range. High fuel load and low humidity observed.",
        "analysis": "V3 Sensor fusion predicts rapid expansion if wind speeds exceed 35km/h.",
        "insights": ["Fuel moisture content at 12%", "Ash plume trajectory monitoring active", "Protective burns ongoing"]
    },
    {
        "id": "rep-006", "title": "Arctic Permafrost Thaw", "severity": "Low", "region": "Siberian Plateau",
        "description": "Long-term radar interferometry shows subsurface deformation consistent with methane release.",
        "analysis": "Non-acute threat but significant for long-term climate modeling and infrastructure sink risk.",
        "insights": ["Ground subsidence at 2.5cm/year", "Carbon release sensors at +18% baseline", "Structual integrity of pipelines verified"]
    }
]

@app.route('/historical', methods=['GET'])
def historical():
    country = request.args.get('country', 'India')
    data = HISTORICAL_DATA.get(country, HISTORICAL_DATA["India"])
    return jsonify(data)

@app.route('/ai-reports', methods=['GET'])
def ai_reports():
    return jsonify(AI_REPORTS)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
