import psycopg2
from psycopg2 import sql
from psycopg2.extensions import AsIs
import random
from datetime import datetime, timedelta
import pandas as pd




def create_random_data(cur):
    # Generación de datos aleatorios
    bots = ["Bot1", "Bot2", "Bot3", "Bot4"]
    market = "BTCUSDT"

    start_date = datetime(2023, 1, 1)
    end_date = datetime.now() - timedelta(days=1)

    data = []
    for _ in range(100):
        oDate = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
        cDate = oDate + timedelta(hours=random.randint(1, 24), minutes=random.randint(0, 59), seconds=random.randint(0, 59))
        status = "Closed"
        bot = random.choice(bots)
        if bot == "Bot1":
            if random.random() < 0.2:  # Bot1 es el perdedor
                status = "Closed"
                Close = random.uniform(15000, 18000)
            else:  # Bot1 es el ganador
                Close = random.uniform(20000, 25000)
        elif bot == "Bot2":
            Close = random.uniform(18000, 23000)
        elif bot == "Bot3":
            Close = random.uniform(17000, 22000)
        elif bot == "Bot4":
            Close = random.uniform(19000, 24000)
        USDT = random.uniform(1, 10)
        Asset = random.uniform(0.01, 0.1)
        Open = random.uniform(15000, 25000)
        Reason = "Sell Signal" if random.random() < 0.5 else "Buy Signal"
        Diff = Close - Open
        Diff_percentage = (Diff / Open) * 100 if Open != 0 else 0
        Profit = USDT * Diff_percentage/100
        
        data.append((oDate, cDate, status, bot, market, USDT, Asset, Open, Close, Reason, Diff, Diff_percentage, Profit))

    df_closed = pd.DataFrame(data, columns=['oDate', 'cDate', 'status', 'Bot', 'Market', 'USDT', 'Asset', 'Open', 'Close', 'Reason', 'Diff', 'Diff_percentage', 'Profit'])
    # Ordenar DataFrame por fecha de apertura
    df_closed = df_closed.sort_values(by='oDate')

    # Insertar los datos en la base de datos
    for _, row in df_closed.iterrows():
        cur.execute("""
            INSERT INTO trades (oDate, cDate, status, Bot, Market, USDT, Asset, Open, Close, Reason, Diff, Diff_percentage, Profit)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, row)

    # Agregar 5 registros al final con status 'Open' para 3 bots distintos
    df_open = pd.DataFrame(columns=df_closed.columns)
    for _ in range(5):
        bot = random.choice(list(set(bots) - set(["Bot"])))  # Escoger un bot distinto a "Bot" si es posible
        oDate = datetime.now() - timedelta(days=random.randint(0, 10))
        status = "Open"
        Open = random.uniform(15000, 25000)
        USDT = random.uniform(1, 10)
        Asset = random.uniform(0.01, 0.1)
        
        df_open = df_open.append({'oDate': oDate, 'status': status, 'Bot': bot, 'Market': market, 'USDT': USDT, 'Asset': Asset,'Open': Open}, ignore_index=True)

    # Ordenar DataFrame por fecha de apertura
    df_open = df_open.sort_values(by='oDate')
    df_open = df_open.dropna(axis=1)

        # Insertar los datos en la base de datos
    for _, row in df_open.iterrows():
        cur.execute("""
            INSERT INTO trades (oDate, status, Bot, Market, USDT, Asset, Open)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, row)
    



def trades_table(cur):
    # Creación de la tabla
    cur.execute("""
    CREATE TABLE IF NOT EXISTS trades (
        trade_id SERIAL PRIMARY KEY,
        oDate TIMESTAMP NOT NULL,
        cDate TIMESTAMP,
        status VARCHAR(10) NOT NULL,
        Bot VARCHAR(20) NOT NULL,
        Market VARCHAR(20),
        USDT NUMERIC NOT NULL,
        Asset NUMERIC NOT NULL,
        Open NUMERIC NOT NULL,
        Close NUMERIC,
        Reason VARCHAR(100),
        Diff NUMERIC,
        Diff_percentage NUMERIC,
        Profit NUMERIC
    );
    """)

def balance_table(cur):
    # Creación de la tabla de balance
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Balance (
            trade_id INT NOT NULL,
            cDate TIMESTAMP NOT NULL,
            profit NUMERIC(10, 2),
            balance_final NUMERIC(10, 2) NOT NULL
        );
    """)


    # Formatear la fecha como un string en el formato de timestamp de PostgreSQL
    fecha_1900_str = datetime(1900,4,19)
    cur.execute("""
    INSERT INTO Balance (trade_id, cdate, profit, balance_final)
    VALUES (0, %s, 0, 100);
    """, (fecha_1900_str,))


def close_trade_trigger(cur):
    cur.execute("""
    CREATE OR REPLACE FUNCTION insert_into_balance()
    RETURNS TRIGGER AS $$
    DECLARE
        prev_balance NUMERIC;
        update_balance NUMERIC;
        last_trade_id NUMERIC;
    BEGIN
        IF NEW.status = 'Closed' THEN
            -- Obtener el último valor de balance_finalD
            SELECT INTO last_trade_id MAX(trade_id) FROM balance;
            SELECT INTO prev_balance balance_final FROM balance WHERE trade_id = last_trade_id;

            -- Calcular el nuevo balance_final
            update_balance := prev_balance + NEW.profit;

            -- Insertar el nuevo registro en la tabla balance
            INSERT INTO balance (trade_id, cdate, profit, balance_final)
            VALUES (NEW.trade_id, NEW.cdate, NEW.profit, update_balance);
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trigger_insert_into_balance
    AFTER INSERT OR UPDATE ON trades
    FOR EACH ROW
    EXECUTE PROCEDURE insert_into_balance();

    """)


def intervals_data_table(cur):
    cur.execute("""
        CREATE TABLE IF NOT EXISTS token_data (
            symbol CHAR NOT NULL,
            interval CHAR NOT NULL,
            initial_date TIMESTAMP NOT NULL,
            final_date TIMESTAMP NOT NULL
        );
    """)



def main():
    # Conexión a la base de datos
    conn = psycopg2.connect(
        dbname="TradesData",
        user="postgres",
        password="1234",
        host="localhost",
        port=5433
    )
    cur = conn.cursor()

    trades_table(cur)

    balance_table(cur)

    intervals_data_table(cur)

    close_trade_trigger(cur)

    create_random_data(cur)

    # Confirmar cambios y cerrar conexión
    conn.commit()
    conn.close()




if __name__ == "__main__":
    main()


