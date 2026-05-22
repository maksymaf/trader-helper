import { useEffect, useState, useRef } from 'react';

export function SignalPage() {
  const [currency, setCurrency] = useState('BTCUSDT');
  const [inputPrice, setInputPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [alerts, setAlerts] = useState([]);

  const alertsRef = useRef(alerts);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    const wsUrl = "wss://stream.binance.com/ws/btcusdt@ticker";
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.c);
      setCurrentPrice(price);

      let updatedAlerts = [...alertsRef.current];
      let needsUpdate = false;

      updatedAlerts = updatedAlerts.map(alertItem => {
        if (!alertItem.triggered && alertItem.symbol === 'BTCUSDT') {
          if (price >= alertItem.target) {
            needsUpdate = true;
            alert(`🚨 ТАРГЕТ ${alertItem.target}$ ДОСЯГНУТО! Поточна ціна: $${price}`);
            return { ...alertItem, triggered: true };
          }
        }
        return alertItem;
      });

      if (needsUpdate) {
        setAlerts(updatedAlerts);
      }
    };

    ws.onerror = (error) => {
      console.error("Помилка WebSocket:", error);
    };

    return () => ws.close();
  }, []);

  function handleAddSignal() {
    const target = parseFloat(inputPrice);
    if (!target || target <= 0) return;

    const newAlert = {
      id: Date.now(),
      symbol: currency.toUpperCase().replace('/', ''),
      target: target,
      triggered: false
    };

    setAlerts(prev => [...prev, newAlert]);
    setInputPrice('');
  }

  function handleDeleteAlert(id) {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }

  return (
    <div className="p-12 flex flex-col w-[90%] max-w-xl gap-6">
      <div>
        <h2 className="text-xl font-bold">Паралельний трекінг алертів</h2>
        <p className="text-lg text-green-600 font-semibold mt-2">
          Поточна ціна BTC: ${currentPrice ? currentPrice.toFixed(2) : 'Завантаження...'}
        </p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)} 
          className="border p-2 w-1/3"
          placeholder="BTCUSDT"
        />
        <input 
          type="number" 
          value={inputPrice} 
          onChange={(e) => setInputPrice(e.target.value)} 
          className="border p-2 w-1/3"
          placeholder="Цільова ціна"
        />
        <button onClick={handleAddSignal} className="bg-blue-500 text-white p-2 rounded w-1/3 hover:bg-blue-600">
          Додати алерт
        </button>
      </div>

      <div className="border rounded p-4 bg-gray-50">
        <h3 className="font-bold mb-3 text-gray-700">Ваші алерти ({alerts.length}):</h3>
        {alerts.length === 0 ? (
          <p className="text-gray-400 text-sm">Немає активних сповіщень</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map(alertItem => (
              <li 
                key={alertItem.id} 
                className={`flex justify-between items-center p-2 rounded border ${
                  alertItem.triggered ? 'bg-red-50 border-red-200 line-through text-gray-400' : 'bg-white'
                }`}
              >
                <span>
                  {alertItem.symbol} → <strong>${alertItem.target}</strong> 
                  {alertItem.triggered && <span className="text-red-500 ml-2 font-bold">[СПРАЦЮВАВ]</span>}
                </span>
                <button 
                  onClick={() => handleDeleteAlert(alertItem.id)} 
                  className="text-gray-400 hover:text-red-500 font-bold px-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
