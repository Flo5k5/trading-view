//@version=4
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
inputLinewidth                     = input(title="Line width", type=input.integer, defval=1, minval=1, maxval=5)
inputSmaTransparency               = input(title="MA transparency", type=input.integer, defval=20, minval=0, maxval=100)
dummy2                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStochRsiCrosses           = input(title="Stoch RSI crosses", type=input.bool, defval=true)
dummy3                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputOffsetCross                   = input(title="Crosses offset", defval=0, type=input.integer)
inputSmoothK                       = input(type=input.integer, defval=2, minval=1)
inputSmoothD                       = input(type=input.integer, defval=3, minval=1)
inputLengthRsi                     = input(type=input.integer, defval=14, minval=1)
inputLengthStoch                   = input(type=input.integer, defval=14, minval=1)
inputRsiBullTreshold               = input(title="RSI bull treshold", type=input.integer, defval=40, minval=0, maxval=100)
inputRsiBearTreshold               = input(title="RSI bear treshold", type=input.integer, defval=45, minval=0, maxval=100)
inputRsiSrc                        = input(title="RSI Source", defval=close)
inputShow1H                        = input(title="1H signal", type=input.bool, defval=false)
inputShow4H                        = input(title="4H signal", type=input.bool, defval=true)
inputShow1D                        = input(title="1D signal", type=input.bool, defval=true)
inputShow1W                        = input(title="1W signal", type=input.bool, defval=true)
dummy8                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputColorBg                       = input(title="Color background", type=input.bool, defval=true)
dummy9                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputDiff                          = input(title="Difference K and D", type=input.integer, defval=16, minval=0)
inputShowOnlyCurrentBar            = input(title="Color only current bar", type=input.bool, defval=false)
dummy4                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSupportResistance         = input(title="Show support / resistance", type=input.bool, defval=true)
dummy5                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputSupportResistanceTransparency = input(title="Support / resistance transparency", type=input.integer, defval=0, minval=0, maxval=100)
dummy6                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowCandlePatterns            = input(title="Show candlestick patterns", type=input.bool, defval=false)
dummy7                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputCandlePatternsTransparency    = input(title="Candlestick patterns transparency", type=input.integer, defval=70, minval=0, maxval=100)

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
    lBearCross = crossunder(k, d) and d >= 75 and d <= 100
    // mBearCross  = crossunder(k, d) and d > 20 and d < 80
    // sBearCross = crossunder(k, d) and d >= 0 and d <= 20
    sBearCross = crossunder(k, d) and d >= 20 and d < 75
    lBullCross = crossover(k, d) and d >=0 and d < 20
    // lBullCross = crossover(k, d) and d >=0 and d <= 20
    // mBullCross  = crossover(k, d) and d > 20 and d < 80
    sBullCross  = crossover(k, d) and d >= 0 and d <= 100
    [rsi, k, d, lBearCross, sBearCross, lBullCross, sBullCross]

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

// plot(cross(sma1, sma2) ? close : na, style=cross, linewidth=3, color=fuchsia, transp=0, editable=false)
// plot(crossunder(sma9, sma21) ? close : na, style=cross, linewidth=2, color=black, transp=0, editable=false)

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 
// On daily, settings to ameliorate: K=5 D=4 RSI=19 Stoch=21 Source=Close

// Daily - Stoch Rsi(K=5 D=4 RSI=19 Stoch=21 Source=Close) - Buy below 20 - Sell above 80 - LOKI/BTC 1D @ 25/07/2018 to 18/03/2019
//         RSI(7) - Buy below 30 - sell above 70 and RSI closing below previous close 

// MACD Fast=8 Slow=9 Source=close Signal smoothing=9

// symbol1H = get_current_data("1H")
symbol4H = get_current_data("4H")
// symbol1D = get_current_data("1D")
// symbol1W = get_current_data("1W")

[rsi1H, k1H, d1H, lBearCross1H, sBearCross1H, lBullCross1H, sBullCross1H] = get_stoch_rsi_cross(inputRsiSrc)

if(inputShowStochRsiCrosses and lBearCross1H)
    label.new(bar_index, close, yloc=yloc.price, style=label.style_circle, text='C', color=color.new(colorRed, 0), textcolor=color.new(colorRed, 0), size=size.auto)

