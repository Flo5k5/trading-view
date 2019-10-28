//@version=4
study(title="Indicators Bundle", shorttitle="Indicators Bundle", overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Functions

getMa(src, length, maType, almaOffset, almaSigma) => 
    if maType == "RMA" 
        rma(src, length)
    else
        if maType == "SMA" 
            sma(src, length)
        else
            if maType == "EMA"
                ema(src, length)
            else
                if maType == "WMA" 
                    wma(src, length)
                else
                    if maType == "VWMA"
                        vwma(src, length)
                    else
                        if maType == "SMMA" 
                            (na(src[1]) ? sma(src, length) : (src[1] * (length - 1) + src) / length)
                        else
                            if maType == "HullMA"
                                (wma(2 * wma(src, length / 2) - wma(src, length), round(sqrt(length))))
                            else 
                                if maType == "LSMA" 
                                    alma(src, length, almaOffset, almaSigma)
                                else
                                    if maType == "DEMA"
                                        e1 = ema(src, length)
                                        e2 = ema(e1, length)
                                        2 * e1 - e2
                                    else
                                        if maType == "TEMA"
                                            ema1 = ema(src, length)
                                            ema2 = ema(ema1, length)
                                            ema3 = ema(ema2, length)
                                            3 * (ema1 - ema2) + ema3
                                        else
                                            src

getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    rsi = rsi(rsiSource, rsiLength)
    k   = sma(stoch(rsi, rsi, rsi, lengthStoch), smoothK)
    d   = sma(k, smoothD)
    [rsi, k, d]

getStochRsiCross(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) => 
    [rsi, k, d] = getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD)
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

