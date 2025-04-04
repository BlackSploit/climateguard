import { Link } from "react-router-dom";
import { CitySearch } from "./CitySearch";
import { useTheme } from "@/context/theme-provider";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img
            src={theme === "dark" ? "/logo.png" : "/logo2.png"}
            alt="Klimate logo"
            className="h-14"
          />
        </Link>

        <div className="flex gap-4">

          <a href="/predict">
  <div
  
  className="cursor-pointer rounded-full bg-white text-gray-600 hover:bg-green-50 hover:text-gray-500 border-2 border-transparent hover:border-black/30 transition-all duration-300 text-xs md:text-sm py-2 md:py-3 px-4 md:px-6 font-bold shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
>
Predict Disaster →
</div>

  </a>


  <a href="/weather">
  <div
  
  className="cursor-pointer rounded-full bg-white text-gray-600 hover:bg-green-50 hover:text-gray-500 border-2 border-transparent hover:border-black/30 transition-all duration-300 text-xs md:text-sm py-2 md:py-3 px-4 md:px-6 font-bold shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
>
Analyze Insights →
</div>

  </a>


  <CitySearch />




        </div>
      </div>
    </header>
  );
}
