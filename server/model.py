

import numpy as np
import pandas as pd
import os
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
from lightgbm import LGBMClassifier
from sklearn.neural_network import MLPClassifier
import json

# Define the states list
states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

# Function to process data and save to CSV
def process_data_and_save_to_csv(input_file, output_file):
    data = pd.read_csv(input_file)
    data = data[data['state'].isin(states)]
    data = data.drop_duplicates(subset=['state', 'fy_declared', 'incident_type'])
    dataset = pd.DataFrame(data)
    common_incidents = dataset['incident_type'].value_counts().nlargest(5).index.tolist()
    state_year_incidents = {}
    for index, row in dataset.iterrows():
        state = row['state']
        year = row['fy_declared']
        incident_type = row['incident_type']
        if incident_type in common_incidents:
            if (state, year) not in state_year_incidents:
                state_year_incidents[(state, year)] = {incident: 0 for incident in common_incidents}
            state_year_incidents[(state, year)][incident_type] = 1
    new_data = []
    for (state, year), incidents in state_year_incidents.items():
        for incident, is_occured in incidents.items():
            new_data.append([state, year, incident, is_occured])
    dataset = pd.DataFrame(new_data, columns=['state', 'fy_declared', 'incident_type', 'is_occured'])
    dataset.to_csv(output_file, index=False)

input_file = 'us_disaster_declarations.csv'
output_file = 'processed_data.csv'
if not os.path.exists(output_file):
    process_data_and_save_to_csv(input_file, output_file)

dataset = pd.read_csv(output_file)
common_incidents = dataset['incident_type'].unique()

X = dataset[['state', 'fy_declared', 'incident_type']]
y = dataset['is_occured']

ct = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(sparse_output=False), [0, 2])],
    remainder='passthrough'
)
X = np.array(ct.fit_transform(X))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

def get_model(model_name):
    if model_name == "SVM":
        return SVC(kernel='rbf', random_state=42, probability=True)
    elif model_name == "XGBoost":
        return XGBClassifier(random_state=42)
    elif model_name == "RandomForest":
        return RandomForestClassifier(random_state=42)
    elif model_name == "LogisticRegression":
        return LogisticRegression(random_state=42)
    elif model_name == "LightGBM":
        return LGBMClassifier(random_state=42)
    elif model_name == "NeuralNetwork":
        return MLPClassifier(random_state=42)
    else:
        raise ValueError("Invalid model name")

def predict_by_year(input_year, model_name):
    state_names = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
        'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts',
        'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana',
        'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
        'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
        'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
        'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    }

    model = get_model(model_name)
    model.fit(X_train, y_train)

    predictions = []
    for state in states:
        state_predictions = {}
        state_predictions["state"] = state
        state_predictions["state_full"] = state_names[state]
        state_predictions["predictions"] = {}
        avg_pred_total = 0
        for incident in common_incidents:
            new_input = pd.DataFrame({'state': [state], 'fy_declared': [input_year], 'incident_type': [incident]})
            X_new = np.array(ct.transform(new_input))
            X_new_scaled = sc.transform(X_new)
            probabilities = model.predict_proba(X_new_scaled)
            prediction_value = float(round(probabilities[0][1] * 100, 2)) 
            probability_occurrence = prediction_value
            avg_pred_total += prediction_value
            state_predictions["predictions"][incident] = probability_occurrence
        state_predictions["predictions"]["Avg"] = float(round(avg_pred_total / len(common_incidents), 2)) 
        predictions.append(state_predictions)

    output_json = json.dumps(predictions, indent=2)
    return output_json


    