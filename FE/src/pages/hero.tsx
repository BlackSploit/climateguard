import { Button } from "./Button";
import { Link } from "react-router-dom";
import ChefSignature from "./earth.mp4";
export const Hero: React.FC = () => {
  return (
    <>
      <div className="relative flex flex-col min-h-screen text-white">
        {/* Main Content */}
        <div className="relative flex flex-1 flex-col items-center justify-center">
          {/* Background video */}
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={ChefSignature} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay for darkening background */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="font-semibold text-5xl lg:text-6xl">ClimateGuard</h1>
            <p className="text-lg lg:text-xl mt-2">
              AI-Driven Climate Insights & Disaster Predictions
            </p>
            <div className="flex mt-8 gap-4">
              <Link to={'/predict'}>
                <Button
                  className="bg-[#f7f7f840] text-white py-2 px-6 rounded-full hover:bg-slate-900 transition duration-300"
                >
                  Predict Disaster →
                </Button>
              </Link>
              <Link to={'/weather'}>
                <Button
                  className="bg-[#f7f7f840] text-white py-2 px-6 rounded-full hover:bg-slate-900 transition duration-300"
                >
                  Analyze Insights →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Hero;