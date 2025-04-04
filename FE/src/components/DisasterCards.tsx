import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, Wind, Calendar } from "lucide-react";

interface Disaster {
  type: string;
  year: number;
  severity: string;
  impact: string;
}

interface DisasterData {
  location: {
    city: string;
    country: string;
  };
  disasters: Disaster[];
  trend_analysis?: string;
}

interface DisasterCardsProps {
  data: DisasterData;
}

export default function DisasterCards({ data }: DisasterCardsProps) {
  if (!data || !data.disasters || data.disasters.length === 0) {
    return <p className="text-center text-gray-500 text-lg">No disaster history available</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Disaster History - {data.location.city}, {data.location.country}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.disasters.map((disaster, index) => (
          <Card
            key={index}
            className="shadow-2xl rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-100 hover:scale-[1.02] transition-transform duration-300 ease-in-out overflow-hidden"
          >
            <CardHeader className="bg-white p-5 rounded-t-2xl border-b">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
                {disaster.type} ({disaster.year})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 border p-4 rounded-lg bg-white shadow-md">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <p className="text-sm font-medium text-gray-700">Year: {disaster.year}</p>
                </div>
                <div className="flex items-center gap-3 border p-4 rounded-lg bg-white shadow-md">
                  <Wind className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-gray-700">Severity: {disaster.severity}</p>
                </div>
                <p className="text-sm text-gray-600 italic bg-gray-100 p-4 rounded-lg shadow-inner border-l-4 border-gray-400">
                  {disaster.impact}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {data.trend_analysis && (
        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-blue-700">Trend Analysis</h3>
          <p className="text-gray-800 mt-3 leading-relaxed">{data.trend_analysis}</p>
        </div>
      )}
    </div>
  );
}
