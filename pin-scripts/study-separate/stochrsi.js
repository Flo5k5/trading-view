//@version=3
study(title="Custom Stochastic RSI", shorttitle="Custom Stoch RSI")

////////////////////////////////////////////////////////////////////////////////
// Variables

colorBlue = #00ffff
colorGreen = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed = #f44336

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 
// On daily, settings to ameliorate: K=5 D=4 RSI=19 Stoch=21 Source=Close

smoothK = input(3, minval=1)
smoothD = input(3, minval=1)
lengthRSI = input(14, minval=1)
lengthStoch = input(14, minval=1)
src = input(close, title="RSI Source")

rsi1 = rsi(src, lengthRSI)
k = sma(stoch(rsi1, rsi1, rsi1, lengthStoch), smoothK)
d = sma(k, smoothD)

plot(k, color=colorBlue, title="K", transp=0)
plot(d, color=colorRed, title="D", transp=0)
plot(rsi1, color=colorYellow, title="RSI", transp=0, linewidth=2)

// linecol = k[0] >= d[0] and k[1] <= d[1] and k <= 60 and k >= 5 ? green : white
// linecol2 = k[0] <= d[0] and k[1] >= d[1] and k >= 40 and k <= 95 ? red : linecol

// data = (60-k[1])/2
// data2 = (k[1]-40)/2
// plot(k[1] >= d[1] and k[2] <= d[2] and k <= 60 and k >= 10 ? data : na , style=columns,color=green,title="Cross Up Confirmed")           // show a green column higher if stoch is deeper
// plot(k[1] <= d[1] and k[2] >= d[2] and k >= 40 and k <= 95 ? data2 : na , style=columns,color=red, title="Cross Down Confirmed")           // show a red column higher if stoch is higher


plotchar(crossunder(k, d) and d >= 20 and d <= 99.99, char='↓', transp=0, location=location.top, color=white, editable=true, size=size.auto)
plotchar(crossover(k, d) and d >= 0.01 and d <= 80, char='↑', transp=0, location=location.bottom, color=white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Interface

//h0 = hline(0)
//h20 = hline(20)
h30 = hline(30)
h40 = hline(40)
h60 = hline(60)
//h80 = hline(80)
//h100 = hline(100)

plot0  = plot(series=0, editable=false, transp=100)
plot20 = plot(series=20, editable=false, transp=100)

plot80  = plot(series=80, editable=false, transp=100)
plot100 = plot(series=100, editable=false, transp=100)

fill(plot1=plot0, plot2=plot20, color=green, transp=80)
fill(plot1=plot80, plot2=plot100, color=red, transp=80)