dummy0               = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSmas        = input(title="MAs", type=input.bool, defval=true)
dummy01              = input(title=" ", type=input.bool, defval=false)
inputMa1             = input(title="MA 1", type=input.integer, defval=9, minval=0)
inputSmoothingMa1    = input(title="Smoothing MA1", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputShowMa1         = input(title="Show MA 1", type=input.bool, defval=true)
dummy02              = input(title=" ", type=input.bool, defval=false)
inputMa2             = input(title="MA 2", type=input.integer, defval=21, minval=0)
inputSmoothingMa2    = input(title="Smoothing MA2", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputShowMa2         = input(title="Show MA 2", type=input.bool, defval=true)
dummy03              = input(title=" ", type=input.bool, defval=false)
inputMa3             = input(title="MA 3", type=input.integer, defval=50, minval=0)
inputSmoothingMa3    = input(title="Smoothing MA3", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputShowMa3         = input(title="Show MA 3", type=input.bool, defval=true)
dummy04              = input(title=" ", type=input.bool, defval=false)
inputMa4             = input(title="MA 4", type=input.integer, defval=100, minval=0)
inputSmoothingMa4    = input(title="Smoothing MA4", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputShowMa4         = input(title="Show MA 4", type=input.bool, defval=true)
dummy05              = input(title=" ", type=input.bool, defval=false)
inputMa5             = input(title="MA 5", type=input.integer, defval=200, minval=0)
inputSmoothingMa5    = input(title="Smoothing MA5", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])
inputShowMa5         = input(title="Show MA 5", type=input.bool, defval=true)
dummy06              = input(title=" ", type=input.bool, defval=false)
inputLinewidth       = input(title="Line width", type=input.integer, defval=2, minval=1, maxval=5)
inputSmaTransparency = input(title="MA transparency", type=input.integer, defval=20, minval=0, maxval=100)
inputAlmaOffset      = input(title="ALMA Offset", defval=0.85, minval=1)
inputAlmaSigma       = input(title="ALMA Sigma", defval=6, minval=0)

ma1 = getMa(close, inputMa1, inputSmoothingMa1, inputAlmaOffset, inputAlmaSigma)
ma2 = getMa(close, inputMa2, inputSmoothingMa2, inputAlmaOffset, inputAlmaSigma)
ma3 = getMa(close, inputMa3, inputSmoothingMa3, inputAlmaOffset, inputAlmaSigma)
ma4 = getMa(close, inputMa4, inputSmoothingMa4, inputAlmaOffset, inputAlmaSigma)
ma5 = getMa(close, inputMa5, inputSmoothingMa5, inputAlmaOffset, inputAlmaSigma)

plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 1")
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=colorGreen, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 2")
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=colorYellow, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 3")
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=colorOrange, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 4")
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=colorRed, linewidth=inputLinewidth, transp=inputSmaTransparency, title="MA 5")

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 

dummy3                   = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowStochRsiCrosses = input(title="MTF Stoch RSI crosses", type=input.bool, defval=true)
dummy31                  = input(title=" ", type=input.bool, defval=false)
inputOffsetCross         = input(title="Crosses offset", defval=0, type=input.integer)
inputLengthRsi           = input(type=input.integer, title="RSI Length", defval=14, minval=1)
inputLengthStoch         = input(type=input.integer, title="Stoch Length", defval=14, minval=1)
inputSmoothK             = input(type=input.integer, title="Smooth K", defval=3, minval=1)
inputSmoothD             = input(type=input.integer, title="Smooth D", defval=3, minval=1)
inputRsiSrc              = input(title="RSI Source", defval=close)
dummy32                  = input(title=" ", type=input.bool, defval=false)
inputShowOnlyC           = input(title="Show only current TF", type=input.bool, defval=true)
inputShowC               = input(title="Show current TF", type=input.bool, defval=true)
inputShow1H              = input(title="Show 1h", type=input.bool, defval=true)
inputShow4H              = input(title="Show 4h", type=input.bool, defval=true)
inputShow1D              = input(title="Show D", type=input.bool, defval=true)
inputShow1W              = input(title="Show W", type=input.bool, defval=true)

[rsiC, kC, dC, lBearCrossC, sBearCrossC, lBullCrossC, sBullCrossC] = getStochRsiCross(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)
stochKC          = sma(stoch(close, high, low, inputLengthStoch), inputSmoothK)
stochDC          = sma(stochKC, inputSmoothD)
lBearStochCrossC = crossunder(stochKC, stochDC) and stochDC >= 80
sBearStochCrossC = crossunder(stochKC, stochDC) and stochDC < 80
lBullStochCrossC = crossover(stochKC, stochDC) and stochDC < 20
sBullStochCrossC = crossover(stochKC, stochDC) and stochDC >= 20
srColor          = lBullStochCrossC or sBullStochCrossC or lBullCrossC or sBullCrossC ? (lBullStochCrossC or lBullCrossC ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearStochCrossC or lBearCrossC ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShowC and inputShowStochRsiCrosses and ((timeframe.isintraday and not(timeframe.multiplier == 240 or timeframe.multiplier == 60)) or inputShowOnlyC) and (lBearStochCrossC or sBearStochCrossC or lBullStochCrossC or sBullStochCrossC or lBearCrossC or sBearCrossC or lBullCrossC or sBullCrossC)? close : na,  title="Cross Stoch RSI Current TF", style=shape.circle, text="", location=location.absolute, color=srColor)

rsi1h   = rsi(inputRsiSrc, inputLengthRsi)
k1h     = security(syminfo.tickerid, "60", sma(stoch(rsi1h, rsi1h, rsi1h, inputLengthStoch), inputSmoothK))
d1h     = security(syminfo.tickerid, "60", sma(k1h, inputSmoothD))
close1h = security(syminfo.tickerid, "60", close)
lBearCross1h = crossunder(k1h, d1h) and d1h >= 80
sBearCross1h = crossunder(k1h, d1h) and d1h < 80
lBullCross1h = crossover(k1h, d1h) and d1h < 20
sBullCross1h = crossover(k1h, d1h) and d1h >= 20
sr1hColor    = lBullCross1h or sBullCross1h ? (lBullCross1h ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCross1h ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1H and inputShowStochRsiCrosses and not inputShowOnlyC and  (lBullCross1h or sBullCross1h or lBearCross1h or sBearCross1h) ? close1h : na,  title="Cross Stoch RSI 1h", style=shape.circle, text="1h", location=location.absolute, color=sr1hColor)
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
plotshape(inputShow4H and inputShowStochRsiCrosses and not inputShowOnlyC and timeframe.isintraday and (lBullCross4h or sBullCross4h or lBearCross4h or sBearCross4h) ? close4h : na,  title="Cross Stoch RSI 4h", style=shape.circle, text="4h", location=location.absolute, color=sr4hColor)
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
plotshape(inputShow1D and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossD or sBullCrossD or lBearCrossD or sBearCrossD) ? closeD : na, title="Cross Stoch RSI D", style=shape.circle, text="D", location=location.absolute, color=srDColor)
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
plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, title="Cross Stoch RSI W", style=shape.circle, text="W", location=location.absolute, color=srWColor)
// plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBearStochCrossW or sBearStochCrossW or lBullStochCrossW or sBullStochCrossW or lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, style=shape.circle, text="W", location=location.absolute, color=srWColor)

