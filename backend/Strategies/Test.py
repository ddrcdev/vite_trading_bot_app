import json
import sys

def analyze_strategy(kline_data):
    # Lógica de análisis de estrategia
    return {'Test1': 2}

if __name__ == "__main__":
    # Leer los datos de kline desde el archivo temp.json
    with open(sys.argv[1], 'r') as file:
        data = json.load(file)
 
    kline_data = data
    # Ejecutar la estrategia de análisis
    result = analyze_strategy(kline_data)
    print(json.dumps(result))
