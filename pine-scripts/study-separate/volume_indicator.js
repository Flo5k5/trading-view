//@version=3
study("Separate Volume Indicator", shorttitle="VI", overlay=false)
// https://www.tradingview.com/script/GbM6d1PJ-Separate-Volume-Indicator/

////////////////////////////////////////////////////////////////////////////////
// Variables

colorBlue = #00ffff
colorGreen = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed = #f44336


dummy0 = input(title="//////////////////////////////", type=bool, defval=false)
inputShowSmas = input(title="Show Moving Averages", type=bool, defval=true)
dummy1 = input(title="//////////////////////////////", type=bool, defval=false)
inputSma1 = input(title="MA Length", type=integer, defval=9, minval=1)
inputSma2 = input(title="MA Length", type=integer, defval=20, minval=1)

sma1 = sma(volume, inputSma1)
sma2 = sma(volume, inputSma2)

plot(volume, title="Volume", style=columns,color=(open > close) ? #B03838 : #008060)
plot(inputShowSmas ? sma1 : na, title="SMA1", color=colorBlue, linewidth=2, transp=0)
plot(inputShowSmas ? sma2 : na, title="SMA2", color=colorRed, linewidth=2, transp=0)

plotchar(crossunder(sma1, sma2), char='↓', transp=0, location=location.bottom, color=white, editable=true, size=size.auto)
plotchar(crossover(sma1, sma2), char='↑', transp=0, location=location.bottom, color=white, editable=true, size=size.auto)