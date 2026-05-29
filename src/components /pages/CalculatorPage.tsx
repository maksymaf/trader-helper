import { useState } from 'react';

export function CalculatorPage() {
  const [balance, setBalance] = useState<number>(1000);
  const [percentage, setPercentage] = useState<number>(10);
  const [leverage, setLeverage] = useState<number>(5);
  const [entryPrice, setEntryPrice] = useState<number>(1);
  const [exitPrice, setExitPrice] = useState<number>(1);

  const risk = 30;
  const profit = 70;

  // Маржа
  const margin = balance * (percentage / 100);

  // Позиція
  const positionSize = margin * leverage;

  // TP / SL %
  const tpPercent = profit / leverage;
  const slPercent = risk / leverage;

  // LONG TP/SL price
  const takeProfitPrice = entryPrice * (1 + tpPercent / 100);
  const stopLossPrice = entryPrice * (1 - slPercent / 100);

  // PnL (LONG)
  const pnl =
    ((exitPrice - entryPrice) / entryPrice) * positionSize;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h2>Futures Calculator</h2>

      <input
        type="number"
        placeholder="Баланс"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="% на угоду"
        value={percentage}
        onChange={(e) => setPercentage(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Плече"
        value={leverage}
        onChange={(e) => setLeverage(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Ціна входу"
        value={entryPrice}
        onChange={(e) => setEntryPrice(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Ціна виходу (PnL)"
        value={exitPrice}
        onChange={(e) => setExitPrice(Number(e.target.value))}
      />

      <hr />

      <h3>Маржа: {margin.toFixed(2)} USDT</h3>

      <h3>Розмір позиції: {positionSize.toFixed(2)} USDT</h3>

      <h3>TP рух ціни: {tpPercent.toFixed(2)}%</h3>

      <h3>SL рух ціни: {slPercent.toFixed(2)}%</h3>

      <hr />

      <h3>Take Profit Price: {takeProfitPrice.toFixed(4)}</h3>

      <h3>Stop Loss Price: {stopLossPrice.toFixed(4)}</h3>

      <hr />

      <h3>
        PnL:{' '}
        <span style={{ color: pnl >= 0 ? 'green' : 'red' }}>
          {pnl.toFixed(2)} USDT
        </span>
      </h3>
    </div>
  );
}
