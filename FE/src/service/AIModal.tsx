// AIzaSyCeITMZ29vgcom4XgviD1sZHWlzu_YshjY





// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = 'AIzaSyCeITMZ29vgcom4XgviD1sZHWlzu_YshjY';
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// export  const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [
//           {text: "Analyze the following **weather conditions** and provide a risk assessment along with practical recommendations.\n\n### **Weather Data:**\n- **Temperature:** {weatherQuery.data.main.temp}°C (Feels like {weatherQuery.data.main.feels_like}°C)\n- **Humidity:** {weatherQuery.data.main.humidity}%\n- **Wind Speed:** {weatherQuery.data.wind.speed} m/s, Gusts up to {weatherQuery.data.wind.gust} m/s\n- **Cloud Cover:** {weatherQuery.data.clouds.all}%\n- **Pressure:** {weatherQuery.data.main.pressure} hPa\n- **Visibility:** {weatherQuery.data.visibility} meters\n\n### **Expected Output:**\n- Identify any **weather-related risks** (e.g., discomfort due to high humidity, low visibility concerns, potential storm risks, etc.).\n- Provide **concise and practical recommendations** based on the conditions.\n\n### **Expected JSON Output Format:**\n\\`\\`\\`json\n{\n  \"name\": \"weather_risk_analysis\",\n  \"description\": \"Analyzes weather conditions and provides risk assessment with recommendations.\",\n  \"parameters\": {\n    \"weather_data\": {\n      \"temperature\": 26.95,\n      \"feels_like\": 29.72,\n      \"humidity\": 81,\n      \"wind_speed\": 1.3,\n      \"wind_gust\": 1.6,\n      \"cloud_cover\": 87,\n      \"pressure\": 1012,\n      \"visibility\": 10000\n    },\n    \"risk_assessment\": {\n      \"potential_risks\": [\n        \"High humidity may cause discomfort.\",\n        \"Cloudy conditions may indicate possible light rain.\",\n        \"Low wind speed suggests stagnant air, which may feel warmer than the actual temperature.\"\n      ],\n      \"recommendations\": [\n        \"Stay hydrated to manage heat discomfort.\",\n        \"Carry an umbrella in case of unexpected rain.\",\n        \"Wear breathable clothing for better comfort.\"\n      ]\n    }\n  }\n}\n\\`\\`\\`\n\n### **Guidelines for AI Response:**\n- **Do not include location information**—analyze based **only on provided weather data**.  \n- Ensure recommendations are **relevant and practical** for general users.  \n- If **no significant weather risks exist**, return:  \n  \\`\\`\\`json\n  \"potential_risks\": [],\n  \"recommendations\": [\"No major weather concerns detected.\"]\n  \\`\\`\\`\n\n"},
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {text: "{\n  \"name\": \"weather_risk_analysis\",\n  \"description\": \"Analyzes weather conditions and provides risk assessment with recommendations.\",\n  \"parameters\": {\n    \"weather_data\": {\n      \"temperature\": 26.95,\n      \"feels_like\": 29.72,\n      \"humidity\": 81,\n      \"wind_speed\": 1.3,\n      \"wind_gust\": 1.6,\n      \"cloud_cover\": 87,\n      \"pressure\": 1012,\n      \"visibility\": 10000\n    },\n    \"risk_assessment\": {\n      \"potential_risks\": [\n        \"High humidity may cause discomfort.\",\n        \"Cloudy conditions may indicate possible light rain.\",\n        \"Low wind speed suggests stagnant air, which may feel warmer than the actual temperature.\"\n      ],\n      \"recommendations\": [\n        \"Stay hydrated to manage heat discomfort.\",\n        \"Carry an umbrella in case of unexpected rain.\",\n        \"Wear breathable clothing for better comfort.\"\n      ]\n    }\n  }\n}"},
//         ],
//       },
//     ],
//   });



