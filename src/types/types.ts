
export interface Trade {
  _id: String,
  userId: String,
  pair: String,
  direction: 'short' | 'long',
  positionSize: Number,
  entryPrice: Number,
  exitPrice: Number,
  stopLoss: Number,
  takeProfit: Number,
  pnl: Number,
  rr: Number,
  reason: String,
  emotions: String,
  mistakes: String,
  screenshots?: Array<String>,
  tradeRate: Number,
  openedAt: Date,
  closedAt?: Date
}