////////////////////////////////////////////////////////////////////////////////
// Bollinger Bands

dummy2           = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowBB      = input(title="Bollinger Bands", type=input.bool, defval=false)
dummy21          = input(title=" ", type=input.bool, defval=false)
inputLengthBB    = input(20, title="MA Length", minval=1)
inputSrcBB       = input(close, title="Source")
inputMultBB1     = input(2.0, title="Primary deviation", minval=0.001, maxval=50)
inputMultBB2     = input(1.0, title="Secondary deviation", minval=0.001, maxval=50)
inputShowMultBB2 = input(title="Show second Mult", type=input.bool, defval=true)

basis  = sma(inputSrcBB, inputLengthBB)
dev1   = inputMultBB1 * stdev(inputSrcBB, inputLengthBB)
upper1 = basis + dev1
lower1 = basis - dev1
dev2   = inputMultBB2 * stdev(inputSrcBB, inputLengthBB)
upper2 = basis + dev2
lower2 = basis - dev2

plot(inputShowBB ? basis : na, title="Bollinger moving average", color=color.red)
p1Dev1 = plot(inputShowBB ? upper1 : na, title="Upper bollinger band primary deviation", color=color.blue, linewidth=2, transp=70)
p2Dev1 = plot(inputShowBB ? lower1 : na, title="Lower bollinger band primary deviation", color=color.blue, linewidth=2, transp=70)
p1Dev2 = plot(inputShowBB and inputShowMultBB2 ? upper2 : na, title="Upper bollinger band secondary deviation", color=color.blue, linewidth=2, transp=70)
p2Dev2 = plot(inputShowBB and inputShowMultBB2 ? lower2 : na, title="Lower bollinger band secondary deviation", color=color.blue, linewidth=2, transp=70)
fill(p1Dev1, p2Dev1, title="Bollinger bands background color", transp=95)

////////////////////////////////////////////////////////////////////////////////
// SAR

dummy1            = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSar      = input(title="SAR", type=input.bool, defval=false)
dummy11           = input(title=" ", type=input.bool, defval=false)
inputStartSar     = input(0.2, title="Start", minval=0.1)
inputIncSar       = input(0.2, title="Increment", minval=0.1)
inputMaxSar       = input(0.2, title="Maximum", minval=0.1)
inputLineWidthSar = input(title="Line width", type=input.integer, defval=2, minval=1, maxval=5)

sarValue = sar(inputStartSar, inputIncSar, inputMaxSar)
plot(inputShowSar ? sarValue : na, style=plot.style_cross, linewidth=inputLineWidthSar, color=sarValue <= low ? colorGreen : colorRed )

////////////////////////////////////////////////////////////////////////////////
// Custom alerts

alertcondition(lBearCross1h or lBearCrossC, title='Sell signal', message='Sell signal')
alertcondition(lBullCross1h or lBullCrossC, title='Buy signal', message='Buy signal')
alertcondition(lBullCross1h or lBearCross1h or lBullCrossC or lBearCrossC, title='Buy or sell signal', message='Buy or sell signal')

////////////////////////////////////////////////////////////////////////////////
// Current candle background

dummy4                  = input(title="//////////////////////////////", type=input.bool, defval=false)
inputColorBg            = input(title="Color background", type=input.bool, defval=true)
dummy41                 = input(title=" ", type=input.bool, defval=false)
inputDiff               = input(title="Difference between Stoch RSI K and D", type=input.integer, defval=16, minval=0)
inputShowOnlyCurrentBar = input(title="Color only current bar", type=input.bool, defval=true)

