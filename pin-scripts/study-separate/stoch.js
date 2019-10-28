//@version=3
study(title="Styled Stochastic", shorttitle="Styled Stoch")

////////////////////////////////////////////////////////////////////////////////
// Variables

colorBlue   = #00ffff
colorGreen  = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed    = #f44336

////////////////////////////////////////////////////////////////////////////////
// Stoch 

dummy0           = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStoch   = input(title="Stochastic", type=input.bool, defval=true)
dummy01          = input(title=" ", type=input.bool, defval=false)
inputLengthStoch = input(title="Length", type=input.integer, defval=14, minval=1)
inputSmoothK     = input(title="K", type=input.integer, defval=3, minval=1)
inputSmoothD     = input(title="D", type=input.integer, defval=3, minval=1)

k                = sma(stoch(close, high, low, inputLengthStoch), inputSmoothK)
d                = sma(k, inputSmoothD)

plot(k, color=colorBlue, title="K", transp=0, linewidth=1)
plot(d, color=colorRed, title="D", transp=0, linewidth=1)

plotchar(crossunder(k, d), char='↓', transp=0, location=location.top, color=white, editable=true, size=size.auto)
plotchar(crossover(k, d), char='↑', transp=0, location=location.bottom, color=white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// RSI

dummy1       = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowRSI = input(title="RSI", type=input.bool, defval=true)
dummy11      = input(title=" ", type=input.bool, defval=false)
src          = input(close, title="RSI Source")
lengthRSI    = input(14, minval=1, title="RSI length")

rsi1 = rsi(src, lengthRSI)

rsiP = plot(rsi1, color=colorYellow, title="RSI", transp=0, linewidth=2)

////////////////////////////////////////////////////////////////////////////////
// Interface

h40 = hline(40)
h60 = hline(60)

plot30 = plot(series=30, color=white)
plot70  = plot(series=70, color=white)

fill(plot1=plot30, plot2=rsiP, color=rsi1 <= 30 ? colorGreen : na, transp=60)
fill(plot1=rsiP, plot2=plot70, color=rsi1 >= 70 ? colorRed : na, transp=60)

plot0  = plot(series=0, transp=100)
plot20 = plot(series=20, transp=100)

plot80  = plot(series=80, transp=100)
plot100 = plot(series=100, transp=100)

fill(plot1=plot0, plot2=plot20, color=colorGreen, transp=80)
fill(plot1=plot80, plot2=plot100, color=colorRed, transp=80)
