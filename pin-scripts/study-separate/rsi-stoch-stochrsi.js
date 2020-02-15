// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title="Styled Stochastic", shorttitle="Styled Stoch")

////////////////////////////////////////////////////////////////////////////////
// Variables

colorBlue   = #00ffff
colorGreen  = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed    = #f44336

////////////////////////////////////////////////////////////////////////////////
// RSI

dummy0       = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowRSI = input(title="RSI", type=input.bool, defval=true)
dummy01      = input(title=" ", type=input.bool, defval=false)
src          = input(close, title="RSI Source")
lengthRSI    = input(14, minval=1, title="RSI length")

rsi1 = rsi(src, lengthRSI)

rsiP = plot(rsi1, color=colorYellow, title="RSI", transp=0, linewidth=2)

////////////////////////////////////////////////////////////////////////////////
// Stoch 

dummy1            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStoch    = input(title="Stochastic", type=input.bool, defval=true)
dummy11           = input(title=" ", type=input.bool, defval=false)
inputLengthStoch1 = input(title="Length", type=input.integer, defval=14, minval=1)
inputSmoothK      = input(title="Smooth K", type=input.integer, defval=3, minval=1)
inputSmoothD      = input(title="Smooth D", type=input.integer, defval=3, minval=1)

k                 = sma(stoch(close, high, low, inputLengthStoch1), inputSmoothK)
d                 = sma(k, inputSmoothD)

plot(k, color=colorBlue, title="K", transp=0, linewidth=1)
plot(d, color=colorRed, title="D", transp=0, linewidth=1)

plotchar(inputShowStoch and crossunder(k, d), char='↓', transp=0, location=location.top, color=color.white, editable=true, size=size.auto)
plotchar(inputShowStoch and crossover(k, d), char='↑', transp=0, location=location.bottom, color=color.white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI

dummy2            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStochRsi = input(title="Stochastic RSI", type=input.bool, defval=true)
dummy21           = input(title=" ", type=input.bool, defval=false)
inputRsiSrc       = input(title='RSI Source', defval=close)
inputLengthRsi    = input(type=input.integer, title='RSI Length', defval=14, minval=1)
inputLengthStoch2 = input(type=input.integer, title='Stoch Length', defval=14, minval=1)
inputSRsiK        = input(type=input.integer, title='Smooth K', defval=3, minval=1)
inputSRsiD        = input(type=input.integer, title='Smooth D', defval=3, minval=1)

getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    rsi = rsi(rsiSource, rsiLength)
    k   = sma(stoch(rsi, rsi, rsi, lengthStoch), smoothK)
    d   = sma(k, smoothD)
    [rsi, k, d]

[rsi2, k2, d2] =  getStochRsi(inputRsiSrc, inputLengthRsi, inputLengthStoch2, inputSRsiK, inputSRsiD)

plot(k2, color=colorBlue, title="Stock RSI K", transp=0, linewidth=1)
plot(d2, color=colorRed, title="Stoch RSI D", transp=0, linewidth=1)

plotchar(inputShowStochRsi and crossunder(k2, d2), char='↓', transp=0, location=location.top, color=color.white, editable=true, size=size.auto)
plotchar(inputShowStochRsi and crossover(k2, d2), char='↑', transp=0, location=location.bottom, color=color.white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Interface

h40 = hline(40)
h60 = hline(60)

plot30 = plot(series=30, color=color.white)
plot70  = plot(series=70, color=color.white)

fill(plot1=plot30, plot2=rsiP, color=rsi1 <= 30 ? colorGreen : na, transp=60)
fill(plot1=rsiP, plot2=plot70, color=rsi1 >= 70 ? colorRed : na, transp=60)

plot0  = plot(series=0, transp=100)
plot20 = plot(series=20, transp=100)

plot80  = plot(series=80, transp=100)
plot100 = plot(series=100, transp=100)

fill(plot1=plot0, plot2=plot20, color=colorGreen, transp=80)
fill(plot1=plot80, plot2=plot100, color=colorRed, transp=80)