if(inputShowStochRsiCrosses and sBearCross1H)
    label.new(bar_index, close, yloc=yloc.price, style=label.style_circle, text='C', color=color.new(colorRed, 50), textcolor=color.new(colorRed, 50), size=size.auto)


if(inputShowStochRsiCrosses and lBullCross1H)
    label.new(bar_index, close, yloc=yloc.price, style=label.style_circle, text='C', color=color.new(colorGreen, 0),  textcolor=color.new(colorGreen, 0), size=size.auto)

if(inputShowStochRsiCrosses and sBullCross1H)
    label.new(bar_index, close, yloc=yloc.price, style=label.style_circle, text='C', color=color.new(color.green, 50),  textcolor=color.new(color.green, 50), size=size.auto)
    // label.new(bar_index, na, yloc=close > open ? yloc.abovebar : yloc.belowbar, style=label.style_circle, text='C', color=color.new(colorGreen, 70),  textcolor=color.new(colorGreen, 70), size=size.auto)
    // label.new(bar_index, na, yloc=close > open ? yloc.abovebar : yloc.belowbar, style=close > open ? label.style_triangledown : label.style_triangleup, text='C', color=color.new(colorGreen, 60),  textcolor=color.new(colorGreen, 60), size=size.auto)

// plotshape(inputShowStochRsiCrosses and xlBearCross1H, style=shape.triangledown, text="5", transp=20, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XL sell signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and lBearCross1H, style=close > open ? shape.triangledown : shape.triangleup, transp=0, offset=inputOffsetCross, location=close > open ? location.abovebar : location.belowbar, color=colorRed, editable=false, size=size.tiny, title="L sell signal Stoch RSI")
// // // plotshape(inputShowStochRsiCrosses and mBearCross1H, style=shape.triangledown, text="3", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="M sell signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and sBearCross1H, style=close > open ? shape.triangledown : shape.triangleup, transp=60, offset=inputOffsetCross, location=close > open ? location.abovebar : location.belowbar, color=colorRed, editable=false, size=size.tiny, title="S sell signal Stoch RSI")
// // // plotshape(inputShowStochRsiCrosses and xsBearCross1H, style=shape.triangledown, text="1", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XS sell signal Stoch RSI")
// // // plotshape(inputShowStochRsiCrosses and xlBullCross1H, style=shape.triangleup, text="5", transp=20, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XL buy signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and lBullCross1H, style=close > open ? shape.triangledown : shape.triangleup, transp=0, offset=inputOffsetCross, location=close > open ? location.abovebar : location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="L buy signal Stoch RSI")
// // // plotshape(inputShowStochRsiCrosses and mBullCross1H, style=shape.triangleup, text="3", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="M buy signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and sBullCross1H, style=close > open ? shape.triangledown : shape.triangleup, transp=60, offset=inputOffsetCross, location=close > open ? location.abovebar : location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="S buy signal Stoch RSI")
// // plotshape(inputShowStochRsiCrosses and xsBullCross1H, style=shape.triangleup, text="1", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XS buy signal Stoch RSI")

[rsi4H, k4H, d4H, lBearCross4H, sBearCross4H, lBullCross4H, sBullCross4H] = get_stoch_rsi_cross(symbol4H)

// if(inputShowStochRsiCrosses and lBearCross4H)
//     label.new(bar_index, na, yloc=yloc.abovebar, style=label.style_triangledown, text="4h", color=color.new(colorRed, 20), size=size.tiny)

// if(inputShowStochRsiCrosses and sBearCross4H)
//     label.new(bar_index, na, yloc=yloc.abovebar, style=label.style_triangledown, text="4h", color=color.new(colorRed, 70), size=size.tiny)


// if(inputShowStochRsiCrosses and lBullCross4H)
//     label.new(bar_index, na, yloc=yloc.belowbar, style=label.style_triangleup, text="4h", color=color.new(colorGreen, 20), size=size.tiny)

// if(inputShowStochRsiCrosses and sBullCross4H)
//     label.new(bar_index, na, yloc=yloc.belowbar, style=label.style_triangleup, text="4h", color=color.new(colorGreen, 70), size=size.tiny)

