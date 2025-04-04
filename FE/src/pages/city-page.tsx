import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { CurrentWeather } from "../components/CurrentWeather";
import { HourlyTemperature } from "../components/hourly-temprature";


import DisasterCards from "../components/DisasterCards";

import WeatherSkeleton from "../components/loading-skeleton";

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















export function CityPage() {







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

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }






let responseText :any='';

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














  console.log("weather Query")
console.log(weatherQuery.data)

console.log("forecastQuery")
console.log(forecastQuery.data)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />









        {/* <button
  onClick={onGenerateDisasterReport}
  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
>
  Generate Disaster Report
</button> */}
<HourlyTemperature data={forecastQuery.data} />


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
