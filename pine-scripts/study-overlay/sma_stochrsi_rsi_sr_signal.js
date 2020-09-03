//@version=3
study(title="SMA Bundle", shorttitle="SMA", overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth = 1
colorBlue = #00ffff
colorGreen = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed = #f44336

////////////////////////////////////////////////////////////////////////////////
// SMAs

sma9 = sma(close, 9)
sma21 = sma(close, 21)
sma50 = sma(close, 50)
sma100 = sma(close, 100)
sma200 = sma(close, 200)

plot(sma9, color=colorBlue, linewidth=lineWidth, transp=20)
plot(sma21, color=colorGreen, linewidth=lineWidth, transp=20)
plot(sma50, color=colorYellow, linewidth=lineWidth, transp=20)
plot(sma100, color=colorOrange, linewidth=lineWidth, transp=20)
plot(sma200, color=colorRed, linewidth=lineWidth, transp=20)

// plot(crossover(sma9, sma21) ? close : na, style=cross, linewidth=2, color=white, transp=0, editable=false)
// plot(crossunder(sma9, sma21) ? close : na, style=cross, linewidth=2, color=black, transp=0, editable=false)

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

plotchar(crossunder(k, d) and d >= 80 and d <= 99.99, char="❄", transp=20, offset=-1, location=location.abovebar, color=colorRed, text="", editable=true, size=size.tiny, title="Strong sell signal Stoch RSI")
plotshape(crossunder(k, d) and d >= 20 and d < 80, style=shape.flag, transp=70, offset=-1, location=location.abovebar, color=colorRed, text="", editable=true, size=size.tiny, title="Sell signal Stoch RSI")
plotshape(crossunder(k, d) and d >= 0 and d < 20, style=shape.xcross, transp=70, offset=-1, location=location.abovebar, color=colorRed, text="", editable=true, size=size.tiny, title="Risky sell signal Stoch RSI")

plotchar(crossover(k, d) and d >=0.1 and d <= 20, char="☀", transp=20, offset=-1, location=location.belowbar, color=colorGreen, text="", editable=true, size=size.tiny, title="Strong buy signal Stoch RSI")
plotshape(crossover(k, d) and d > 20 and d <= 80, style=shape.flag, transp=70, offset=-1, location=location.belowbar, color=colorGreen, text="", editable=true, size=size.tiny, title="Buy signal Stoch RSI")
plotshape(crossover(k, d) and d > 80 and d <= 99.99, style=shape.xcross, transp=70, offset=-1, location=location.belowbar, color=colorGreen, text="", editable=true, size=size.tiny, title="Risky buy signal Stoch RSI")

////////////////////////////////////////////////////////////////////////////////
// Support / Resistance
//
// https://backtest-rookies.com/2018/10/05/tradingview-support-and-resistance-indicator/
//

left = 5
right = 5
quick_right = 3 // Used to try and detect a more recent significant swing.
 
pivot_high = pivothigh(high,left,right)
pivot_lows = pivotlow(low, left,right)
 
quick_pivot_high = pivothigh(high,left,quick_right)
quick_pivot_lows = pivotlow(low, left,quick_right)
 
level1 = valuewhen(quick_pivot_high, high[quick_right], 0)
level2 = valuewhen(quick_pivot_lows, low[quick_right], 0)
level3 = valuewhen(pivot_high, high[right], 0)
level4 = valuewhen(pivot_lows, low[right], 0)
level5 = valuewhen(pivot_high, high[right], 1)
level6 = valuewhen(pivot_lows, low[right], 1)
level7 = valuewhen(pivot_high, high[right], 2)
level8 = valuewhen(pivot_lows, low[right], 2)

plot(level1, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level2, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level3, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level4, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level5, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level6, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level7, style=line, show_last=1, color=white, trackprice=true, editable=false)
plot(level8, style=line, show_last=1, color=white, trackprice=true, editable=false)

////////////////////////////////////////////////////////////////////////////////
// Volume
//
// https://www.tradingview.com/script/GbM6d1PJ-Separate-Volume-Indicator/
//

// showma = input(title="Show Moving Average", type=bool, defval=true)
// sma = input(title="MA Length", defval=20)
// plot(series=volume, title="Volume", style=columns,color=(open > close) ? #B03838 : #008060)
// plot(series=sma(volume, sma), title="Volume SMA", color=showma ? #FF7F00FF : #00000000)

//
// https://www.tradingview.com/script/LfVJhuir-Indicators-Better-Volume-Indicator-InstrumentVolume/
// @author LazyBear
//
// If you use this code in its original/modified form, do drop me a note. 
//

//
// Configurable params
//
// length=input(8, title="Lookback")
// enableBarColors=input(false, type=bool)
// use2Bars=input(true, type=bool)
// lowVol=input(true, type=bool)
// climaxUp=input(true, type=bool)
// climaxDown=input(true, type=bool)
// churn=input(true, type=bool)
// climaxChurn=input(true, type=bool)

// //
// // Tweak the colors
// //
// lowVolColor = yellow
// climaxUpColor = red
// climaxDownColor = white
// churnColor = green
// climaxChurnColor = #8B008B
// defColor = #00FFFF	 


// //
// // Don't change anything below this
// //
// range=tr
// v=volume
// v1 = close >= open ? (v * ((range) / ((2+(range*range)/10) * range + (open - close)))) : (v * (((range + close - open)) / (2+(range*range)/10) * range + (close - open)))
// v2 = v - v1
// v3 = v1 + v2
// v4 = v1 * range
// v5 = (v1 - v2) * range
// v6 = v2 * range
// v7 = (v2 - v1) * range
// v8 = (range != 0 ?  v1 / range : 1)
// v9 = (range != 0 ? (v1 - v2) / range : 1)
// v10 = (range != 0 ?  v2 / range : 1)
// v11 = (range != 0 ?  (v2 - v1) / range :  1)
// v12 = (range != 0 ?  v3 / range : 1)
// v13 = use2Bars ? v3 + v3[1] : 1
// v14 = (use2Bars ? (v1 + v1[1])*(highest(high,2)-lowest(low,2)) : 1)
// v15 = (use2Bars ? (v1 + v1[1]-v2-v2[1])*(highest(high,2)-lowest(low,2)) : 1)
// v16 = (use2Bars ? (v2 + v2[1])*(highest(high,2)-lowest(low,2)) : 1)
// v17 = (use2Bars ? (v2 + v2[1]-v1-v1[1])*(highest(high,2)-lowest(low,2)) : 1)
// v18 =  ((use2Bars and (highest(high,2)!=lowest(low,2))) ? (v1+v1[1])/(highest(high,2)-lowest(low,2)) : 1)
// v19 = ((use2Bars and (highest(high,2)!=lowest(low,2))) ? (v1+v1[1]-v2-v2[1])/(highest(high,2)-lowest(low,2)) : 1)
// v20 = ((use2Bars and (highest(high,2)!=lowest(low,2))) ? (v2+v2[1])/(highest(high,2)-lowest(low,2)) : 1)
// v21 = ((use2Bars and (highest(high,2)!=lowest(low,2))) ? (v2+v2[1]-v1-v1[1])/(highest(high,2)-lowest(low,2)) : 1)
// v22 = ((use2Bars and (highest(high,2)!=lowest(low,2))) ? v13/(highest(high,2)-lowest(low,2)) : 1)

// c1 = (v3 == lowest(v3, length) ?  1 : 0)
// c2 = ((v4 == highest(v4, length) and close > open) ? 1 : 0)
// c3 = ((v5 == highest(v5, length) and close > open) ? 1 : 0)
// c4 = ((v6 == highest(v6, length) and close < open) ? 1 : 0)
// c5 = ((v7 == highest(v7, length) and close < open) ? 1 : 0)
// c6 = ((v8 == lowest(v8, length) and close < open) ? 1 : 0)
// c7 = ((v9 == lowest(v9, length) and close < open) ? 1 : 0)
// c8 = ((v10 == lowest(v10, length) and close > open) ? 1 : 0)
// c9 = ((v11 == lowest(v11, length) and close > open) ? 1 :  0)
// c10 = (v12 == highest(v12, length) ? 1 : 0)
// c11 = (use2Bars and (v13==lowest(v13,length) and close > open and close[1] > open[1]) ? 1 : 0)
// c12 = (use2Bars and (v14==highest(v14,length) and close > open and close[1] > open[1]) ? 1 : 0)
// c13 = (use2Bars and (v15==highest(v15,length) and close > open and close[1] < open[1]) ? 1 : 0)
// c14 = (use2Bars and (v16==lowest(v16,length) and close < open and close[1] < open[1]) ? 1 : 0)
// c15 = (use2Bars and (v17==lowest(v17,length) and close < open and close[1] < open[1]) ? 1 : 0)
// c16 = (use2Bars and (v18==lowest(v18,length) and close < open and close[1] < open[1]) ? 1 : 0)
// c17 = (use2Bars and (v19==lowest(v19,length) and close > open and close[1] < open[1]) ? 1 : 0)
// c18 = (use2Bars and (v20==lowest(v20,length) and close > open and close[1] > open[1]) ? 1 : 0)
// c19 = (use2Bars and (v21==lowest(v21,length) and close > open and close[1] > open[1]) ? 1 : 0)
// c20 = (use2Bars and (v22==lowest(v22,length)) ? 1 : 0)

// c0=(climaxUp and (c2 or c3 or c8 or c9 or c12 or c13 or c18 or c19)) ? climaxUpColor : ((climaxDown and (c4 or c5 or c6 or c7 or c14 or c15 or c16 or c17)) ? climaxDownColor : ((churn and c10 or c20) ? churnColor : defColor))
// v_color=(climaxChurn and (c10 or c20)) and (c2 or c3 or c4 or c5 or c6 or c7 or c8 or c9) ? climaxChurnColor : ((lowVol and (c1 or c11)) ? lowVolColor : c0)
// plot(not enableBarColors ? volume : na, style=columns, linewidth=1, color = v_color)
// plot(not enableBarColors ? sma(volume, length) : na, color=orange, linewidth=2)
// barcolor(enableBarColors ? v_color : na)

// https://www.tradingview.com/script/EHTKtnIt-ST-Volume-Flow-v6/
// https://www.tradingview.com/script/LgRTt6b8-Smart-Volume/
// https://www.tradingview.com/script/w7hKpwnr-Support-and-Resistance-Levels-with-auto-Fibonacci/
// https://backtest-rookies.com/2017/08/17/tradingview-multi-smas-indicator/