// plotshape(inputShowStochRsiCrosses and xlBearCross4H, style=shape.triangledown, text="5", transp=20, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XL sell signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and lBearCross4H, style=shape.triangledown, text="4", transp=20, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="L sell signal Stoch RSI 4H")
// plotshape(inputShowStochRsiCrosses and mBearCross4H, style=shape.triangledown, text="3", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="M sell signal Stoch RSI 4H")
// plotshape(inputShowStochRsiCrosses and sBearCross4H, style=shape.triangledown, text="2", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="S sell signal Stoch RSI 4H")
// plotshape(inputShowStochRsiCrosses and xsBearCross4H, style=shape.triangledown, text="1", transp=70, offset=inputOffsetCross, location=location.abovebar, color=colorRed, editable=false, size=size.tiny, title="XS sell signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and xlBullCross4H, style=shape.triangleup, text="5", transp=20, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XL buy signal Stoch RSI")
// plotshape(inputShowStochRsiCrosses and lBullCross4H, style=shape.triangleup, text="4", transp=20, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="L buy signal Stoch RSI 4H")
// plotshape(inputShowStochRsiCrosses and mBullCross4H, style=shape.triangleup, text="3", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="M buy signal Stoch RSI 4H")
// plotshape(inputShowStochRsiCrosses and sBullCross4H, style=shape.triangleup, text="2", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="S buy signal Stoch RSI 3H")
// plotshape(inputShowStochRsiCrosses and xsBullCross4H, style=shape.triangleup, text="1", transp=70, offset=inputOffsetCross, location=location.belowbar, color=colorGreen, editable=false, size=size.tiny, title="XS buy signal Stoch RSI")

alertcondition(lBearCross1H, title='Sell signal', message='Sell signal')
alertcondition(lBullCross1H, title='Buy signal', message='Buy signal')
alertcondition(lBullCross1H or lBearCross1H, title='Buy or sell signal', message='Buy or sell signal')

////////////////////////////////////////////////////////////////////////////////
// Current candle background

diffDK1H           = d1H - k1H
diffKD1H           = k1H - d1H
isBgColorShown     = ((inputShowOnlyCurrentBar and barstate.isrealtime) or not inputShowOnlyCurrentBar) and inputColorBg
backgroundColorBar = (isBgColorShown and k1H <= d1H and diffDK1H >= 0 and diffDK1H <= inputDiff and d1H <= 30 and rsi1H <= 40) ? color.green :
     (isBgColorShown and k1H >= d1H and diffKD1H >= 0 and diffKD1H <= inputDiff and d1H >= 70 and rsi1H >= 45) ? color.red :
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
// Open High Low HTF
//
// https://www.tradingview.com/script/F8yZU30q-Open-High-Low-HTF/
// 

// holds the price levels
openPriceD = security(syminfo.tickerid, 'D', open)
highPriceD = security(syminfo.tickerid, 'D', high)
lowPriceD = security(syminfo.tickerid, 'D', low)
openPriceW = security(syminfo.tickerid, 'W', open)
highPriceW = security(syminfo.tickerid, 'W', high)
lowPriceW = security(syminfo.tickerid, 'W', low)
// openPriceM = security(syminfo.tickerid, 'M', open)
// highPriceM = security(syminfo.tickerid, 'M', high)
// lowPriceM = security(syminfo.tickerid, 'M', low)


//plot levels
// label.new(bar_index, openPriceD ? openPriceD : na, style=label.style_circle, color=color.new(colorGreen, 70), size=size.auto)
// label.new(bar_index, highPriceD ? highPriceD : na, style=label.style_circle, color=color.new(colorGreen, 70), size=size.auto)
// label.new(bar_index, lowPriceD ? lowPriceD : na, style=label.style_circle, color=color.new(colorRed, 70), size=size.auto)

// label.new(bar_index, openPriceW ? openPriceW : na, style=label.style_cross, color=color.new(colorGreen, 70), size=size.auto)
// label.new(bar_index, highPriceW ? highPriceW : na, style=label.style_cross, color=color.new(colorGreen, 70), size=size.auto)
// label.new(bar_index, lowPriceW ? lowPriceW : na, style=label.style_cross, color=color.new(colorRed, 70), size=size.auto)

