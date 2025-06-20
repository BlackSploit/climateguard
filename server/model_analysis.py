import time
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from lightgbm import LGBMClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import warnings
warnings.filterwarnings("ignore")

# Load dataset
dataset = pd.read_csv("processed_data.csv")
X = dataset[['state', 'fy_declared', 'incident_type']]
y = dataset['is_occured']

# Encoding
ct = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(sparse_output=False), [0, 2])],
    remainder='passthrough'
)
X = np.array(ct.fit_transform(X))

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Scale features
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# Models
models = {
    "SVM": SVC(kernel='rbf', probability=True, random_state=42),
    "RandomForest": RandomForestClassifier(random_state=42),
    "XGBoost": XGBClassifier(random_state=42),
    "LogisticRegression": LogisticRegression(random_state=42),
    "LightGBM": LGBMClassifier(random_state=42),
    "NeuralNetwork": MLPClassifier(random_state=42)
}

# Results storage
model_results = {}

# Training and evaluation
for name, model in models.items():
    start_time = time.time()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    end_time = time.time()

    model_results[name] = {
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred), 4),
        "recall": round(recall_score(y_test, y_pred), 4),
        "f1_score": round(f1_score(y_test, y_pred), 4),
        "execution_time": round(end_time - start_time, 2)
    }

    # Save model
    joblib.dump(model, f"{name}_model.pkl")

# Save metrics to text & JSON
with open("model_performance.txt", "w") as txt_file:
    for model, metrics in model_results.items():
        txt_file.write(f"Model: {model}\n")
        for metric, value in metrics.items():
            txt_file.write(f"  {metric}: {value}\n")
        txt_file.write("\n")

with open("model_performance.json", "w") as json_file:
    json.dump(model_results, json_file, indent=4)

# Convert to DataFrame
metrics_df = pd.DataFrame(model_results).T

# -------------------
# 📊 Bar Plot - Accuracy
plt.figure(figsize=(10, 6))
sns.barplot(x=metrics_df.index, y=metrics_df["accuracy"], palette="viridis")
plt.title("Model Accuracy Comparison")
plt.ylabel("Accuracy")
plt.xticks(rotation=30)
plt.tight_layout()
plt.savefig("model_accuracy_comparison.png")
plt.close()

# 🔥 Heatmap - Metric Correlation
plt.figure(figsize=(8, 6))
sns.heatmap(metrics_df.corr(), annot=True, cmap="coolwarm")
plt.title("Correlation Between Performance Metrics")
plt.tight_layout()
plt.savefig("metrics_correlation_heatmap.png")
plt.close()

# 📈 Line Plot - Metric Trends
plt.figure(figsize=(10, 6))
for metric in ['accuracy', 'precision', 'recall', 'f1_score']:
    plt.plot(metrics_df.index, metrics_df[metric], marker='o', label=metric)
plt.title("Performance Metric Trends Across Models")
plt.xlabel("Model")
plt.ylabel("Score")
plt.legend()
plt.grid(True)
plt.xticks(rotation=30)
plt.tight_layout()
plt.savefig("metrics_line_plot.png")
plt.close()

# 🕸 Radar/Spider Chart for Each Model
def make_spider(row, title, color):
    labels = list(metrics_df.columns[:-1])  # exclude execution_time
    stats = metrics_df.iloc[row, :-1].values

    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    stats = np.concatenate((stats, [stats[0]]))
    angles += [angles[0]]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.plot(angles, stats, color=color, linewidth=2)
    ax.fill(angles, stats, color=color, alpha=0.25)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    ax.set_title(title, size=14)
    plt.tight_layout()
    plt.savefig(f"radar_{title}.png")
    plt.close()

colors = ['b', 'g', 'r', 'c', 'm', 'y']
for i, model in enumerate(metrics_df.index):
    make_spider(i, model, colors[i % len(colors)])

# 🧩 Confusion Matrix Plots
def plot_conf_matrix(y_true, y_pred, model_name):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap="Blues",
                xticklabels=["Not Occurred", "Occurred"],
                yticklabels=["Not Occurred", "Occurred"])
    plt.title(f"Confusion Matrix - {model_name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(f"confusion_matrix_{model_name}.png")
    plt.close()

for name, model in models.items():
    y_pred = model.predict(X_test)
    plot_conf_matrix(y_test, y_pred, name)
