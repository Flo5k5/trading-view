//@version=4
// strategy(title="SMA Bundle", shorttitle="SMA", overlay=true, default_qty_type=strategy.percent_of_equity ,default_qty_value=100, initial_capital=2000)
study(title="SMA Bundle", shorttitle="SMA", overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Inputs

dummy0                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSmas                      = input(title="MAs", type=input.bool, defval=true)
dummy1                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputSmoothing                     = input(title="Smoothing", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputAlmaOffset                    = input(title="ALMA Offset", defval=0.85, minval=1)
inputAlmaSigma                     = input(title="ALMA Sigma", defval=6, minval=0)
inputSma1                          = input(title="MA 1", type=input.integer, defval=9, minval=1)
inputSma2                          = input(title="MA 2", type=input.integer, defval=21, minval=1)
inputSma3                          = input(title="MA 3", type=input.integer, defval=50, minval=1)
inputSma4                          = input(title="MA 4", type=input.integer, defval=100, minval=1)
inputSma5                          = input(title="MA 5", type=input.integer, defval=200, minval=1)
inputLinewidth                     = input(title="Line width", type=input.integer, defval=3, minval=1, maxval=5)
inputSmaTransparency               = input(title="MA transparency", type=input.integer, defval=20, minval=0, maxval=100)
dummy2                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowBB                        = input(title="Bollinger Bands", type=input.bool, defval=true)
dummy33                            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputLengthBB                      = input(20, minval=1, title="Length")
inputSrcBB                         = input(close, title="Source")
inputMultBB                        = input(2.0, title="Mult", minval=0.001, maxval=50)
dummy22                            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStochRsiCrosses           = input(title="Stoch RSI crosses", type=input.bool, defval=true)
dummy3                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputOffsetCross                   = input(title="Crosses offset", defval=0, type=input.integer)
inputLengthRsi                     = input(type=input.integer, defval=14, minval=1)
inputLengthStoch                   = input(type=input.integer, defval=14, minval=1)
inputSmoothK                       = input(type=input.integer, defval=3, minval=1)
inputSmoothD                       = input(type=input.integer, defval=3, minval=1)
inputRsiSrc                        = input(title="RSI Source", defval=close)
inputShowOnlyC                     = input(title="Show only current TF", type=input.bool, defval=true)
inputShowC                         = input(title="Show current TF", type=input.bool, defval=true)
inputShow1H                        = input(title="Show 1h", type=input.bool, defval=true)
inputShow4H                        = input(title="Show 4h", type=input.bool, defval=true)
inputShow1D                        = input(title="Show D", type=input.bool, defval=true)
inputShow1W                        = input(title="Show W", type=input.bool, defval=true)
dummy8                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputColorBg                       = input(title="Color background", type=input.bool, defval=true)
dummy9                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputDiff                          = input(title="Difference K and D", type=input.integer, defval=16, minval=0)
inputShowOnlyCurrentBar            = input(title="Color only current bar", type=input.bool, defval=false)
dummy4                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSupportResistance         = input(title="Show support / resistance", type=input.bool, defval=true)
dummy5                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputSupportResistanceTransparency = input(title="Support / resistance transparency", type=input.integer, defval=0, minval=0, maxval=100)
dummy80                            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputEnableStrategy                = input(title="Strategy", type=input.bool, defval=false)
dummy90                            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputStopLoss                      = input(2.0, title='Stop Loss %', type=input.float)/100
dummy7                             = input(title="//////////////////////////////", type=input.bool, defval=false)

////////////////////////////////////////////////////////////////////////////////
// Functions

get_ma(src, length) => 
    if inputSmoothing == "RMA" 
        rma(src, length)
    else
        if inputSmoothing == "SMA" 
            sma(src, length)
        else
            if inputSmoothing == "EMA"
                ema(src, length)
            else
                if inputSmoothing == "WMA" 
                    wma(src, length)
                else
                    if inputSmoothing == "VWMA"
                        vwma(src, length)
                    else
                        if inputSmoothing == "SMMA" 
                            (na(src[1]) ? sma(src, length) : (src[1] * (length - 1) + src) / length)
                        else
                            if inputSmoothing == "HullMA"
                                (wma(2 * wma(src, length / 2) - wma(src, length), round(sqrt(length))))
                            else 
                                if inputSmoothing == "LSMA" 
                                    alma(src, length, inputAlmaOffset, inputAlmaSigma)
                                else
                                    if inputSmoothing == "DEMA"
                                        e1 = ema(src, length)
                                        e2 = ema(e1, length)
                                        2 * e1 - e2
                                    else
                                        if inputSmoothing == "TEMA"
                                            ema1 = ema(src, length)
                                            ema2 = ema(ema1, length)
                                            ema3 = ema(ema2, length)
                                            3 * (ema1 - ema2) + ema3
                                        else
                                            src

get_stoch_rsi(rsiSource) =>
    rsi = rsi(rsiSource, inputLengthRsi)
    k   = sma(stoch(rsi, rsi, rsi, inputLengthStoch), inputSmoothK)
    d   = sma(k, inputSmoothD)
    [rsi, k, d]

get_current_data(timeFrame) => security(syminfo.tickerid, timeFrame, inputRsiSrc)

get_stoch_rsi_cross(rsiSource) => 
    [rsi, k, d] = get_stoch_rsi(rsiSource)
    lBearCross = crossunder(k, d) and d >= 80
    // mBearCross  = crossunder(k, d) and d > 20 and d < 80
    // sBearCross = crossunder(k, d) and d >= 0 and d <= 20
    sBearCross = crossunder(k, d) and d < 80
    lBullCross = crossover(k, d) and d < 20
    // lBullCross = crossover(k, d) and d >=0 and d <= 20
    // mBullCross  = crossover(k, d) and d > 20 and d < 80
    sBullCross  = crossover(k, d) and d >= 20
    [rsi, k, d, lBearCross, sBearCross, lBullCross, sBullCross]

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth   = 1
colorBlue   = #00FFFF
colorGreen  = #00FF00
colorYellow = #FFEB3B
colorOrange = #FF9800
colorRed    = #F44336
colorLong   = #00FEFF
colorShort  = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// MAs

ma1 = get_ma(close, inputSma1)
ma2 = get_ma(close, inputSma2)
ma3 = get_ma(close, inputSma3)
ma4 = get_ma(close, inputSma4)
ma5 = get_ma(close, inputSma5)

plot(inputShowSmas ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 1")
plot(inputShowSmas ? ma2 : na, color=colorGreen, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 2")
plot(inputShowSmas ? ma3 : na, color=colorYellow, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 3")
plot(inputShowSmas ? ma4 : na, color=colorOrange, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 4")
plot(inputShowSmas ? ma5 : na, color=colorRed, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 5")

bullCrossMA = crossover(ma1, ma2)
bearCrossMA = crossunder(ma1, ma2)
// bullCrossMA = close > ma1 and close[1] < ma1[1]
// bearCrossMA = (close < ma2 and close[1] > ma2[1]) or (close[1] > ma3[1] and close < ma3) or (close[1] > ma4[1] and close < ma4)

// plot(cross(ma1, ma2) ? close : na, style=style.cross, linewidth=3, color=color.fuchsia, transp=0, editable=false)
// plot(crossunder(sma9, sma21) ? close : na, style=cross, linewidth=2, color=black, transp=0, editable=false)
// plotshape(bullMa or bearMa ? close : na, style=shape.diamond, text="MA", location=location.absolute, color=bullMa ? colorLong : colorShort) 

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 
// On daily, settings to ameliorate: K=5 D=4 RSI=19 Stoch=21 Source=Close

// Daily - Stoch Rsi(K=5 D=4 RSI=19 Stoch=21 Source=Close) - Buy below 20 - Sell above 80 - LOKI/BTC 1D @ 25/07/2018 to 18/03/2019
//         RSI(7) - Buy below 30 - sell above 70 and RSI closing below previous close 

// MACD Fast=8 Slow=9 Source=close Signal smoothing=9

[rsiC, kC, dC, lBearCrossC, sBearCrossC, lBullCrossC, sBullCrossC] = get_stoch_rsi_cross(inputRsiSrc)
stochKC          = sma(stoch(close, high, low, inputLengthStoch), inputSmoothK)
stochDC          = sma(stochKC, inputSmoothD)
lBearStochCrossC = crossunder(stochKC, stochDC) and stochDC >= 80
sBearStochCrossC = crossunder(stochKC, stochDC) and stochDC < 80
lBullStochCrossC = crossover(stochKC, stochDC) and stochDC < 20
sBullStochCrossC = crossover(stochKC, stochDC) and stochDC >= 20
srColor          = lBullStochCrossC or sBullStochCrossC or lBullCrossC or sBullCrossC ? (lBullStochCrossC or lBullCrossC ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearStochCrossC or lBearCrossC ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShowC and inputShowStochRsiCrosses and ((timeframe.isintraday and not(timeframe.multiplier == 240 or timeframe.multiplier == 60)) or inputShowOnlyC) and (lBearStochCrossC or sBearStochCrossC or lBullStochCrossC or sBullStochCrossC or lBearCrossC or sBearCrossC or lBullCrossC or sBullCrossC)? close : na, style=shape.circle, text="C", location=location.absolute, color=srColor)

rsi1h   = rsi(inputRsiSrc, inputLengthRsi)
k1h     = security(syminfo.tickerid, "60", sma(stoch(rsi1h, rsi1h, rsi1h, inputLengthStoch), inputSmoothK))
d1h     = security(syminfo.tickerid, "60", sma(k1h, inputSmoothD))
close1h = security(syminfo.tickerid, "60", close)
lBearCross1h = crossunder(k1h, d1h) and d1h >= 80
sBearCross1h = crossunder(k1h, d1h) and d1h < 80
lBullCross1h = crossover(k1h, d1h) and d1h < 20
sBullCross1h = crossover(k1h, d1h) and d1h >= 20
sr1hColor    = lBullCross1h or sBullCross1h ? (lBullCross1h ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCross1h ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1H and inputShowStochRsiCrosses and not inputShowOnlyC and  (lBullCross1h or sBullCross1h or lBearCross1h or sBearCross1h) ? close1h : na, style=shape.circle, text="1h", location=location.absolute, color=sr1hColor)
// plotshape(inputShow1H and inputShowStochRsiCrosses and not inputShowOnlyC and  (lBearStochCross1h or sBearStochCross1h or lBullStochCross1h or sBullStochCross1h or lBullCross1h or sBullCross1h or lBearCross1h or sBearCross1h) ? close1h : na, style=shape.circle, text="1h", location=location.absolute, color=sr1hColor)

rsi4h   = rsi(inputRsiSrc, inputLengthRsi)
k4h     = security(syminfo.tickerid, "240", sma(stoch(rsi4h, rsi4h, rsi4h, inputLengthStoch), inputSmoothK))
d4h     = security(syminfo.tickerid, "240", sma(k4h, inputSmoothD))
close4h = security(syminfo.tickerid, "240", close)
lBearCross4h = crossunder(k4h, d4h) and d4h >= 80
sBearCross4h = crossunder(k4h, d4h) and d4h < 80
lBullCross4h = crossover(k4h, d4h) and d4h < 20
sBullCross4h = crossover(k4h, d4h) and d4h >= 20
sr4hColor    = lBullCross4h or sBullCross4h ? (lBullCross4h ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCross4h ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow4H and inputShowStochRsiCrosses and not inputShowOnlyC and timeframe.isintraday and (lBullCross4h or sBullCross4h or lBearCross4h or sBearCross4h) ? close4h : na, style=shape.circle, text="4h", location=location.absolute, color=sr4hColor)
// plotshape(inputShow4H and inputShowStochRsiCrosses and not inputShowOnlyC and timeframe.isintraday and (lBearStochCross4h or sBearStochCross4h or lBullStochCross4h or sBullStochCross4h or lBullCross4h or sBullCross4h or lBearCross4h or sBearCross4h) ? close4h : na, style=shape.circle, text="4h", location=location.absolute, color=sr4hColor)

rsiD   = rsi(inputRsiSrc, inputLengthRsi)
kD     = security(syminfo.tickerid, "D", sma(stoch(rsiD, rsiD, rsiD, inputLengthStoch), inputSmoothK))
dD     = security(syminfo.tickerid, "D", sma(kD, inputSmoothD))
closeD = security(syminfo.tickerid, "D", close)
lBearCrossD = crossunder(kD, dD) and dD >= 80
sBearCrossD = crossunder(kD, dD) and dD < 80
lBullCrossD = crossover(kD, dD) and dD < 20
sBullCrossD = crossover(kD, dD) and dD >= 20
srDColor    = lBullCrossD or sBullCrossD ? (lBullCrossD ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCrossD ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1D and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossD or sBullCrossD or lBearCrossD or sBearCrossD) ? closeD : na, style=shape.circle, text="D", location=location.absolute, color=srDColor)
// plotshape(inputShow1D and inputShowStochRsiCrosses and not inputShowOnlyC and (lBearStochCrossD or sBearStochCrossD or lBullStochCrossD or sBullStochCrossD or lBullCrossD or sBullCrossD or lBearCrossD or sBearCrossD) ? closeD : na, style=shape.circle, text="D", location=location.absolute, color=srDColor)

rsiW   = rsi(inputRsiSrc, inputLengthRsi)
kW     = security(syminfo.tickerid, "W", sma(stoch(rsiW, rsiW, rsiW, inputLengthStoch), inputSmoothK))
dW     = security(syminfo.tickerid, "W", sma(kW, inputSmoothD))
closeW = security(syminfo.tickerid, "W", close)
lBearCrossW = crossunder(kW, dW) and dW >= 80
sBearCrossW = crossunder(kW, dW) and dW < 80
lBullCrossW = crossover(kW, dW) and dW < 20
sBullCrossW = crossover(kW, dW) and dW >= 20
srWColor    = lBullCrossW or sBullCrossW ? (lBullCrossW ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCrossW ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, style=shape.circle, text="W", location=location.absolute, color=srWColor)
// plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBearStochCrossW or sBearStochCrossW or lBullStochCrossW or sBullStochCrossW or lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, style=shape.circle, text="W", location=location.absolute, color=srWColor)

////////////////////////////////////////////////////////////////////////////////
// Bollinger Bands

basis = sma(inputSrcBB, inputLengthBB)
dev = inputMultBB * stdev(inputSrcBB, inputLengthBB)
upper = basis + dev
lower = basis - dev

plot(inputShowBB ? basis : na, color=color.red)
p1 = plot(inputShowBB ? upper : na, color=color.blue)
p2 = plot(inputShowBB ? lower : na, color=color.blue)
fill(p1, p2)

////////////////////////////////////////////////////////////////////////////////
// Strategy

// MACD Strategy template: 12 26 14 | BTCUSD daily = 31819
// MACD Strategy template: 6 10 20 | BTCUSD daily = 25489
// MACD Strategy template: 1 6 31 | BTCUSD daily = 28189
// Good MACD length to test: 14 - 23 -24    slow length : 7 - 10 / 15 - 17
// MACD Strategy template: 5 6 9 | LINKUSDT 4H = 2055
// MACD Strategy template: 5 6 3 | LINKUSDT 4H = 2050 D = 9600
// MACD Strategy template: 5 6 12 | LINKUSDT D = 12590
// MACD Strategy template: 11 26 19 | LINKUSDT 1h = 3834
// MACD Strategy template: 10 19 19 | LINKUSDT 1h = 3654


// stopLevel = strategy.position_avg_price * (1 - inputStopLoss)

// testPeriodStart = timestamp(2019, 6, 1, 0, 0)

// if (inputEnableStrategy and time >= testPeriodStart)
//     strategy.entry('Long', strategy.long, when=bullCrossMA, stop=ma3)
//     // strategy.entry('Short', strategy.short, when=bearCrossMA)
//     strategy.close('Long', when=bearCrossMA)
//     // strategy.close('Short', when=bullCrossMA)

////////////////////////////////////////////////////////////////////////////////
// Custom alerts

alertcondition(lBearCross1h or lBearCrossC, title='Sell signal', message='Sell signal')
alertcondition(lBullCross1h or lBullCrossC, title='Buy signal', message='Buy signal')
alertcondition(lBullCross1h or lBearCross1h or lBullCrossC or lBearCrossC, title='Buy or sell signal', message='Buy or sell signal')

////////////////////////////////////////////////////////////////////////////////
// Current candle background

diffDKC = dC - kC
diffKDC = kC - dC
isBgColorShown     = ((inputShowOnlyCurrentBar and barstate.isrealtime) or not inputShowOnlyCurrentBar) and inputColorBg
backgroundColorBar = (isBgColorShown and kC <= dC and diffDKC >= 0 and diffDKC <= inputDiff and dC <= 30 and rsiC <= 40) ? color.green :
     (isBgColorShown and kC >= dC and diffKDC >= 0 and diffKDC <= inputDiff and dC >= 70 and rsiC >= 45) ? color.red :
     na

bgcolor(color=backgroundColorBar, transp=80)

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

plot(inputShowSupportResistance ? level1 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level2 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level3 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level4 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level5 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level6 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level7 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level8 : na, style=plot.style_line, show_last=1, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)

////////////////////////////////////////////////////////////////////////////////
// Pivot low

// leftBars = input(5)
// rightBars = input(5)

// pivotHigh = pivothigh(leftBars, rightBars)
// pivotLow = pivotlow(leftBars, rightBars)

// plot(pivot_high, style=cross, linewidth=3, color=colorGreen, offset=-rightBars)
// plot(pivot_lows, style=cross, linewidth=3, color=colorRed, offset=-rightBars)


////////////////////////////////////////////////////////////////////////////////
// Alt szn
// Get symbol for BTC dominance / shorts / longs, total cap 1 and 2, 
// If current === btc, print other infos

// closeBtcD = security('CRYPTOCAP:BTC.D', 60, get_ma(close, inputSma2))
// sma2BtcD = security('CRYPTOCAP:BTC.D', 60, get_ma(close, inputSma2))