plot(openPriceD and not timeframe.isdaily and not timeframe.isweekly ? openPriceD : na, title="Daily Open", style=plot.style_circles, linewidth=1, color=color.orange)
plot(highPriceD and not timeframe.isdaily and not timeframe.isweekly ? highPriceD : na, title="Daily High", style=plot.style_circles, linewidth=1, color=color.orange)
plot(lowPriceD and not timeframe.isdaily and not timeframe.isweekly ? lowPriceD :  na, title="Daily Low",  style=plot.style_circles, linewidth=1, color=color.red)
plot(openPriceW and not timeframe.isweekly ? openPriceW : na, title="Weekly Open", style=plot.style_cross, linewidth=1, color=color.orange)
plot(highPriceW and not timeframe.isweekly ? highPriceW : na, title="Weekly High", style=plot.style_cross, linewidth=1, color=color.orange)
plot(lowPriceW  and not timeframe.isweekly ? lowPriceW :  na, title="Weekly Low",  style=plot.style_cross, linewidth=1, color=color.red)
// plot(openPriceM ? openPriceM : na, title="Monthly Open", style=plot.style_circles, linewidth=3, color=colorGreen)
// plot(highPriceM ? highPriceM : na, title="Monthly High", style=plot.style_circles, linewidth=3, color=colorGreen)
// plot(lowPriceM  ? lowPriceM :  na, title="Monthly Low",  style=plot.style_circles, linewidth=3, color=colorRed)

////////////////////////////////////////////////////////////////////////////////
// https://www.tradingview.com/script/GbM6d1PJ-Separate-Volume-Indicator/
// https://www.tradingview.com/script/LfVJhuir-Indicators-Better-Volume-Indicator-InstrumentVolume/
// https://www.tradingview.com/script/EHTKtnIt-ST-Volume-Flow-v6/
// https://www.tradingview.com/script/LgRTt6b8-Smart-Volume/
// https://www.tradingview.com/script/w7hKpwnr-Support-and-Resistance-Levels-with-auto-Fibonacci/
// https://backtest-rookies.com/2017/08/17/tradingview-multi-smas-indicator/
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Candlestick Patterns Scanner
// Created by Nicolas
// https://uk.tradingview.com/script/BKZAyV88-Candlestick-Scanner/

// Variables
// body         = close-open
// range        = high-low
// middle       = (open+close)/2
// abody        = abs(body)
// ratio        = abody/range
// longcandle   = (ratio>0.6)
// bodytop      = max(open, close)
// bodybottom   = min(open, close)
// shadowtop    = high-bodytop
// shadowbottom = bodybottom-low

// // Doji
// dojiSize     = input(0.05, type=float, minval=0.01, title="Doji size")
// data         = (abs(open - close) <= (high - low) * dojiSize)
// plotchar(inputShowCandlePatterns and data, title="Doji", text='Doji', color=black)

/////////////// Bullish Signals ///////////////

// // Morning Star
// morningStar = (inputShowCandlePatterns and body[2]<0 and body>0 and longcandle[2] and open[1]<close[2] and open>close[1] and ratio[1]<0.3 and abody[1]<abody[2] and abody[1]<abody and low[1]<low and low[1]<low[2] and high[1]<open[2] and high[1]<close)
// plotshape(morningStar,  title= "Morning Star", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Morning\nStar", transp=inputCandlePatternsTransparency)

// // Abandoned Baby Bottom
// abandonedBabyBottom = (inputShowCandlePatterns and body[2]<0 and body>0 and longcandle[2] and ratio[1]<0.3 and high[1]<low[2] and high[1]<low)
// plotshape(abandonedBabyBottom,  title= "Abandoned Baby Bottom", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Abandoned\nBaby\nBottom", transp=inputCandlePatternsTransparency)

// // Bullish Harami
// bullishHarami = (inputShowCandlePatterns and body[1]<0 and body>0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1])
// plotshape(bullishHarami,  title= "Bullish Harami", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nHarami", transp=inputCandlePatternsTransparency)

// // Bullish Engulfing
// bullishEngulfing = (inputShowCandlePatterns and body[1]<0 and body>0 and bodybottom<bodybottom[1] and bodytop>bodytop[1] and longcandle)
// plotshape(bullishEngulfing, title= "Bullish Engulfing", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nEngulfing", transp=inputCandlePatternsTransparency)

