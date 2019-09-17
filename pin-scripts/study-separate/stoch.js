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

inputLengthStoch = input(14, minval=1)
inputSmoothK     = input(3, minval=1)
inputSmoothD     = input(3, minval=1)

k                = sma(stoch(close, high, low, inputLengthStoch), inputSmoothK)
d                = sma(k, inputSmoothD)

plot(k, color=colorBlue, title="K", transp=0)
plot(d, color=colorRed, title="D", transp=0)

plotchar(crossunder(k, d), char='↓', transp=0, location=location.top, color=white, editable=true, size=size.auto)
plotchar(crossover(k, d), char='↑', transp=0, location=location.bottom, color=white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Interface

plot0  = plot(series=0, transp=100)
plot20 = plot(series=20, transp=100)

plot80  = plot(series=80, transp=100)
plot100 = plot(series=100, transp=100)

fill(plot1=plot0, plot2=plot20, color=green, transp=80)
fill(plot1=plot80, plot2=plot100, color=red, transp=80)
