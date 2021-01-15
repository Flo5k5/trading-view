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

rsiP = plot(inputShowRSI ? rsi1 : na, color=colorYellow, title="RSI", transp=0, linewidth=2)

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

plot(inputShowStoch ? k : na, color=colorBlue, title="K", transp=0, linewidth=1)
plot(inputShowStoch ? d : na, color=colorRed, title="D", transp=0, linewidth=1)

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
    _rsi = rsi(rsiSource, rsiLength)
    _k   = sma(stoch(_rsi, _rsi, _rsi, lengthStoch), smoothK)
    _d   = sma(_k, smoothD)
    [_rsi, _k, _d]

[rsi2, k2, d2] =  getStochRsi(inputRsiSrc, inputLengthRsi, inputLengthStoch2, inputSRsiK, inputSRsiD)

plot(inputShowStochRsi ? k2 : na, color=colorBlue, title="Stock RSI K", transp=0, linewidth=1)
plot(inputShowStochRsi ? d2 : na, color=colorRed, title="Stoch RSI D", transp=0, linewidth=1)

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

////////////////////////////////////////////////////////////////////////////////
// Alerts

// Stochastic
alertcondition(crossover(k, d), title='Stoch K crossover D', message='Stoch Bullish cross')
alertcondition(crossunder(k, d), title='Stoch K crossunder D', message='Stoch Bearish cross')
alertcondition(crossover(k, 80), title='Stoch K crossover 80', message='Stoch K over 80')
alertcondition(crossunder(k, 80), title='Stoch K crossunder 80', message='Stoch K under 80')
alertcondition(crossover(k, 70), title='Stoch K crossover 70', message='Stoch K over 70')
alertcondition(crossunder(k, 70), title='Stoch K crossunder 70', message='Stoch K under 70')
alertcondition(crossover(k, 30), title='Stoch K crossover 30', message='Stoch K over 30')
alertcondition(crossunder(k, 30), title='Stoch K crossunder 30', message='Stoch K under 30')
alertcondition(crossover(k, 20), title='Stoch K crossover 20', message='Stoch K over 20')
alertcondition(crossunder(k, 20), title='Stoch K crossunder 20', message='Stoch K under 20')

// StochasticRsi
alertcondition(crossover(k2, d2), title='StochRsi K crossover D', message='StochRsi Bullish cross')
alertcondition(crossunder(k2, d2), title='StochRsi K crossunder D', message='StochRsi Bearish cross')
alertcondition(crossover(k2, 80), title='StochRsi K crossover 80', message='StochRsi K over 80')
alertcondition(crossunder(k2, 80), title='StochRsi K crossunder 80', message='StochRsi K under 80')
alertcondition(crossover(k2, 70), title='StochRsi K crossover 70', message='StochRsi K over 70')
alertcondition(crossunder(k2, 70), title='StochRsi K crossunder 70', message='StochRsi K under 70')
alertcondition(crossover(k2, 30), title='StochRsi K crossover 30', message='StochRsi K over 30')
alertcondition(crossunder(k2, 30), title='StochRsi K crossunder 30', message='StochRsi K under 30')
alertcondition(crossover(k2, 20), title='StochRsi K crossover 20', message='StochRsi K over 20')
alertcondition(crossunder(k2, 20), title='StochRsi K crossunder 20', message='StochRsi K under 20')