// // Three Inside Up
// threeInsideUp = (inputShowCandlePatterns and body[2]<0 and body[1]>0 and body>0 and bullishHarami[1] and close>close[1])
// plotshape(threeInsideUp,  title= "Three Inside Up", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Three\nInside\nUp", transp=inputCandlePatternsTransparency)

// // Piercing Line
// piercingLine = (inputShowCandlePatterns and body[1]<0 and body>0 and longcandle[1] and longcandle and open<low[1] and close>middle[1] and close<open[1])
// plotshape(piercingLine, title= "Piercing Line", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Piercing\nLine", transp=inputCandlePatternsTransparency)

// // Three Outside Up
// threeOutsideUp = (inputShowCandlePatterns and body[2]<0 and body[1]>0 and body>0 and bullishEngulfing[1] and close>close[1])
// plotshape(threeOutsideUp, title= "Three Outside Up", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Three\nOutside\nUp", transp=inputCandlePatternsTransparency)

// // Three White Soldiers
// ThreeWhiteSoldiers = (inputShowCandlePatterns and body[2]>0 and body[1]>0 and body>0 and high[1]>high[2] and high>high[1] and close[1]>close[2] and close>close[1] and open[1]>open[2] and open[1]<close[2] and open>open[1] and open<close[1])
// plotshape(ThreeWhiteSoldiers, title= "Three White Soldiers", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Three\nWhite\nSoldiers", transp=inputCandlePatternsTransparency)

// // Homing Pigeon
// HomingPigeon = (inputShowCandlePatterns and body[1]<0 and body<0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1])
// plotshape(HomingPigeon, title= "Homing Pigeon", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Homing\nPigeon", transp=inputCandlePatternsTransparency)

// // Dragonfly Doji Bottom
// DragonflyDojiBottom = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and low<low[1] and shadowbottom>3*abody and shadowtop<shadowbottom/3)
// plotshape(DragonflyDojiBottom, title= "Dragonfly Doji Bottom", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Dragonfly\nDoji\nBottom", transp=inputCandlePatternsTransparency)

// //Concealing Baby Swallow
// ConcealingBabySwallow = (inputShowCandlePatterns and body[3]<0 and body[2]<0 and body[1]<0 and body<0 and ratio[3]>0.8 and ratio[2]>0.8 and ratio>0.8 and open[1]<close[2] and high[1]>close[2] and shadowtop[1]>0.6*(abody[1]+shadowbottom[1]) and bodybottom<bodybottom[1] and bodytop>high[1])
// plotshape(ConcealingBabySwallow, title= "Concealing Baby Swallow", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Concealing\nBaby\nSwallow", transp=inputCandlePatternsTransparency)

// // Gravestone Doji Bottom
// GravestoneDojiBottom = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and low<low[1] and shadowtop>3*abody and shadowbottom<shadowtop/3)
// plotshape(GravestoneDojiBottom, title= "Gravestone Doji Bottom", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Gravestone\nDoji\nBottom", transp=inputCandlePatternsTransparency)

// //Last Engulfing Bottom
// LastEngulfingBottom = (inputShowCandlePatterns and body[1]>0 and body<0 and bodybottom<bodybottom[1] and bodytop>bodytop[1] and longcandle)
// plotshape(LastEngulfingBottom, title= "Last Engulfing Bottom", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Last\nEngulfing\nBottom", transp=inputCandlePatternsTransparency)

// // Bullish Harami Cross
// bullishHaramiCross = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1] and ratio<0.3 and range<0.3*range[1])
// plotshape(bullishHaramiCross, title= "Bullish Harami Cross", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nHarami\nCross", transp=inputCandlePatternsTransparency)

// //Three Stars in the South
// ThreeStarsInTheSouth = (inputShowCandlePatterns and body[2]<0 and body[1]<0 and body<0 and shadowtop[2]<range[2]/4 and shadowbottom[2]>abody[2]/2 and low[1]>low[2] and high[1]<high[2] and abody[1]<abody[2]  and shadowtop[1]<range[1]/4 and shadowbottom[1]>abody[1]/2 and low>low[1] and high<high[1] and abody<abody[1] and shadowtop<range/4 and shadowbottom<range/4)
// plotshape(ThreeStarsInTheSouth, title= "Three Stars In TheSouth", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Three\nStars\nIn\nThe\nSouth", transp=inputCandlePatternsTransparency)

