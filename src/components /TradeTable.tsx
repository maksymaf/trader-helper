import { useEffect, useState } from "react";
import type { Trade } from "../types/types";
import TableData from "./TableData";

const headings = ['Дата', 'Пара', 'L / S', 'Вхід', 'Вихід', 'Розмір', 'PnL'];

export default function TradeTable(){

  const [trades, setTrades] = useState<Trade[]>([]);
  console.log(trades);
  useEffect(() => {
    const fetchTrades = async () => {
      try{
        const response = await fetch('http://localhost:3000/api/trades', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });

        const data = await response.json();
        console.log(data.response);
        setTrades(data.response);
      }catch(error){
        console.error((error as Error).stack);
      }
    }

    fetchTrades();
  }, []);

  async function handleAddTrade(e) {
    try{
      const response = await fetch('http://localhost:3000/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },

        body: JSON.stringify(
          {
            "pair": "BTC/USDT",
            "direction": "long",
            "positionSize": 0.5,
            "entryPrice": 65200.50,
            "exitPrice": 66800.00,
            "stopLoss": 64500.00,
            "takeProfit": 67000.00,
            "pnl": 800.25,
            "rr": 2.28,
            "reason": "Breakout of the local resistance level on 4H timeframe with high volume.",
            "emotions": "Calm and disciplined, followed the trading plan perfectly.",
            "mistakes": "None, executed according to risk management rules.",
            "screenshots": [],
            "tradeRate": 5,
            "openedAt": "2026-05-22T14:30:00.000Z",
            "closedAt": "2026-05-22T19:15:00.000Z"
          }
        ),
      });

      const result = await response.json();
      

      setTrades([...trades, result.response]);

      console.log([...trades, result.response]);
    }catch(error){  
      console.error((error as Error).message)
    }
  }

  return (
    <table>
      <thead className="bg-surface-0">
        <tr>
          { headings.map((heading) => {
            return (
              <th 
                className="py-2.5 px-5 border border-overlay-0 text-text" 
                key={heading}
              >
                {heading}
              </th>
            )
          }) }
        </tr>
      </thead>
      <tbody>
          { trades.length ? (
            trades.map((trade, idx) => {
              return (
                <tr key={idx}>
                  <TableData type="default" content={String(
                    new Date(trade.openedAt)
                    .toLocaleString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                    })
                  )}/>
                  <TableData type="default" content={String(trade.pair)}/>
                  <TableData type="default" content={String(trade.direction.toUpperCase())}/>
                  <TableData type="default" content={String(trade.entryPrice)}/>
                  <TableData type="default" content={String(trade.exitPrice)}/>
                  <TableData type="default" content={String(trade.positionSize)}/>
                  <TableData type="profit" currency={'$'} content={String(trade.pnl)}/>
                </tr>
              )
            })
          ) : (
          
          <tr>
            <td colSpan={7} className="py-2.5 px-5">
              <div className="flex justify-between">
                <h1 className="text-text font-bold">Наразі у вас немає записаних угод...</h1> 
                <button className="text-green font-bold cursor-pointer" onClick={handleAddTrade}>
                  <span className="text-text font-bold">[</span>
                  +
                  <span className="text-text font-bold">]</span>
                </button>
              </div>
            </td>
          </tr>
        
        ) }


        { trades.length > 0 && (
          <tr>
            <td colSpan={7} className="py-2.5 px-5 border-2 border-overlay-1">
              <div className="flex justify-between">
                <h1 className="text-text font-bold">Додати угоду...</h1> 
                <button className="text-green font-bold cursor-pointer" onClick={handleAddTrade}>
                  <span className="text-text font-bold">[</span>
                  +
                  <span className="text-text font-bold">]</span>
                </button>
              </div>
            </td>
          </tr>
        ) }

      </tbody>
    </table>
  )
}