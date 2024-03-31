import time
from binance.client import Client
import numpy as np
import pandas as pd
import plotly.graph_objects as go



initial_balance = 100
op_size_ud = 10
stop_loss_per = 0.03


# Función para calcular el indicador MACD
def calculate_macd(data, fast_period=12, slow_period=26, signal_period=9):
    # Calcular el precio de cierre
    close_prices = data["close"]
    
    # Calcular el promedio exponencial de 12 y 26 períodos
    ema_fast = close_prices.ewm(span=fast_period, adjust=False).mean()
    ema_slow = close_prices.ewm(span=slow_period, adjust=False).mean()
    
    # Calcular el MACD
    macd = ema_fast - ema_slow
    
    # Calcular la señal
    signal = macd.ewm(span=signal_period, adjust=False).mean()
    
    return macd, signal


# Función para realizar operaciones de trading
def trading_strategy(data,macd, signal):
    actions = pd.DataFrame(columns=["action","time","close"])
    for i in range(1,len(macd)):
        if macd[i] > signal[i] and macd[i-1] < signal[i-1]:
            #Primera orden
            if len(actions)==0:
                actions.loc[i,:] = ['buy',data.loc[i,"time"],data.loc[i,"close"]]
            #Sin operación abierta
            elif actions.loc[actions.index[-1],"action"] != "buy":
                actions.loc[i,:] = ['buy',data.loc[i,"time"],data.loc[i,"close"]]
        elif macd[i] < signal[i] and macd[i-1] > signal[i-1]:
            #Orden de compra activa
            if len(actions)>0 and actions.loc[actions.index[-1],"action"] != "sell":
                #entry = actions.index.get_loc(i)
                # Venta Profit
                if float(data.loc[i,"close"])-float(actions.loc[actions.index[-1],"close"])>0:
                    actions.loc[i,:] = ['sell',data.loc[i,"time"],data.loc[i,"close"]]
                #Venta Stop-Loss
                elif (float(data.loc[i,"close"])-float(actions.loc[actions.index[-1],"close"]))/float(actions.loc[actions.index[-1],"close"]) <= -stop_loss_per:
                    actions.loc[i,:] = ['sell',data.loc[i,"time"],data.loc[i,"close"]]
    return actions

def strategy_metrics(actions,symbol):
    metrics = pd.DataFrame(columns=["Time Open","Time Close","Open Price","Close Price","Time Lapsed (min)","Av.Price","Av.Percentaje (%)","Total Percentaje","Balance"])
    final_metrics = pd.DataFrame(columns=["Market","Total ops","Mean Time Lapsed","Null ops","Total Av.Price","Total Av.Percentaje","Winner Ops","Mean Profit (%)","Max Win (%)","Loser Ops", "Mean Loss (%)","Max Loss (%)","Final Balance"])
    final_metrics.loc[0,'Market'] = symbol
    
    j=0
    for i in actions.index:
        if actions.loc[i,'action'] == 'buy':
            entry = actions.index.get_loc(i)
            if entry + 1 >= actions.index.size:
                break
            else:
                out = actions.index[entry + 1]

            # Convertir cadenas a timestamp
            inicio_ts = time.mktime(time.strptime(actions.loc[i,'time'], '%Y-%m-%d %H:%M:%S'))
            fin_ts = time.mktime(time.strptime(actions.loc[out,'time'], '%Y-%m-%d %H:%M:%S'))

            metrics.loc[j,["Time Open","Time Close","Open Price","Close Price"]] = [actions.loc[i,'time'],actions.loc[out,'time'],float(actions.loc[i,'close']),float(actions.loc[out,'close'])]
            
            metrics.loc[j,"Time Lapsed (min)"] = (fin_ts - inicio_ts)/(60)

            metrics.loc[j,"Av.Price"] = metrics.loc[j,"Close Price"]-metrics.loc[j,"Open Price"]
            metrics.loc[j,"Av.Percentaje (%)"] = (metrics.loc[j,"Close Price"]-metrics.loc[j,"Open Price"])*100/metrics.loc[j,"Open Price"]
            
            j += 1
    
    metrics.loc[:,"Total Percentaje"] = metrics["Av.Percentaje (%)"].cumsum()
    metrics.loc[:,"Balance"] = initial_balance + (op_size_ud * metrics["Total Percentaje"] / 100)
    
    final_metrics.loc[0,"Total ops"] = len(metrics["Av.Price"])
    final_metrics.loc[0,"Null ops"] = len(metrics[metrics["Av.Percentaje (%)"] == 0])*100/len(metrics["Av.Price"])
    final_metrics.loc[0,"Mean Time Lapsed"] = metrics["Time Lapsed (min)"].mean()
    final_metrics.loc[0,"Total Av.Price"] = metrics["Av.Price"].sum()
    final_metrics.loc[0,"Total Av.Percentaje"] = metrics["Av.Percentaje (%)"].sum()
    final_metrics.loc[0,"Winner Ops"] = len(np.where(metrics["Av.Percentaje (%)"] > 0)[0])
    final_metrics.loc[0,"Mean Profit (%)"] = metrics[metrics["Av.Percentaje (%)"] > 0]["Av.Percentaje (%)"].mean()
    final_metrics.loc[0,"Max Win (%)"] = metrics["Av.Percentaje (%)"].max()
    final_metrics.loc[0,"Loser Ops"] = len(np.where(metrics["Av.Percentaje (%)"] < 0)[0])
    final_metrics.loc[0,"Mean Loss (%)"] = metrics[metrics["Av.Percentaje (%)"] < 0]["Av.Percentaje (%)"].mean()
    final_metrics.loc[0,"Max Loss (%)"] = metrics[metrics["Av.Percentaje (%)"] < 0]["Av.Percentaje (%)"].min()
    final_metrics.loc[0,"Final Balance"] = metrics.loc[metrics.index[-1],"Balance"]


    
    return metrics, final_metrics



# Función principal del bot
def main():
            all_metrics = pd.DataFrame(columns=["Market","Total ops","Mean Time Lapsed","Null ops","Total Av.Price","Total Av.Percentaje","Winner Ops","Mean Profit (%)","Max Win (%)","Loser Ops", "Mean Loss (%)","Max Loss (%)","Final Balance"])

            symbol = market['symbol']
            # Calcular indicador MACD
            macd, signal = calculate_macd(historical_data)
            
            # Realizar operaciones de trading según la estrategia
            actions = trading_strategy(historical_data,macd, signal)

            metrics, final_metrics = strategy_metrics(actions,symbol)

            print(metrics)

            print(final_metrics)
            
            all_metrics.loc[i,list(all_metrics.columns)] = final_metrics.values[0]

            metrics.to_excel(writer, sheet_name=symbol, index=False)
            
            print(all_metrics)
            all_metrics.to_excel(writer, sheet_name='All_Markets', index=False)
            

        
        # Esperar 15 minutos antes de la próxima operación
            time.sleep(900)
    
            pass




if __name__ == "__main__":
    main()
