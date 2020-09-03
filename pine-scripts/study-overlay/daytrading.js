//@version=3
study(title="Day trading", shorttitle="Day trading", overlay=true)
// 4H or below

////////////////////////////////////////////////////////////////////////////////
// Inputs

dummy0                             = input(title="//////////////////////////////", type=bool, defval=false)
inputShowSmas                      = input(title="MAs", type=bool, defval=true)
dummy1                             = input(title="//////////////////////////////", type=bool, defval=false)
inputSmoothing                     = input(title="Smoothing", defval="LSMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputAlmaOffset                    = input(title="ALMA Offset", defval=0.85, minval=1)
inputAlmaSigma                     = input(title="ALMA Sigma", defval=6, minval=0)
inputSma1                          = input(title="MA 1", type=integer, defval=9, minval=1)
inputSma2                          = input(title="MA 2", type=integer, defval=21, minval=1)
inputSma3                          = input(title="MA 3", type=integer, defval=50, minval=1)
inputSma4                          = input(title="MA 4", type=integer, defval=100, minval=1)
inputSma5                          = input(title="MA 5", type=integer, defval=200, minval=1)
inputLinewidth                     = input(title="Line width", type=integer, defval=1, minval=1, maxval=5)
inputSmaTransparency               = input(title="MA transparency", type=integer, defval=20, minval=0, maxval=100)
dummy2                             = input(title="//////////////////////////////", type=bool, defval=false)
inputShowStochRsiCrosses           = input(title="Stoch RSI crosses", type=bool, defval=false)
dummy3                             = input(title="//////////////////////////////", type=bool, defval=false)
inputOffsetCross                   = input(title="Crosses offset", defval=0, type=integer)
inputSmoothK                       = input(type=integer, defval=2, minval=1)
inputSmoothD                       = input(type=integer, defval=2, minval=1)
inputLengthRsi                     = input(type=integer, defval=14, minval=1)
inputLengthStoch                   = input(type=integer, defval=14, minval=1)
inputRsiBullTreshold               = input(title="RSI bull treshold", type=integer, defval=40, minval=0, maxval=100)
inputRsiBearTreshold               = input(title="RSI bear treshold", type=integer, defval=45, minval=0, maxval=100)
inputRsiSrc                        = input(title="RSI Source", defval=close)
inputShow1H                        = input(title="1H signal", type=bool, defval=false)
inputShow4H                        = input(title="4H signal", type=bool, defval=true)
inputShow1D                        = input(title="1D signal", type=bool, defval=true)
inputShow1W                        = input(title="1W signal", type=bool, defval=true)
dummy8                             = input(title="//////////////////////////////", type=bool, defval=false)
inputColorBg                       = input(title="Color background", type=bool, defval=true)
dummy9                             = input(title="//////////////////////////////", type=bool, defval=false)
inputDiff                          = input(title="Difference K and D", type=integer, defval=16, minval=0)
inputShowOnlyCurrentBar            = input(title="Color only current bar", type=bool, defval=false)
dummy4                             = input(title="//////////////////////////////", type=bool, defval=false)
inputShowSupportResistance         = input(title="Show support / resistance", type=bool, defval=true)
dummy5                             = input(title="//////////////////////////////", type=bool, defval=false)
inputSupportResistanceTransparency = input(title="Support / resistance transparency", type=integer, defval=0, minval=0, maxval=100)
dummy6                             = input(title="//////////////////////////////", type=bool, defval=false)

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

get_current_data(timeFrame) => security(tickerid, timeFrame, inputRsiSrc)

get_stoch_rsi_cross(rsiSource) => 
    [rsi, k, d] = get_stoch_rsi(rsiSource)
    xlBearCross = crossunder(k, d) and d >= 80 and d <= 100 and rsi >= inputRsiBearTreshold
    lBearCross  = crossunder(k, d) and d >= 80 and d <= 100 and rsi < inputRsiBearTreshold
    mBearCross  = crossunder(k, d) and d > 20 and d < 80 
    sBearCross  = crossunder(k, d) and d >= 0 and d <= 20 and rsi < inputRsiBullTreshold
    xsBearCross = crossunder(k, d) and d >= 0 and d <= 20 and rsi >= inputRsiBullTreshold
    xlBullCross = crossover(k, d) and d >=0 and d <= 25 and rsi <= inputRsiBullTreshold
    lBullCross  = crossover(k, d) and d >=0 and d <= 25 and rsi > inputRsiBullTreshold
    mBullCross  = crossover(k, d) and d > 25 and d < 80
    sBullCross  = crossover(k, d) and d >= 80 and d <= 100 and rsi < inputRsiBearTreshold
    xsBullCross = crossover(k, d) and d >= 80 and d <= 100 and rsi >= inputRsiBearTreshold
    [rsi, k, d, xlBearCross, lBearCross, mBearCross, sBearCross, xsBearCross, xlBullCross, lBullCross, mBullCross, sBullCross, xsBullCross]

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth   = 1
colorBlue   = #00ffff
colorGreen  = #00ff00
colorYellow = #ffeb3b
colorOrange = #ff9800
colorRed    = #f44336

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

plot((close[1] > ma1[1] or close[1] > ma2[1]) and close < ma1 and close < ma2  ? close : na, style=cross, linewidth=3, color=colorRed, transp=0, editable=false)
plot((close[1] < ma1[1] or close[1] < ma2[1]) and close > ma1 and close > ma2 and close < ma4 ? close : na, style=cross, linewidth=3, color=colorGreen, transp=0, editable=false)
// plot(cross(sma1, sma2) ? close : na, style=cross, linewidth=3, color=fuchsia, transp=0, editable=false)
// plot(crossunder(sma9, sma21) ? close : na, style=cross, linewidth=2, color=black, transp=0, editable=false)

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 
// On daily, settings to ameliorate: K=5 D=4 RSI=19 Stoch=21 Source=Close

// Daily - Stoch Rsi(K=5 D=4 RSI=19 Stoch=21 Source=Close) - Buy below 20 - Sell above 80 - LOKI/BTC 1D @ 25/07/2018 to 18/03/2019
//         RSI(7) - Buy below 30 - sell above 70 and RSI closing below previous close 


// symbol1H = get_current_data("1H")
// symbol4H = get_current_data("4H")
// symbol1D = get_current_data("1D")
// symbol1W = get_current_data("1W")

[rsi1H, k1H, d1H, xlBearCross1H, lBearCross1H, mBearCross1H, sBearCross1H, xsBearCross1H, xlBullCross1H, lBullCross1H, mBullCross1H, sBullCross1H, xsBullCross1H] = get_stoch_rsi_cross(inputRsiSrc)

plotshape(inputShowStochRsiCrosses and xlBearCross1H, style=shape.triangledown, text="5", transp=20, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XL sell signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and lBearCross1H, style=shape.triangledown, text="4", transp=20, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="L sell signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and mBearCross1H, style=shape.triangledown, text="3", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="M sell signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and sBearCross1H, style=shape.triangledown, text="2", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="S sell signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and xsBearCross1H, style=shape.triangledown, text="1", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XS sell signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and xlBullCross1H, style=shape.triangleup, text="5", transp=20, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XL buy signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and lBullCross1H, style=shape.triangleup, text="4", transp=20, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="L buy signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and mBullCross1H, style=shape.triangleup, text="3", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="M buy signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and sBullCross1H, style=shape.triangleup, text="2", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="S buy signal Stoch RSI")
plotshape(inputShowStochRsiCrosses and xsBullCross1H, style=shape.triangleup, text="1", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XS buy signal Stoch RSI")

////////////////////////////////////////////////////////////////////////////////
// Current candle background

diffDK1H           = d1H - k1H
diffKD1H           = k1H - d1H
isBgColorShown     = ((inputShowOnlyCurrentBar and barstate.isrealtime) or not inputShowOnlyCurrentBar) and inputColorBg
backgroundColorBar = (isBgColorShown and k1H <= d1H and diffDK1H >= 0 and diffDK1H <= inputDiff and d1H <= 30 and rsi1H <= 40) ? green :
     (isBgColorShown and k1H >= d1H and diffKD1H >= 0 and diffKD1H <= inputDiff and d1H >= 70 and rsi1H >= 45) ? red :
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

plot(inputShowSupportResistance ? level1 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level2 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level3 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level4 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level5 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level6 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level7 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level8 : na, style=line, show_last=1, color=white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
