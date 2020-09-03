// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title="Colored RSI - Flo5k5", shorttitle="RSI - Flo5k5")

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
// Interface

plot30 = plot(series=30, color=color.white, transp=20)
fill(plot1=plot30, plot2=rsiP, color=rsi1 <= 30 ? color.green : na, transp=60)

plot70 = plot(series=70, color=color.white, transp=20)
fill(plot1=rsiP, plot2=plot70, color=rsi1 >= 70 ? color.red : na, transp=60)

// hline.style_solid, hline.style_dotted, hline.style_dashed
hline(price=50, linestyle=hline.style_dotted, color=color.white)

plot0  = plot(series=0, transp=100)
plot20 = plot(series=20, transp=100)
fill(plot1=plot0, plot2=plot20, color=color.green, transp=70)

plot40  = plot(series=40, transp=100)
plot60 = plot(series=60, transp=100)
fill(plot1=plot40, plot2=plot60, color=color.white, transp=70)

plot80  = plot(series=80, transp=100)
plot100 = plot(series=100, transp=100)
fill(plot1=plot80, plot2=plot100, color=color.red, transp=70)