diffDKC = dC - kC
diffKDC = kC - dC
isBgColorShown     = ((inputShowOnlyCurrentBar and barstate.isrealtime) or not inputShowOnlyCurrentBar) and inputColorBg
backgroundColorBar = (isBgColorShown and kC <= dC and diffDKC >= 0 and diffDKC <= inputDiff and dC <= 30 and rsiC <= 40) ? color.green :
     (isBgColorShown and kC >= dC and diffKDC >= 0 and diffKDC <= inputDiff and dC >= 70 and rsiC >= 45) ? color.red :
     na

bgcolor(color=backgroundColorBar, title="Background color (stoch RSI K and D difference)", transp=90)

////////////////////////////////////////////////////////////////////////////////
// Support / Resistance
//
// https://backtest-rookies.com/2018/10/05/tradingview-support-and-resistance-indicator/
//

dummy5                             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowSupportResistance         = input(title="Support / resistance", type=input.bool, defval=true)
dummy51                            = input(title=" ", type=input.bool, defval=false)
inputSupportResistanceTransparency = input(title="Support / resistance transparency", type=input.integer, defval=0, minval=0, maxval=100)

left = 5
right = 5
quickRight = 3 // Used to try and detect a more recent significant swing.
 
pivotHigh = pivothigh(high,left,right)
pivotLows = pivotlow(low, left,right)
 
quickPivotHigh = pivothigh(high,left,quickRight)
quickPivotLows = pivotlow(low, left,quickRight)
 
level1 = valuewhen(quickPivotHigh, high[quickRight], 0)
level2 = valuewhen(quickPivotLows, low[quickRight], 0)
level3 = valuewhen(pivotHigh, high[right], 0)
level4 = valuewhen(pivotLows, low[right], 0)
level5 = valuewhen(pivotHigh, high[right], 1)
level6 = valuewhen(pivotLows, low[right], 1)
level7 = valuewhen(pivotHigh, high[right], 2)
level8 = valuewhen(pivotLows, low[right], 2)

plot(inputShowSupportResistance ? level1 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level2 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level3 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level4 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level5 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level6 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level7 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)
plot(inputShowSupportResistance ? level8 : na, style=plot.style_line, show_last=1, trackprice=true, color=color.white, trackprice=true, editable=false, transp=inputSupportResistanceTransparency)

////////////////////////////////////////////////////////////////////////////////
// Open High Low Close HTF
//
// https://www.tradingview.com/script/F8yZU30q-Open-High-Low-HTF/
// 

dummy6                       = input(title="//////////////////////////////", type=input.bool, defval=false)
inputShowOhlcHtf             = input(title="OHLC HTF", type=input.bool, defval=false)
dummy61                      = input(title=" ", type=input.bool, defval=false)
inputShowOhlcHtfDailyOpen    = input(title="Daily open", type=input.bool, defval=true)
inputShowOhlcHtfDailyHigh    = input(title="Daily high", type=input.bool, defval=true)
inputShowOhlcHtfDailyLow     = input(title="Daily low", type=input.bool, defval=true)
inputShowOhlcHtfDailyClose   = input(title="Daily close", type=input.bool, defval=true)
dummy62                      = input(title=" ", type=input.bool, defval=false)
inputShowOhlcHtfWeeklyOpen   = input(title="Weekly open", type=input.bool, defval=true)
inputShowOhlcHtfWeeklyHigh   = input(title="Weekly high", type=input.bool, defval=true)
inputShowOhlcHtfWeeklyLow    = input(title="Weekly low", type=input.bool, defval=true)
inputShowOhlcHtfWeeklyClose  = input(title="Weekly close", type=input.bool, defval=true)
dummy63                      = input(title=" ", type=input.bool, defval=false)
inputShowOhlcHtfMonthlyOpen  = input(title="Monthly open", type=input.bool, defval=true)
inputShowOhlcHtfMonthlyHigh  = input(title="Monthly high", type=input.bool, defval=true)
inputShowOhlcHtfMonthlyLow   = input(title="Monthly low", type=input.bool, defval=true)
inputShowOhlcHtfMonthlyClose = input(title="Monthly close", type=input.bool, defval=true)

//holds the price levels
openPriceD = security(syminfo.tickerid, 'D', open)
highPriceD = security(syminfo.tickerid, 'D', high)
lowPriceD = security(syminfo.tickerid, 'D', low)
closePriceD = security(syminfo.tickerid, 'D', close)