// //Bullish Breakaway
// BullishBreakaway = (inputShowCandlePatterns and body[4]<0 and body[3]<0 and body>0 and open[3]<close[4] and close[2]<close[3] and close[1]<close[2] and longcandle and close<close[4] and close>open[3])
// plotshape(BullishBreakaway, title= "Bullish Breakaway", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nBreakaway", transp=inputCandlePatternsTransparency)

// // Hammer
// Hammer = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and low<low[1] and shadowbottom>2*abody and shadowtop<0.3*abody)
// plotshape(Hammer, title= "Hammer", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Hammer", transp=inputCandlePatternsTransparency)

// // Inverted Hammer
// InvertedHammer = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and low<low[1] and shadowtop>2*abody and shadowbottom<0.3*abody)
// plotshape(InvertedHammer, title= "Inverted Hammer", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Inverted\nHammer", transp=inputCandlePatternsTransparency)

// // Rising Three Methods
// RisingThreeMethods = (inputShowCandlePatterns and body[4]>0 and body[3]<0 and body[1]<0 and body>0 and longcandle[4] and longcandle and close[2]<close[3] and close[1]<close[2] and high[2]<high[3] and high[1]<high[2] and low[1]>low[4] and open>close[1] and close>high[4] and close>high[3] and close>high[2] and close>high[1])
// plotshape(RisingThreeMethods, title= "Rising Three Methods", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Rising\nThree\nMethods", transp=inputCandlePatternsTransparency)

// // BullishThreeLineStrike
// BullishThreeLineStrike = (inputShowCandlePatterns and body[3]>0 and body[2]>0 and body[1]>0 and body<0 and longcandle[3] and longcandle[2] and longcandle[1] and close[2]>close[3] and close[1]>close[2] and open>close[1] and close<open[3])
// plotshape(BullishThreeLineStrike, title= "Bullish Three Line Strike", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nThreeLine\nStrike", transp=inputCandlePatternsTransparency)

// // Bullish Mat Hold
// BullishMatHold = (inputShowCandlePatterns and body[4]>0 and body[3]<0 and body[1]<0 and body>0 and longcandle[4] and close[3]>close[4] and close[2]<close[3] and close[1]<close[2] and high[2]<high[3] and high[1]<high[2] and low[1]>low[4] and open>close[1] and close>high[4] and  close>high[3] and close>high[2] and close>high[1])
// plotshape(BullishMatHold, title= "Bullish Mat Hold", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Bullish\nMat\nHold", transp=inputCandlePatternsTransparency)

// // Doji Star Bottom
// DojiStarBottom = (inputShowCandlePatterns and body[1]<0 and longcandle[1] and low<low[1] and open<close[1] and ratio<0.3 and range<0.3*range[1])
// plotshape(DojiStarBottom, title= "Doji Star Bottom", location=location.belowbar, color=colorGreen, style=shape.arrowup, text="Doji\nStar\nBottom", transp=inputCandlePatternsTransparency)


// /////////////// Bearish Signals ///////////////

// // Evening Star
// EveningStar = (inputShowCandlePatterns and body[2]>0 and body<0 and longcandle[2] and open[1]>close[2] and open<close[1] and ratio[1]<0.3 and abody[1]<abody[2] and abody[1]<abody and high[1]>high and high[1]>high[2] and low[1]>open[2] and low[1]>close)
// plotshape(EveningStar, title= "Evening Star", color=colorRed, style=shape.arrowdown, text="Evening\nStar", transp=inputCandlePatternsTransparency)

// // Dark Cloud Cover
// DarkCloudCover = (inputShowCandlePatterns and body[1]>0 and body<0 and longcandle[1] and longcandle and open>high[1] and close<middle[1] and close>open[1])
// plotshape(DarkCloudCover, title= "Dark Cloud Cover", color=colorRed, style=shape.arrowdown, text="Dark\nCloud\nCover", transp=inputCandlePatternsTransparency)

