import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { CurrentWeather } from "../components/CurrentWeather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";

import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";



import { useParams, useSearchParams } from "react-router-dom";

import DisasterCards from "../components/DisasterCards";
import { setDoc, doc } from "firebase/firestore";
import { chatSession } from "../service/AIModal";


import { db } from "../service/firebaseConfig";


import { useState } from "react"; 








const AI_PROMPT = `
Analyze and summarize **historical disaster patterns** in the following location over the past **50 years**, based on known meteorological risks and global disaster trends.

### **Location Details:**
- **City:** {weatherQuery.data.name}
- **Country:** {weatherQuery.data.sys.country}

### **Expected Disaster Data:**
For each recorded disaster, include:
- **Disaster Type** (Cyclone, Flood, Earthquake, Landslide, Tsunami, Drought, etc.)
- **Year** of occurrence (if available)
- **Severity Level** (Mild, Moderate, Severe, Extreme)
- **Impact Summary** (Casualties, property damage, evacuations)

### **Trend Analysis:**
- Based on known disaster patterns in {weatherQuery.data.sys.country}, what are the most common disasters affecting this region?
- Are there any increasing or decreasing trends in disaster frequency and severity over time?
- How might climate change influence future disaster risks in this area?

### **Expected JSON Output:**
\`\`\`json
{
  "name": "analyze_disaster_history",
  "description": "Summarizes disaster trends for the specified location.",
  "parameters": {
    "location": {
      "city": "Azhikkal",
      "country": "IN"
    },
    "disasters": [
      {
        "type": "Cyclone",
        "year": 2018,
        "severity": "Severe",
        "impact": "Flooding, infrastructure damage, and displacement of thousands."
      },
      {
        "type": "Flood",
        "year": 2020,
        "severity": "Moderate",
        "impact": "Road blockages, evacuations, and agricultural damage."
      }
    ],
    "trend_analysis": "The region has experienced an increase in cyclone frequency over the last decade, correlating with rising sea temperatures and climate change effects."
  }
}
\`\`\`

### **Guidelines:**
- If **exact data is unavailable**, generate insights based on regional disaster trends.
- Focus on **historical patterns** rather than generic disclaimers.
- Avoid suggesting future predictions—stick to past and current trends.

`;





export function WeatherDashboard() {






  const saveDisasterPrediction = async (predictionData: any) => {
    const docId = Date.now().toString();
  
    try {
      await setDoc(doc(db, "Disaster_Predictions", docId), {
        weatherData: weatherQuery.data, // Saving weather data used for prediction
        predictionResults:
          typeof predictionData === "string"
            ? JSON.parse(predictionData)
            : predictionData,
        id: docId,
        timestamp: new Date().toISOString(),
      });
  
<a href={`/disasterVisual/${docId}`}>View Disaster Prediction</a>
    } catch (error) {
      console.error("Error saving prediction:", error);
    }
  };
  




  const [searchParams] = useSearchParams();


  const [disasterData, setDisasterData] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);



  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");




  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  // Function to refresh all data
  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Geolocation Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Geolocation
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Access Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>To retrieve real-time weather data, please enable location access.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Grant Access
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Data Retrieval Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Unable to fetch weather data. Please retry.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Fetch
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }







  const onGenerateDisasterReport = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Replace placeholders in AI_PROMPT with actual weather data
      const FINAL_PROMPT = AI_PROMPT
        .replace("{weatherQuery.data.coord.lat}", weatherQuery.data.coord.lat.toString())
        .replace("{weatherQuery.data.coord.lon}", weatherQuery.data.coord.lon.toString())
        .replace("{weatherQuery.data.name}", weatherQuery.data.name)
        .replace("{weatherQuery.data.sys.country}", weatherQuery.data.sys.country)
        .replace("{weatherQuery.data.weather[0].main}", weatherQuery.data.weather[0].main)
        .replace("{weatherQuery.data.weather[0].description}", weatherQuery.data.weather[0].description)
        .replace("{weatherQuery.data.main.temp}", weatherQuery.data.main.temp.toString())
        .replace("{weatherQuery.data.main.feels_like}", weatherQuery.data.main.feels_like.toString())
        .replace("{weatherQuery.data.wind.speed}", weatherQuery.data.wind.speed.toString())
        .replace("{weatherQuery.data.wind.deg}", weatherQuery.data.wind.deg.toString())
        .replace("{weatherQuery.data.main.humidity}", weatherQuery.data.main.humidity.toString())
        .replace("{weatherQuery.data.clouds.all}", weatherQuery.data.clouds.all.toString());
  
      console.log("Final prompt:", FINAL_PROMPT);
  
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result?.response?.text();
      console.log("AI Response:", responseText);
  
      if (!responseText) throw new Error("Empty AI response.");
  
      // Parse and validate the AI response
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse AI response:", err);
        throw new Error("Invalid AI response format.");
      }
  
      // Validate the structure of the parsed data
      if (
        !parsedData ||
        !parsedData.parameters ||
        !parsedData.parameters.location ||
        !parsedData.parameters.disasters ||
        !Array.isArray(parsedData.parameters.disasters)
      ) {
        throw new Error("Invalid or missing disaster data.");
      }
  
      setDisasterData(parsedData.parameters); // ✅ Store validated response
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate disaster report.");
      setDisasterData(null); // Reset state on error
    } finally {
      setLoading(false);
    }
  };
  




















  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Current Location</h1>
      
      </div>




      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>



        
      <button
  onClick={onGenerateDisasterReport}
  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
  disabled={loading}
>
  {loading ? "Analyzing Historic Data..." : "Generate Historic Disaster Report"}
</button>




{/* <DisasterCards data={parsedData} /> */}
{disasterData && <DisasterCards data={disasterData} />}






      
      </div>
    </div>
  );
}
