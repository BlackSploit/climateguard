import { useState } from "react";
import "./App.css";
import axios from "axios";
import UserInput from "./components/UserInput";
import CircularProgress from "@mui/material/CircularProgress";
import StateTable from "./components/StateTable";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Paper, Typography, Box, Container, useTheme } from "@mui/material";
import { keyframes } from "@emotion/react";

interface DisasterData {
  state: string;
  probability: number;
  disasterType: string;
}

// Animation for hover effect
const hoverAnimation = keyframes`
  0% {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  }
  100% {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const ML: React.FC = () => {
  const URL = "http://127.0.0.1:5000/";
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [view, setView] = useState<string>("SVM");
  const [data, setData] = useState<DisasterData[] | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();

  const fetchData = async (inputYear: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get<DisasterData[]>(
        `${URL}predict_disasters?year=${inputYear}&view=${view}`
      );
      setIsLoading(false);
      setYear(inputYear);
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        background: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
          }}
        >
          Climate Disaster Prediction Model
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          Dataset Utilized:{" "}
          <Box
            component="span"
            sx={{ color: theme.palette.warning.main, fontWeight: "bold" }}
          >
            United States - NOAA Records
          </Box>
        </Typography>
      </Box>

      {/* User Input Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <UserInput
          view={view}
          setView={setView}
          setYear={setYear}
          fetchData={fetchData}
          isLoading={isLoading}
        />
      </Box>




  {/* Loading State */}
  {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress
            size={60}
            sx={{ color: theme.palette.warning.main }}
          />
          <Typography
            variant="h6"
            sx={{ mt: 2, color: theme.palette.text.secondary }}
          >
            Processing Model Inference...
          </Typography>
        </Box>
      )}
      {/* Data Display Section */}
      {data ? (
        <StateTable data={data} />
      ) : (
        <Alert
          severity="info"
          sx={{
            mt: 4,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          <AlertTitle>Model Input Required</AlertTitle>
          Please specify a target year to generate disaster risk predictions and
          visualizations.
        </Alert>
      )}

    

      {/* Technical Overview Section */}
      <Paper
        sx={{
          p: 4,
          mt: 6,
          borderRadius: 4,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 4,
            color: theme.palette.text.primary,
          }}
        >
          Disaster Prediction Model: Technical Overview
        </Typography>

        {[
          {
            title: "Feature Engineering & Data Processing",
            content:
              "Preprocessing includes One-Hot Encoding for categorical variables and MinMax Scaling for numerical features. Top 5 disaster types are selected based on frequency distribution to ensure class balance. Temporal trends and spatial correlations are extracted for enhanced prediction accuracy.",
          },
          {
            title: "XGBoost Model Optimization",
            content:
              "XGBoost is chosen for its handling of structured data and imbalanced classes. Hyperparameter tuning via Grid Search (5-fold CV) optimizes depth, learning rate, and regularization parameters, minimizing log-loss while improving generalization.",
          },
          {
            title: "Random Forest for Robust Decision Trees",
            content:
              "Random Forest is evaluated for its ensemble learning capability, reducing overfitting through bootstrapped aggregation. Multiple trees are trained to capture non-linear relationships in disaster patterns.",
          },
          {
            title: "Logistic Regression for Baseline Comparison",
            content:
              "Logistic Regression serves as a baseline model for disaster prediction, offering interpretability and efficiency. Feature selection ensures multicollinearity reduction and model stability.",
          },
          {
            title: "Support Vector Machine (SVM) for High-Dimensional Patterns",
            content:
              "SVM is tested for its ability to handle complex feature spaces and disaster classification. Kernel tuning improves its ability to separate overlapping disaster categories.",
          },
          {
            title: "LightGBM for Fast and Efficient Gradient Boosting",
            content:
              "LightGBM is explored for its speed and efficiency in handling large-scale disaster datasets. Leaf-wise growth strategy enhances predictive performance while reducing computation time.",
          },
          {
            title: "Neural Network (MLP) for Deep Learning Insights",
            content:
              "A Multi-Layer Perceptron (MLP) is implemented to leverage deep learning for disaster prediction. Hidden layers capture intricate spatial and temporal dependencies in disaster occurrences.",
          },
          {
            title: "Performance Benchmarking",
            content:
              "Each model is evaluated using standard classification metrics:\n- Accuracy\n- Precision\n- Recall\n- F1-Score\nAUC-ROC analysis ensures strong discrimination capability, while the precision-recall tradeoff is fine-tuned to minimize false negatives in critical disaster scenarios. Benchmarking results guide the final model selection.",
          },
          {
            title: "Predictive Analytics & Deployment",
            content:
              "Probabilistic forecasts are generated for each US state, leveraging historical trends and real-time features. The output is structured as JSON mappings for disaster likelihood. Model deployment is optimized for API inference with minimal latency.",
          },
        ].map((section, index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[2],
              transition: "all 0.3s ease",
              "&:hover": {
                animation: `${hoverAnimation} 0.3s forwards`,
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
            >
              {section.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
            >
              {section.content}
            </Typography>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};