openPriceW = security(syminfo.tickerid, 'W', open)
highPriceW = security(syminfo.tickerid, 'W', high)
lowPriceW = security(syminfo.tickerid, 'W', low)
closePriceW = security(syminfo.tickerid, 'W', close)

openPriceM = security(syminfo.tickerid, 'M', open)
highPriceM = security(syminfo.tickerid, 'M', high)
lowPriceM = security(syminfo.tickerid, 'M', low)
closePriceM = security(syminfo.tickerid, 'M', close)

plot(inputShowOhlcHtf and inputShowOhlcHtfDailyOpen and openPriceD and not timeframe.isdaily and not timeframe.isweekly and not barstate.isrealtime ? openPriceD : na, title="Daily Open", style=plot.style_cross, linewidth=1, color=color.orange)
plot(inputShowOhlcHtf and inputShowOhlcHtfDailyHigh and highPriceD and not timeframe.isdaily and not timeframe.isweekly and not barstate.isrealtime ? highPriceD : na, title="Daily High", style=plot.style_cross, linewidth=1, color=color.orange)
plot(inputShowOhlcHtf and inputShowOhlcHtfDailyLow and lowPriceD and not timeframe.isdaily and not timeframe.isweekly and not barstate.isrealtime ? lowPriceD :  na, title="Daily Low",  style=plot.style_cross, linewidth=1, color=color.red)
plot(inputShowOhlcHtf and inputShowOhlcHtfDailyClose and closePriceD and not timeframe.isdaily and not timeframe.isweekly and not barstate.isrealtime ? closePriceD :  na, title="Daily Close",  style=plot.style_cross, linewidth=1, color=color.red)

plot(inputShowOhlcHtf and inputShowOhlcHtfWeeklyOpen and openPriceW and not timeframe.isweekly and not barstate.isrealtime ? openPriceW : na, title="Weekly Open", style=plot.style_circles, linewidth=2, color=color.orange)
plot(inputShowOhlcHtf and inputShowOhlcHtfWeeklyHigh and highPriceW and not timeframe.isweekly and not barstate.isrealtime ? highPriceW : na, title="Weekly High", style=plot.style_circles, linewidth=2, color=color.orange)
plot(inputShowOhlcHtf and inputShowOhlcHtfWeeklyLow and lowPriceW  and not timeframe.isweekly and not barstate.isrealtime ? lowPriceW :  na, title="Weekly Low",  style=plot.style_circles, linewidth=2, color=color.red)
plot(inputShowOhlcHtf and inputShowOhlcHtfWeeklyClose and closePriceW  and not timeframe.isweekly and not barstate.isrealtime ? closePriceW :  na, title="Weekly Close",  style=plot.style_circles, linewidth=2, color=color.red)

plot(inputShowOhlcHtf and inputShowOhlcHtfMonthlyOpen and openPriceM and not barstate.isrealtime ? openPriceM : na, title="Monthly Open", style=plot.style_circles, linewidth=3, color=colorGreen)
plot(inputShowOhlcHtf and inputShowOhlcHtfMonthlyHigh and highPriceM and not barstate.isrealtime ? highPriceM : na, title="Monthly High", style=plot.style_circles, linewidth=3, color=colorGreen)
plot(inputShowOhlcHtf and inputShowOhlcHtfMonthlyLow and lowPriceM and not barstate.isrealtime  ? lowPriceM :  na, title="Monthly Low",  style=plot.style_circles, linewidth=3, color=colorRed)
plot(inputShowOhlcHtf and inputShowOhlcHtfMonthlyClose and closePriceM and not barstate.isrealtime  ? closePriceM :  na, title="Monthly Close",  style=plot.style_circles, linewidth=3, color=colorRed)

////////////////////////////////////////////////////////////////////////////////
// Alt szn
// [TODO]: add a check to exclude non crypto assets from this feature
// [TODO]: add smoothing choice for MA

dummy7             = input(title="//////////////////////////////", type=input.bool, defval=false)
inputDisplayAltSzn = input(title="Alt dominance SMA cross", type=input.bool, defval=true)
dummy71            = input(title=" ", type=input.bool, defval=false)
inputMaAltSzn      = input(title="SMA", type=input.integer, defval=9, minval=1)
inputSmoothing     = input(title="Smoothing", defval="SMA", options=["RMA", "SMA", "EMA", "WMA", "VWMA", "SMMA", "HullMA", "LSMA", "DEMA", "TEMA"])