import { GoogleGenerativeAI } from "@google/generative-ai";


  const apiKey = 'AIzaSyCeITMZ29vgcom4XgviD1sZHWlzu_YshjY';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });
  
  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

 export  const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Analyze the following **weather conditions** and provide a risk assessment along with practical recommendations.\n\n### **Weather Data:**\n- **Temperature:** {weatherQuery.data.main.temp}°C (Feels like {weatherQuery.data.main.feels_like}°C)\n- **Humidity:** {weatherQuery.data.main.humidity}%\n- **Wind Speed:** {weatherQuery.data.wind.speed} m/s, Gusts up to {weatherQuery.data.wind.gust} m/s\n- **Cloud Cover:** {weatherQuery.data.clouds.all}%\n- **Pressure:** {weatherQuery.data.main.pressure} hPa\n- **Visibility:** {weatherQuery.data.visibility} meters\n\n### **Expected Output:**\n- Identify any **weather-related risks** (e.g., discomfort due to high humidity, low visibility concerns, potential storm risks, etc.).\n- Provide **concise and practical recommendations** based on the conditions.\n\n### **Expected JSON Output Format:**\n\\`\\`\\`json\n{\n  \"name\": \"weather_risk_analysis\",\n  \"description\": \"Analyzes weather conditions and provides risk assessment with recommendations.\",\n  \"parameters\": {\n    \"weather_data\": {\n      \"temperature\": 26.95,\n      \"feels_like\": 29.72,\n      \"humidity\": 81,\n      \"wind_speed\": 1.3,\n      \"wind_gust\": 1.6,\n      \"cloud_cover\": 87,\n      \"pressure\": 1012,\n      \"visibility\": 10000\n    },\n    \"risk_assessment\": {\n      \"potential_risks\": [\n        \"High humidity may cause discomfort.\",\n        \"Cloudy conditions may indicate possible light rain.\",\n        \"Low wind speed suggests stagnant air, which may feel warmer than the actual temperature.\"\n      ],\n      \"recommendations\": [\n        \"Stay hydrated to manage heat discomfort.\",\n        \"Carry an umbrella in case of unexpected rain.\",\n        \"Wear breathable clothing for better comfort.\"\n      ]\n    }\n  }\n}\n\\`\\`\\`\n\n### **Guidelines for AI Response:**\n- **Do not include location information**—analyze based **only on provided weather data**.  \n- Ensure recommendations are **relevant and practical** for general users.  \n- If **no significant weather risks exist**, return:  \n  \\`\\`\\`json\n  \"potential_risks\": [],\n  \"recommendations\": [\"No major weather concerns detected.\"]\n  \\`\\`\\`\n\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\n  \"name\": \"weather_risk_analysis\",\n  \"description\": \"Analyzes weather conditions and provides risk assessment with recommendations.\",\n  \"parameters\": {\n    \"weather_data\": {\n      \"temperature\": 26.95,\n      \"feels_like\": 29.72,\n      \"humidity\": 81,\n      \"wind_speed\": 1.3,\n      \"wind_gust\": 1.6,\n      \"cloud_cover\": 87,\n      \"pressure\": 1012,\n      \"visibility\": 10000\n    },\n    \"risk_assessment\": {\n      \"potential_risks\": [\n        \"High humidity may cause discomfort.\",\n        \"Cloudy conditions may indicate possible light rain.\",\n        \"Low wind speed suggests stagnant air, which may feel warmer than the actual temperature.\"\n      ],\n      \"recommendations\": [\n        \"Stay hydrated to manage heat discomfort.\",\n        \"Carry an umbrella in case of unexpected rain.\",\n        \"Wear breathable clothing for better comfort.\"\n      ]\n    }\n  }\n}"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Analyze and summarize **historical disaster patterns** in the following location over the past **50 years**, based on known meteorological risks and global disaster trends.\n\n### **Location Details:**\n- **City:** {weatherQuery.data.name}\n- **Country:** {weatherQuery.data.sys.country}\n\n### **Expected Disaster Data:**\nFor each recorded disaster, include:\n- **Disaster Type** (Cyclone, Flood, Earthquake, Landslide, Tsunami, Drought, etc.)\n- **Year** of occurrence (if available)\n- **Severity Level** (Mild, Moderate, Severe, Extreme)\n- **Impact Summary** (Casualties, property damage, evacuations)\n\n### **Trend Analysis:**\n- Based on known disaster patterns in {weatherQuery.data.sys.country}, what are the most common disasters affecting this region?\n- Are there any increasing or decreasing trends in disaster frequency and severity over time?\n- How might climate change influence future disaster risks in this area?\n\n### **Expected JSON Output:**\n\\`\\`\\`json\n{\n  \"name\": \"analyze_disaster_history\",\n  \"description\": \"Summarizes disaster trends for the specified location.\",\n  \"parameters\": {\n    \"location\": {\n      \"city\": \"Azhikkal\",\n      \"country\": \"IN\"\n    },\n    \"disasters\": [\n      {\n        \"type\": \"Cyclone\",\n        \"year\": 2018,\n        \"severity\": \"Severe\",\n        \"impact\": \"Flooding, infrastructure damage, and displacement of thousands.\"\n      },\n      {\n        \"type\": \"Flood\",\n        \"year\": 2020,\n        \"severity\": \"Moderate\",\n        \"impact\": \"Road blockages, evacuations, and agricultural damage.\"\n      }\n    ],\n    \"trend_analysis\": \"The region has experienced an increase in cyclone frequency over the last decade, correlating with rising sea temperatures and climate change effects.\"\n  }\n}\n\\`\\`\\`\n\n### **Guidelines:**\n- If **exact data is unavailable**, generate insights based on regional disaster trends.\n- Focus on **historical patterns** rather than generic disclaimers.\n- Avoid suggesting future predictions—stick to past and current trends.\n\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\n  \"name\": \"analyze_disaster_history\",\n  \"description\": \"Summarizes disaster trends for the specified location.\",\n  \"parameters\": {\n    \"location\": {\n      \"city\": \"Azhikkal\",\n      \"country\": \"IN\"\n    },\n    \"disasters\": [\n      {\n        \"type\": \"Flood\",\n        \"year\": 2018,\n        \"severity\": \"Severe\",\n        \"impact\": \"Widespread flooding, landslides, and significant displacement.\"\n      },\n      {\n        \"type\": \"Cyclone\",\n        \"year\": 2019,\n        \"severity\": \"Moderate\",\n        \"impact\": \"Coastal erosion, infrastructure damage, and disruption of essential services.\"\n      },\n       {\n        \"type\": \"Flood\",\n        \"year\": 2020,\n        \"severity\": \"Moderate\",\n        \"impact\": \"Localized flooding, agricultural losses, and temporary displacement.\"\n      }\n    ],\n    \"trend_analysis\": \"India, particularly the coastal regions, is vulnerable to cyclones and floods, often exacerbated by monsoon seasons. While the severity and frequency of these events can vary annually, a potential trend of increased intensity due to climate change factors warrants attention.  The provided disaster data, while not exhaustive, highlights the recurring nature of flood and cyclone events in the region.\"\n  }\n}"},
          ],
        },
      ],
    });
  
  