// // Abandoned Baby Top
// AbandonedBabyTop = (inputShowCandlePatterns and body[2]>0 and body<0 and longcandle[2] and ratio[1]<0.3 and low[1]>high[2] and low[1]>high)
// plotshape(AbandonedBabyTop, title= "Abandoned Baby Top", color=colorRed, style=shape.arrowdown, text="Abandoned\nBaby\nTop", transp=inputCandlePatternsTransparency)

// // Bearish Harami
// BearishHarami = (inputShowCandlePatterns and body[1]>0 and body<0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1])
// plotshape(BearishHarami, title= "Bearish Harami", color=colorRed, style=shape.arrowdown, text="Bearish\nHarami", transp=inputCandlePatternsTransparency)

// // Descending Hawk
// DescendingHawk = (inputShowCandlePatterns and body[1]>0 and body>0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1])
// plotshape(DescendingHawk, title= "Descending Hawk", color=colorRed, style=shape.arrowdown, text="Descending\nHawk", transp=inputCandlePatternsTransparency)

// // Bearish Engulfing
// BearishEngulfing = (inputShowCandlePatterns and body[1]>0 and body<0 and bodybottom<bodybottom[1] and bodytop>bodytop[1] and longcandle)
// plotshape(BearishEngulfing, title= "Bearish Engulfing", color=colorRed, style=shape.arrowdown, text="Bearish\nEngulfing", transp=inputCandlePatternsTransparency)

// // Gravestone Doji Top
// GravestoneDojiTop = (inputShowCandlePatterns and body[1]>0 and longcandle[1] and high>high[1] and shadowtop>3*abody and shadowbottom<shadowtop/3)
// plotshape(GravestoneDojiTop, title= "Gravestone Doji Top", color=colorRed, style=shape.arrowdown, text="Gravestone\nDoji\nTop", transp=inputCandlePatternsTransparency)

// // Shooting Star
// ShootingStar = (inputShowCandlePatterns and body[1]>0 and longcandle[1] and high>high[1] and shadowtop>2*abody and shadowbottom<0.3*abody)
// plotshape(ShootingStar, title= "Shooting Star", color=colorRed, style=shape.arrowdown, text="Shooting\nStar", transp=inputCandlePatternsTransparency)

// // Hanging Man
// HangingMan = (inputShowCandlePatterns and body[1]>0 and longcandle[1] and high>high[1] and shadowbottom>2*abody and shadowtop<0.3*abody)
// plotshape(HangingMan, title= "Hanging Man", color=colorRed, style=shape.arrowdown, text="Hanging\nMan", transp=inputCandlePatternsTransparency)

// // Bearish Three Line Strike
// BearishThreeLineStrike = (inputShowCandlePatterns and body[3]<0 and body[2]<0 and body[1]<0 and body>0 and longcandle[3] and longcandle[2] and longcandle[1] and close[2]<close[3] and close[1]<close[2] and open<close[1] and close>open[3])
// plotshape(BearishThreeLineStrike, title= "Bearish Three Line Strike", color=colorRed, style=shape.arrowdown, text="Bearish\nThree\nLine\nStrike", transp=inputCandlePatternsTransparency)

// // Falling Three Methods
// FallingThreeMethods = (inputShowCandlePatterns and body[4]<0 and body[3]>0 and body[1]>0 and body<0 and longcandle[4] and longcandle and close[2]>close[3] and close[1]>close[2] and low[2]>low[3] and low[1]>low[2] and high[1]<high[4] and open<close[1] and close<low[4] and close<low[3] and close<low[2] and close<low[1])
// plotshape(FallingThreeMethods, title= "Falling Three Methods", color=colorRed, style=shape.arrowdown, text="Falling\n\nThreeMethods", transp=inputCandlePatternsTransparency)

// // Three Inside Down
// ThreeInsideDown = (inputShowCandlePatterns and body[2]>0 and body[1]<0 and body<0 and BearishHarami[1] and close<close[1])
// plotshape(ThreeInsideDown, title= "Three Inside Down", color=colorRed, style=shape.arrowdown, text="Three\nInside\nDown", transp=inputCandlePatternsTransparency)

