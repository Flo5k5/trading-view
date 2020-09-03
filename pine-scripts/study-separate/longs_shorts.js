//@version=3
study(title="Longs/Shorts BTC", shorttitle="L/S BTC")

////////////////////////////////////////////////////////////////////////////////
// Variables

colorBlue = #00ffff
colorGreen = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed = #f44336


////////////////////////////////////////////////////////////////////////////////
// Symbols

inputSymbol1 = input(title="Symbol 1", type=symbol, defval="BITFINEX:BTCUSD")
inputDataSymbol1 = input(title="Data symbol 1", type=source, defval=close)
inputSymbol2 = input(title="Symbol 2", type=symbol, defval="BITFINEX:BTCUSDLONGS")
inputDataSymbol2 = input(title="Data symbol 2", type=source, defval=close)
inputSymbol3 = input(title="Symbol 3", type=symbol, defval="BITFINEX:BTCUSDSHORTS")
inputDataSymbol3 = input(title="Data symbol 3", type=source, defval=close)

symbol1Data = security(inputSymbol1, period, inputDataSymbol1)
symbol2Data = security(inputSymbol2, period, inputDataSymbol2)
symbol3Data = security(inputSymbol3, period, inputDataSymbol3)

plot(symbol1Data, color=colorBlue, linewidth=1)
plot(symbol2Data, color=colorGreen, linewidth=1)
plot(symbol3Data, color=colorRed, linewidth=1)