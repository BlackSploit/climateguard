import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { Paper } from "@mui/material";
import "../App.css";

interface UserInputProps {
  view: string;
  setView: (view: string) => void;
  fetchData: (year: number) => void; // Changed from string to number
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ view, setView, fetchData, isLoading }) => {
  const [input, setInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(""); // Clear previous error
    setInput(event.target.value);
  };

  const handleView = (event: any) => {
    setView(event.target.value);
  };

  const handleBtn = () => {
    const yearNumber = parseInt(input, 10);

    if (isNaN(yearNumber) || yearNumber < new Date().getFullYear() || yearNumber > 2500) {
      setErrorMessage("Error: Not a valid year or out of bounds!");
      return;
    }

    setInput(""); // Clear input after successful validation
    fetchData(yearNumber); // Pass year as number
  };

  return (
      <div className="nav-left">
        <div className="year-input">
          <TextField
            size="small"
            label="Enter Year"
            value={input}
            error={!!errorMessage}
            onChange={handleUserInput}
            helperText={errorMessage || `Please enter a year between ${new Date().getFullYear()} and 2500`}
          />


<span className="mr-5"></span>

{/* <FormControl className="mui-input" size="small" >
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={view}
            onChange={handleView}
          >
            <MenuItem value="SVM">Support Vector Machine (Default)</MenuItem>
            <MenuItem value="XGBoost">XGBoost</MenuItem>
            <MenuItem value="RandomForest">Random Forest</MenuItem>
            <MenuItem value="LogisticRegression">Logistic Regression</MenuItem>
            <MenuItem value="LightGBM">LightGBM</MenuItem>
            <MenuItem value="NeuralNetwork">Neural Network</MenuItem>
          </Select>
        </FormControl> */}

<FormControl className="mui-input" size="small">
  <InputLabel id="model-select-label">Model</InputLabel>
  <Select
    labelId="model-select-label"
    id="model-select"
    value={view}
    onChange={handleView}
    label="Model"  // ✅ Add this line
  >
    <MenuItem value="SVM">Support Vector Machine (Default)</MenuItem>
    <MenuItem value="XGBoost">XGBoost</MenuItem>
    <MenuItem value="RandomForest">Random Forest</MenuItem>
    <MenuItem value="LogisticRegression">Logistic Regression</MenuItem>
    <MenuItem value="LightGBM">LightGBM</MenuItem>
    <MenuItem value="NeuralNetwork">Neural Network</MenuItem>
  </Select>
</FormControl>


        <span className="mr-5"></span>

          <Button disabled={isLoading} variant="contained" onClick={handleBtn}>
            Predict
          </Button>
        </div>
        
   
      </div>
  );
};

export default UserInput;