closeBtcDom = security('CRYPTOCAP:BTC.D', timeframe.period, close)
smaBtcDom   = security('CRYPTOCAP:BTC.D', timeframe.period, sma(close, inputMaAltSzn)) // EMA 12 or SMA 9

plotchar(inputDisplayAltSzn and crossunder(closeBtcDom, smaBtcDom), title="BTC dominance crossing under MA", char='☀,', transp=0, location=location.belowbar, color=color.white, editable=true, size=size.auto)
plotchar(inputDisplayAltSzn and crossover(closeBtcDom, smaBtcDom), title="BTC Dominance crossing over MA", char='❄', transp=0, location=location.abovebar, color=color.white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Auto-fibo
// https://www.tradingview.com/script/e9AvttKQ-Auto-Fib/
//

dummy8              = input(title="//////////////////////////////", type=input.bool, defval=false)
inputDisplayAutoFib = input(title="Auto fibonacci levels", type=input.bool, defval=false)
dummy81             = input(title=" ", type=input.bool, defval=false)
inputLookback       = input(title="Lookback period", type=input.integer, defval=65, minval=1)
inputFiboLineWidth  = input(title="Line width", type=input.integer, defval=2, minval=1, maxval=5)

colorFib01   = #808080
colorFib236  = #cc2828
colorFib382  = #95cc28
colorFib500  = #28cc28
colorFib618  = #28cc95
colorFib786  = #2895cc
colorFib1618 = #2828cc
colorFib2618 = #cc2828
colorFib3618 = #9528cc

recentHighest  = highest(high, inputLookback)
recentLowest   = lowest(low, inputLookback)
offsetHighest  = highestbars(high, inputLookback)
offsetLowest   = lowestbars(low, inputLookback)
range          = recentHighest - recentLowest
isFiboReversed = offsetHighest < offsetLowest

fib236  = isFiboReversed ? recentLowest + range * (0.236) : recentHighest - range * (0.236)
fib382  = isFiboReversed ? recentLowest + range * (0.382) : recentHighest - range * (0.382)
fib500  = isFiboReversed ? recentLowest + range * (0.5) : recentHighest - range * (0.5)
fib618  = isFiboReversed ? recentLowest + range * (0.618) : recentHighest - range * (0.618)
fib786  = isFiboReversed ? recentLowest + range * (0.786) : recentHighest - range * (0.786)
fib1618 = isFiboReversed ? recentLowest + range * (1.618) : recentHighest - range * (1.618)
fib2618 = isFiboReversed ? recentLowest + range * (2.618) : recentHighest - range * (2.618)
fib3618 = isFiboReversed ? recentLowest + range * (3.618) : recentHighest - range * (3.618)

plot(inputDisplayAutoFib ? recentLowest : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib01, linewidth=inputFiboLineWidth, title="1")
plot(inputDisplayAutoFib ? recentHighest : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib01, linewidth=inputFiboLineWidth, title="0")

plot(inputDisplayAutoFib ? fib236 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib236, linewidth=inputFiboLineWidth, title="0.236")
plot(inputDisplayAutoFib ? fib382 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib382, linewidth=inputFiboLineWidth, title="0.382")
plot(inputDisplayAutoFib ? fib500 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib500, linewidth=inputFiboLineWidth, title="0.5")
plot(inputDisplayAutoFib ? fib618 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib618, linewidth=inputFiboLineWidth, title="0.618")
plot(inputDisplayAutoFib ? fib786 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib786, linewidth=inputFiboLineWidth, title="0.786")
plot(inputDisplayAutoFib ? fib1618 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib1618, linewidth=inputFiboLineWidth, title="1.618")
plot(inputDisplayAutoFib ? fib2618 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib2618, linewidth=inputFiboLineWidth, title="2.618")
plot(inputDisplayAutoFib ? fib3618 : na, show_last=1, trackprice=true, transp=0, style=plot.style_line, color=colorFib3618, linewidth=inputFiboLineWidth, title="3.618")