// // Three Outside Down
// ThreeOutsideDown = (inputShowCandlePatterns and body[2]>0 and body[1]<0 and body<0 and BearishEngulfing[1] and close<close[1])
// plotshape(ThreeOutsideDown, title= "Three Outside Down", color=colorRed, style=shape.arrowdown, text="Three\nOutside\nDown", transp=inputCandlePatternsTransparency)

// // Three Black Crows
// ThreeBlackCrows = (inputShowCandlePatterns and body[2]<0 and body[1]<0 and body<0 and longcandle[2] and longcandle[1] and longcandle and low[1]<low[2] and low<low[1] and close[1]<close[2] and close<close[1] and open[1]<open[2] and open[1]>close[2] and open<open[1] and open>close[1])
// plotshape(ThreeBlackCrows, title= "Three Black Crows", color=colorRed, style=shape.arrowdown, text="Three\nBlack\nCrows", transp=inputCandlePatternsTransparency)

// // Upside Gap Two Crows
// UpsideGapTwoCrows = (inputShowCandlePatterns and body[2]>0 and body[1]<0 and body<0 and longcandle[2] and open[1]>close[2] and bodytop>bodytop[1] and bodybottom<bodybottom[1] and close>close[2])
// plotshape(UpsideGapTwoCrows, title= "Upside Gap Two Crows", color=colorRed, style=shape.arrowdown, text="Upside\nGap\nTwo\nCrows", transp=inputCandlePatternsTransparency)

// // Last Engulfing Top
// LastEngulfingTop = (inputShowCandlePatterns and body[1]<0 and body>0 and bodybottom<bodybottom[1] and bodytop>bodytop[1] and longcandle)
// plotshape(LastEngulfingTop, title= "Last Engulfing Top", color=colorRed, style=shape.arrowdown, text="Last\nEngulfing\nTop", transp=inputCandlePatternsTransparency)

// // Dragonfly Doji Top
// DragonflyDojiTop = (inputShowCandlePatterns and body[1]>0 and longcandle[1] and high>high[1] and shadowbottom>3*abody and shadowtop<shadowbottom/3)
// plotshape(DragonflyDojiTop, title= "Dragonfly Doji Top", color=colorRed, style=shape.arrowdown, text="Dragonfly\nDoji\nTop", transp=inputCandlePatternsTransparency)

// // Bearish Harami Cross
// BearishHaramiCross = (inputShowCandlePatterns and body[1]>0 and longcandle[1] and bodybottom>bodybottom[1] and bodytop<bodytop[1] and ratio<0.3 and range<0.3*range[1])
// plotshape(BearishHaramiCross, title= "Bearish Harami Cross", color=colorRed, style=shape.arrowdown, text="Bearish\nHarami\nCross", transp=inputCandlePatternsTransparency)

// // Advance Block
// AdvanceBlock = (inputShowCandlePatterns and body[2]>0 and body[1]>0 and body>0 and high[2]<high[1] and high[1]<high and open[1]>bodybottom[2] and open[1]<bodytop[2] and open>bodybottom[1] and open<bodytop[1] and abody[1]<abody[2] and abody<abody[1])
// plotshape(AdvanceBlock, title= "Advance Block", color=colorRed, style=shape.arrowdown, text="Advance\nBlock", transp=inputCandlePatternsTransparency)

// // Bearish Breakaway
// BearishBreakaway = (inputShowCandlePatterns and body[4]>0 and body[3]>0 and body<0 and open[3]>close[4] and close[2]>close[3] and close[1]>close[2] and longcandle and close>close[4] and close<open[3])
// plotshape(BearishBreakaway, title="Bearish Breakaway", color=colorRed, style=shape.arrowdown, text="Bearish\nBreakaway", transp=inputCandlePatternsTransparency)

// // Two Crows

// TwoCrows = (inputShowCandlePatterns and body[2]>0 and body[1]<0 and body<0 and longcandle[2] and open[1]>close[2] and close[1]>close[2] and open<bodytop[1] and open>bodybottom[1] and close<bodytop[2] and close>bodybottom[2])
// plotshape(TwoCrows, title="Two Crows", color=colorRed, style=shape.arrowdown, text="Two\nCrows", transp=inputCandlePatternsTransparency)

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

