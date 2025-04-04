import time
import json
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from lightgbm import LGBMClassifier
from sklearn.neural_network import MLPClassifier
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# Load processed dataset
dataset = pd.read_csv("processed_data.csv")
X = dataset[['state', 'fy_declared', 'incident_type']]
y = dataset['is_occured']

# Encoding categorical data
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ct = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(sparse_output=False), [0, 2])],
    remainder='passthrough'
)
X = np.array(ct.fit_transform(X))

# Splitting the dataset into training and test sets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Feature scaling
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# Models to evaluate
models = {
    "SVM": SVC(kernel='rbf', probability=True, random_state=42),
    "RandomForest": RandomForestClassifier(random_state=42),
    "XGBoost": XGBClassifier(random_state=42),
    "LogisticRegression": LogisticRegression(random_state=42),
    "LightGBM": LGBMClassifier(random_state=42),
    "NeuralNetwork": MLPClassifier(random_state=42)
}

# Store results
model_results = {}

# Train and evaluate each model
for name, model in models.items():
    start_time = time.time()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    end_time = time.time()
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    execution_time = round(end_time - start_time, 2)
    
    model_results[name] = {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "execution_time": execution_time
    }
    
    # Save trained models
    joblib.dump(model, f"{name}_model.pkl")

# Save results as a text file
with open("model_performance.txt", "w") as txt_file:
    for model, metrics in model_results.items():
        txt_file.write(f"Model: {model}\n")
        for metric, value in metrics.items():
            txt_file.write(f"  {metric}: {value}\n")
        txt_file.write("\n")

# Save results as JSON
with open("model_performance.json", "w") as json_file:
    json.dump(model_results, json_file, indent=4)

# Generate visualization
plt.figure(figsize=(10, 6))
df_results = pd.DataFrame(model_results).T
sns.barplot(x=df_results.index, y=df_results["accuracy"], palette="viridis")
plt.title("Model Accuracy Comparison")
plt.ylabel("Accuracy")
plt.xticks(rotation=30)
plt.savefig("model_accuracy_comparison.png")
