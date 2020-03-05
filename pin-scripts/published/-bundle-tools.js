// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Bundle of tools - Flo5k5', shorttitle='Bundle of tools - Flo5k5', overlay=true)

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
// Auto-fibo / log
// Tradingview script/e9AvttKQ-Auto-Fib
//

dummy8              = input(title='//////////////////////////////', type=input.bool, defval=false)
inputDisplayAutoFib = input(title='Auto fibonacci levels', type=input.bool, defval=false)
dummy81             = input(title=' ', type=input.bool, defval=false)
inputLookback       = input(title='Lookback period', type=input.integer, defval=360, minval=1)
inputFiboIsLog      = input(title='Logarithmic', type=input.bool, defval=false)
dummy82             = input(title=' ', type=input.bool, defval=false)
inputLineWidthFib   = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)

inputColorFib01     = #3d3d3d
inputColorFib236    = #cc2828
inputColorFib382    = #95cc28
inputColorFib500    = #28cc28
inputColorFib618    = #28cc95
inputColorFib786    = #2895cc
inputColorFib1618   = #2828cc
inputColorFib2618   = #cc2828
inputColorFib3618   = #9528cc

getFiboLevels(nHigh, nLow, isFiboReversed, isLog) =>
    if not na(nHigh) and not na(nLow)
        currentHigh    = isLog ? log(nHigh) : nHigh
        currentLow     = isLog ? log(nLow) : nLow
        range          = currentHigh - currentLow
        temp0          = isFiboReversed ? currentLow : currentHigh
        f0             = isLog ? exp(temp0) : temp0
        temp236        = isFiboReversed ? currentLow + range * 0.236 : currentHigh - range * 0.236
        f236           = isLog ? exp(temp236) : temp236
        temp382        = isFiboReversed ? currentLow + range * 0.382 : currentHigh - range * 0.382
        f382           = isLog ? exp(temp382) : temp382
        temp500        = isFiboReversed ? currentLow + range * 0.5 : currentHigh - range * 0.5
        f500           = isLog ? exp(temp500) : temp500
        temp618        = isFiboReversed ? currentLow + range * 0.618 : currentHigh - range * 0.618
        f618           = isLog ? exp(temp618) : temp618
        temp786        = isFiboReversed ? currentLow + range * 0.786 : currentHigh - range * 0.786
        f786           = isLog ? exp(temp786) : temp786
        temp1          = isFiboReversed ? currentHigh : currentLow
        f1             = isLog ? exp(temp1) : temp1
        temp1618       = isFiboReversed ? currentLow + range * 1.618 : currentHigh - range * 1.618
        f1618          = isLog ? exp(temp1618) : temp1618
        temp2618       = isFiboReversed ? currentLow + range * 2.618 : currentHigh - range * 2.618
        f2618          = isLog ? exp(temp2618) : temp2618
        temp3618       = isFiboReversed ? currentLow + range * 3.618 : currentHigh - range * 3.618
        f3618          = isLog ? exp(temp3618) : temp3618
        [f0, f236, f382, f500, f618, f786, f1, f1618, f2618, f3618]

recentHighest  = highest(high, inputLookback)
recentLowest   = lowest(low, inputLookback)
highestIndex   = highestbars(high, inputLookback)
lowestIndex    = lowestbars(low, inputLookback)
// recentHighest = biggest(high)
// recentLowest  = smallest(low)

if inputDisplayAutoFib and barstate.islast
    isFiboReversed = highestIndex < lowestIndex
    displayIndex   = isFiboReversed ? bar_index + highestIndex : bar_index + lowestIndex

    [fib0, fib236, fib382, fib500, fib618, fib786, fib1, fib1618, fib2618, fib3618] = getFiboLevels(recentHighest, recentLowest, isFiboReversed, inputFiboIsLog)

    line.new(bar_index + highestIndex, recentHighest, bar_index + lowestIndex, recentLowest, style=line.style_dashed, extend=extend.none, color=inputColorFib01, width=1)
        
    line.new(displayIndex, fib0, bar_index, fib0, extend=extend.none, color=inputColorFib01, width=inputLineWidthFib)
    label.new(displayIndex, fib0, '0', style=label.style_none, textcolor=inputColorFib01)

    line.new(displayIndex, fib236, bar_index, fib236, extend=extend.none, color=inputColorFib236, width=inputLineWidthFib)
    label.new(displayIndex, fib236, '0.236', style=label.style_none, textcolor=inputColorFib236)

    line.new(displayIndex, fib382, bar_index, fib382, extend=extend.none, color=inputColorFib382, width=inputLineWidthFib)
    label.new(displayIndex, fib382, '0.382', style=label.style_none, textcolor=inputColorFib382)

    line.new(displayIndex, fib500, bar_index, fib500, extend=extend.none, color=inputColorFib500, width=inputLineWidthFib)
    label.new(displayIndex, fib500, '0.5', style=label.style_none, textcolor=inputColorFib500)

    line.new(displayIndex, fib618, bar_index, fib618, extend=extend.none, color=inputColorFib618, width=inputLineWidthFib)
    label.new(displayIndex, fib618, '0.618', style=label.style_none, textcolor=inputColorFib618)

    line.new(displayIndex, fib786, bar_index, fib786, extend=extend.none, color=inputColorFib786, width=inputLineWidthFib)
    label.new(displayIndex, fib786, '0.786', style=label.style_none, textcolor=inputColorFib786)

    line.new(displayIndex, fib1, bar_index, fib1, extend=extend.none, color=inputColorFib01, width=inputLineWidthFib)
    label.new(displayIndex, fib1, '1', style=label.style_none, textcolor=inputColorFib01)

    line.new(displayIndex, fib1618, bar_index, fib1618, extend=extend.none, color=inputColorFib1618, width=inputLineWidthFib)
    label.new(displayIndex, fib1618, '1.618', style=label.style_none, textcolor=inputColorFib1618)

    line.new(displayIndex, fib2618, bar_index, fib2618, extend=extend.none, color=inputColorFib2618, width=inputLineWidthFib)
    label.new(displayIndex, fib2618, '2.618', style=label.style_none, textcolor=inputColorFib2618)

    line.new(displayIndex, fib3618, bar_index, fib3618, extend=extend.none, color=inputColorFib3618, width=inputLineWidthFib)
    label.new(displayIndex, fib3618, '3.618', style=label.style_none, textcolor=inputColorFib3618)

////////////////////////////////////////////////////////////////////////////////
// MAs

dummy0               = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowSmas        = input(title='MAs', type=input.bool, defval=true)
dummy01              = input(title=' ', type=input.bool, defval=false)
inputMa1             = input(title='MA 1', type=input.integer, defval=9, minval=0)
inputSmoothingMa1    = input(title='Smoothing MA1', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa1         = input(title='Show MA 1', type=input.bool, defval=false)
dummy02              = input(title=' ', type=input.bool, defval=false)
inputMa2             = input(title='MA 2', type=input.integer, defval=21, minval=0)
inputSmoothingMa2    = input(title='Smoothing MA2', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa2         = input(title='Show MA 2', type=input.bool, defval=false)
dummy03              = input(title=' ', type=input.bool, defval=false)
inputMa3             = input(title='MA 3', type=input.integer, defval=20, minval=0)
inputSmoothingMa3    = input(title='Smoothing MA3', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa3         = input(title='Show MA 3', type=input.bool, defval=true)
dummy04              = input(title=' ', type=input.bool, defval=false)
inputMa4             = input(title='MA 4', type=input.integer, defval=50, minval=0)
inputSmoothingMa4    = input(title='Smoothing MA4', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa4         = input(title='Show MA 4', type=input.bool, defval=true)
dummy05              = input(title=' ', type=input.bool, defval=false)
inputMa5             = input(title='MA 5', type=input.integer, defval=200, minval=0)
inputSmoothingMa5    = input(title='Smoothing MA5', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa5         = input(title='Show MA 5', type=input.bool, defval=true)
dummy06              = input(title=' ', type=input.bool, defval=false)
inputLinewidth       = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)
inputSmaTransparency = input(title='MA transparency', type=input.integer, defval=20, minval=0, maxval=100)
inputAlmaOffset      = input(title='ALMA Offset', defval=0.85, minval=1)
inputAlmaSigma       = input(title='ALMA Sigma', defval=6, minval=0)
inputMaIsLog         = input(title='Logarithmic', type=input.bool, defval=true)

getMa(src, length, maType, almaOffset, almaSigma, isLog) => 
    if maType == 'RMA' 
        rma(src, length)
    else
        if maType == 'SMA' 
            sma(src, length)
        else
            if maType == 'EMA'
                ema(src, length)
            else
                if maType == 'WMA' 
                    wma(src, length)
                else
                    if maType == 'VWMA'
                        vwma(src, length)
                    else
                        if maType == 'SMMA' 
                            (na(src[1]) ? sma(src, length) : (src[1] * (length - 1) + src) / length)
                        else
                            if maType == 'HullMA'
                                (wma(2 * wma(src, length / 2) - wma(src, length), round(sqrt(length))))
                            else 
                                if maType == 'LSMA' 
                                    alma(src, length, almaOffset, almaSigma)
                                else
                                    if maType == 'DEMA'
                                        e1 = ema(src, length)
                                        e2 = ema(e1, length)
                                        2 * e1 - e2
                                    else
                                        if maType == 'TEMA'
                                            ema1 = ema(src, length)
                                            ema2 = ema(ema1, length)
                                            ema3 = ema(ema2, length)
                                            3 * (ema1 - ema2) + ema3
                                        else
                                            src

ma1 = getMa(close, inputMa1, inputSmoothingMa1, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma2 = getMa(close, inputMa2, inputSmoothingMa2, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma3 = getMa(close, inputMa3, inputSmoothingMa3, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma4 = getMa(close, inputMa4, inputSmoothingMa4, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma5 = getMa(close, inputMa5, inputSmoothingMa5, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)

plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 1')
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=colorGreen, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 2')
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=colorYellow, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 3')
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=colorOrange, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 4')
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=colorRed, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 5')

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI 

dummy3                   = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowStochRsiCrosses = input(title='MTF Stoch RSI crosses', type=input.bool, defval=true)
dummy31                  = input(title=' ', type=input.bool, defval=false)
inputOffsetCross         = input(title='Crosses offset', defval=0, type=input.integer)
inputLengthRsi           = input(type=input.integer, title='RSI Length', defval=14, minval=1)
inputLengthStoch         = input(type=input.integer, title='Stoch Length', defval=14, minval=1)
inputSmoothK             = input(type=input.integer, title='Smooth K', defval=3, minval=1)
inputSmoothD             = input(type=input.integer, title='Smooth D', defval=3, minval=1)
inputRsiSrc              = input(title='RSI Source', defval=close)
dummy32                  = input(title=' ', type=input.bool, defval=false)
inputShowOnlyC           = input(title='Show only current TF', type=input.bool, defval=true)
inputShowC               = input(title='Show current TF', type=input.bool, defval=true)
inputShow1H              = input(title='Show 1h', type=input.bool, defval=true)
inputShow4H              = input(title='Show 4h', type=input.bool, defval=true)
inputShow1D              = input(title='Show D', type=input.bool, defval=true)
inputShow1W              = input(title='Show W', type=input.bool, defval=true)

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

[rsiC, kC, dC, lBearCrossC, sBearCrossC, lBullCrossC, sBullCrossC] = getStochRsiCross(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)
stochKC          = sma(stoch(close, high, low, inputLengthStoch), inputSmoothK)
stochDC          = sma(stochKC, inputSmoothD)
lBearStochCrossC = crossunder(stochKC, stochDC) and stochDC >= 80
sBearStochCrossC = crossunder(stochKC, stochDC) and stochDC < 80
lBullStochCrossC = crossover(stochKC, stochDC) and stochDC < 20
sBullStochCrossC = crossover(stochKC, stochDC) and stochDC >= 20
srColor          = lBullStochCrossC or sBullStochCrossC or lBullCrossC or sBullCrossC ? (lBullStochCrossC or lBullCrossC ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearStochCrossC or lBearCrossC ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShowC and inputShowStochRsiCrosses and ((timeframe.isintraday and not(timeframe.multiplier == 240 or timeframe.multiplier == 60)) or inputShowOnlyC) and (lBearStochCrossC or sBearStochCrossC or lBullStochCrossC or sBullStochCrossC or lBearCrossC or sBearCrossC or lBullCrossC or sBullCrossC)? close : na,  title='Cross Stoch RSI Current TF', style=shape.circle, text='', location=location.absolute, color=srColor)

rsi1h   = rsi(inputRsiSrc, inputLengthRsi)
k1h     = security(syminfo.tickerid, '60', sma(stoch(rsi1h, rsi1h, rsi1h, inputLengthStoch), inputSmoothK))
d1h     = security(syminfo.tickerid, '60', sma(k1h, inputSmoothD))
close1h = security(syminfo.tickerid, '60', close)
lBearCross1h = crossunder(k1h, d1h) and d1h >= 80
sBearCross1h = crossunder(k1h, d1h) and d1h < 80
lBullCross1h = crossover(k1h, d1h) and d1h < 20
sBullCross1h = crossover(k1h, d1h) and d1h >= 20
sr1hColor    = lBullCross1h or sBullCross1h ? (lBullCross1h ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCross1h ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1H and inputShowStochRsiCrosses and not inputShowOnlyC and  (lBullCross1h or sBullCross1h or lBearCross1h or sBearCross1h) ? close1h : na,  title='Cross Stoch RSI 1h', style=shape.circle, text='1h', location=location.absolute, color=sr1hColor)
// plotshape(inputShow1H and inputShowStochRsiCrosses and not inputShowOnlyC and  (lBearStochCross1h or sBearStochCross1h or lBullStochCross1h or sBullStochCross1h or lBullCross1h or sBullCross1h or lBearCross1h or sBearCross1h) ? close1h : na, style=shape.circle, text='1h', location=location.absolute, color=sr1hColor)

rsi4h   = rsi(inputRsiSrc, inputLengthRsi)
k4h     = security(syminfo.tickerid, '240', sma(stoch(rsi4h, rsi4h, rsi4h, inputLengthStoch), inputSmoothK))
d4h     = security(syminfo.tickerid, '240', sma(k4h, inputSmoothD))
close4h = security(syminfo.tickerid, '240', close)
lBearCross4h = crossunder(k4h, d4h) and d4h >= 80
sBearCross4h = crossunder(k4h, d4h) and d4h < 80
lBullCross4h = crossover(k4h, d4h) and d4h < 20
sBullCross4h = crossover(k4h, d4h) and d4h >= 20
sr4hColor    = lBullCross4h or sBullCross4h ? (lBullCross4h ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCross4h ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow4H and inputShowStochRsiCrosses and not inputShowOnlyC and timeframe.isintraday and (lBullCross4h or sBullCross4h or lBearCross4h or sBearCross4h) ? close4h : na,  title='Cross Stoch RSI 4h', style=shape.circle, text='4h', location=location.absolute, color=sr4hColor)
// plotshape(inputShow4H and inputShowStochRsiCrosses and not inputShowOnlyC and timeframe.isintraday and (lBearStochCross4h or sBearStochCross4h or lBullStochCross4h or sBullStochCross4h or lBullCross4h or sBullCross4h or lBearCross4h or sBearCross4h) ? close4h : na, style=shape.circle, text='4h', location=location.absolute, color=sr4hColor)

rsiD   = rsi(inputRsiSrc, inputLengthRsi)
kD     = security(syminfo.tickerid, 'D', sma(stoch(rsiD, rsiD, rsiD, inputLengthStoch), inputSmoothK))
dD     = security(syminfo.tickerid, 'D', sma(kD, inputSmoothD))
closeD = security(syminfo.tickerid, 'D', close)
lBearCrossD = crossunder(kD, dD) and dD >= 80
sBearCrossD = crossunder(kD, dD) and dD < 80
lBullCrossD = crossover(kD, dD) and dD < 20
sBullCrossD = crossover(kD, dD) and dD >= 20
srDColor    = lBullCrossD or sBullCrossD ? (lBullCrossD ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCrossD ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1D and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossD or sBullCrossD or lBearCrossD or sBearCrossD) ? closeD : na, title='Cross Stoch RSI D', style=shape.circle, text='D', location=location.absolute, color=srDColor)
// plotshape(inputShow1D and inputShowStochRsiCrosses and not inputShowOnlyC and (lBearStochCrossD or sBearStochCrossD or lBullStochCrossD or sBullStochCrossD or lBullCrossD or sBullCrossD or lBearCrossD or sBearCrossD) ? closeD : na, style=shape.circle, text='D', location=location.absolute, color=srDColor)

rsiW   = rsi(inputRsiSrc, inputLengthRsi)
kW     = security(syminfo.tickerid, 'W', sma(stoch(rsiW, rsiW, rsiW, inputLengthStoch), inputSmoothK))
dW     = security(syminfo.tickerid, 'W', sma(kW, inputSmoothD))
closeW = security(syminfo.tickerid, 'W', close)
lBearCrossW = crossunder(kW, dW) and dW >= 80
sBearCrossW = crossunder(kW, dW) and dW < 80
lBullCrossW = crossover(kW, dW) and dW < 20
sBullCrossW = crossover(kW, dW) and dW >= 20
srWColor    = lBullCrossW or sBullCrossW ? (lBullCrossW ? color.new(colorLong, 0) : color.new(colorLong, 60)) : (lBearCrossW ? color.new(colorShort, 0) : color.new(colorShort, 60))
plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, title='Cross Stoch RSI W', style=shape.circle, text='W', location=location.absolute, color=srWColor)
// plotshape(inputShow1W and inputShowStochRsiCrosses and not inputShowOnlyC and (lBearStochCrossW or sBearStochCrossW or lBullStochCrossW or sBullStochCrossW or lBullCrossW or sBullCrossW or lBearCrossW or sBearCrossW) ? closeW : na, style=shape.circle, text='W', location=location.absolute, color=srWColor)

////////////////////////////////////////////////////////////////////////////////
// Bollinger Bands 

dummy2           = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowBB      = input(title='Bollinger Bands', type=input.bool, defval=false)
dummy21          = input(title=' ', type=input.bool, defval=false)
inputLengthBB    = input(20, title='MA Length', minval=1)
inputSrcBB       = input(close, title='Source')
inputMultBB1     = input(2.0, title='Primary deviation', minval=0.001, maxval=50)
inputMultBB2     = input(1.0, title='Secondary deviation', minval=0.001, maxval=50)
inputShowMultBB2 = input(title='Show second Mult', type=input.bool, defval=true)
inputBBIsLog     = input(title='Logarithmic', type=input.bool, defval=true)

srcBB  = inputBBIsLog ? log(inputSrcBB) : inputSrcBB
stdDev = stdev(srcBB, inputLengthBB)
dev1   = inputMultBB1 * stdDev
dev2   = inputMultBB2 * stdDev
basis  = sma(srcBB, inputLengthBB)
upper1 = basis + dev1
lower1 = basis - dev1
upper2 = basis + dev2
lower2 = basis - dev2

plot(inputShowBB ? (inputBBIsLog ? exp(basis) : basis) : na, title='Bollinger moving average', color=color.red)
p1Dev1 = plot(inputShowBB ? (inputBBIsLog ? exp(upper1) : upper1)  : na, title='Upper bollinger band primary deviation', color=color.blue, linewidth=2, transp=70)
p2Dev1 = plot(inputShowBB ? (inputBBIsLog ? exp(lower1) : lower1) : na, title='Lower bollinger band primary deviation', color=color.blue, linewidth=2, transp=70)
p1Dev2 = plot(inputShowBB and inputShowMultBB2 ? (inputBBIsLog ? exp(upper2) : upper2) : na, title='Upper bollinger band secondary deviation', color=color.blue, linewidth=2, transp=70)
p2Dev2 = plot(inputShowBB and inputShowMultBB2 ? (inputBBIsLog ? exp(lower2) : lower2) : na, title='Lower bollinger band secondary deviation', color=color.blue, linewidth=2, transp=70)
fill(p1Dev1, p2Dev1, title='Bollinger bands background color', transp=95)

////////////////////////////////////////////////////////////////////////////////
// SAR

dummy1            = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowSar      = input(title='SAR', type=input.bool, defval=false)
dummy11           = input(title=' ', type=input.bool, defval=false)
inputStartSar     = input(0.2, title='Start', minval=0.1)
inputIncSar       = input(0.2, title='Increment', minval=0.1)
inputMaxSar       = input(0.2, title='Maximum', minval=0.1)
inputLineWidthSar = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)

sarValue = sar(inputStartSar, inputIncSar, inputMaxSar)
plot(inputShowSar ? sarValue : na, style=plot.style_cross, linewidth=inputLineWidthSar, color=sarValue <= low ? colorGreen : colorRed )

////////////////////////////////////////////////////////////////////////////////
// Current candle background

dummy4                  = input(title='//////////////////////////////', type=input.bool, defval=false)
inputColorBg            = input(title='Color background', type=input.bool, defval=true)
dummy41                 = input(title=' ', type=input.bool, defval=false)
inputDiff               = input(title='Difference between Stoch RSI K and D', type=input.integer, defval=16, minval=0)
inputShowOnlyCurrentBar = input(title='Color only current bar', type=input.bool, defval=true)

diffDKC = dC - kC
diffKDC = kC - dC
isBgColorShown     = ((inputShowOnlyCurrentBar and barstate.isrealtime) or not inputShowOnlyCurrentBar) and inputColorBg
backgroundColorBar = (isBgColorShown and kC <= dC and diffDKC >= 0 and diffDKC <= inputDiff and dC <= 30 and rsiC <= 40) ? color.green :
     (isBgColorShown and kC >= dC and diffKDC >= 0 and diffKDC <= inputDiff and dC >= 70 and rsiC >= 45) ? color.red :
     na

bgcolor(color=backgroundColorBar, title='Background color (stoch RSI K and D difference)', transp=90)

////////////////////////////////////////////////////////////////////////////////
// Support / Resistance
//
// Backtest-rookies: tradingview-support-and-resistance-indicator
//

dummy5                             = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowSupportResistance         = input(title='Support / resistance', type=input.bool, defval=false)
dummy51                            = input(title=' ', type=input.bool, defval=false)
inputSupportResistanceTransparency = input(title='Support / resistance transparency', type=input.integer, defval=0, minval=0, maxval=100)

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
// Alt szn
// [TODO]: add a check to exclude non crypto assets from this feature
// [TODO]: add smoothing choice for MA

dummy7             = input(title='//////////////////////////////', type=input.bool, defval=false)
inputDisplayAltSzn = input(title='Alt dominance SMA cross', type=input.bool, defval=false)
dummy71            = input(title=' ', type=input.bool, defval=false)
inputMaAltSzn      = input(title='SMA', type=input.integer, defval=20, minval=1)
inputSmoothing     = input(title='Smoothing', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])

closeBtcDom        = security('CRYPTOCAP:BTC.D', timeframe.period, close)
smaBtcDom          = security('CRYPTOCAP:BTC.D', timeframe.period, sma(close, inputMaAltSzn))

plotchar(inputDisplayAltSzn and crossunder(closeBtcDom, smaBtcDom), title='BTC dominance crossing under MA', char='☀,', transp=0, location=location.belowbar, color=color.white, editable=true, size=size.auto)
plotchar(inputDisplayAltSzn and crossover(closeBtcDom, smaBtcDom), title='BTC Dominance crossing over MA', char='❄', transp=0, location=location.abovebar, color=color.white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Open High Low Close HTF
//
// Tradingview script/F8yZU30q-Open-High-Low-HTF
// 

dummy6                       = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowOhlcHtf             = input(title='OHLC HTF', type=input.bool, defval=true)
dummy61                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcLabels          = input(title='Show labels', type=input.bool, defval=false)
dummy62                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfDaily        = input(title='Show daily', type=input.bool, defval=false)
dummy63                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfDailyOpen    = input(title='Daily open', type=input.bool, defval=false)
inputExtendDaylyOpen         = input(title='Extend DO', type=input.bool, defval=false)
inputShowOhlcHtfDailyHigh    = input(title='Daily high', type=input.bool, defval=false)
inputExtendDaylyHigh         = input(title='Extend DH', type=input.bool, defval=false)
inputShowOhlcHtfDailyLow     = input(title='Daily low', type=input.bool, defval=false)
inputExtendDaylyLow          = input(title='Extend DL', type=input.bool, defval=false)
inputShowOhlcHtfDailyClose   = input(title='Daily close', type=input.bool, defval=false)
inputExtendDaylyClose        = input(title='Extend DC', type=input.bool, defval=false)
inputLineWidthOhlcDaily      = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcDaily   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy64                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfWeekly       = input(title='Show weekly', type=input.bool, defval=false)
dummy65                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyOpen   = input(title='Weekly open', type=input.bool, defval=false)
inputExtendWeeklyOpen        = input(title='Extend WO', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyHigh   = input(title='Weekly high', type=input.bool, defval=false)
inputExtendWeeklyHigh        = input(title='Extend WH', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyLow    = input(title='Weekly low', type=input.bool, defval=false)
inputExtendWeeklyLow         = input(title='Extend WL', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyClose  = input(title='Weekly close', type=input.bool, defval=false)
inputExtendWeeklyClose       = input(title='Extend WC', type=input.bool, defval=false)
inputLineWidthOhlcWeekly     = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcWeekly   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy66                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfMonthly      = input(title='Show monthly', type=input.bool, defval=true)
dummy67                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyOpen  = input(title='Monthly open', type=input.bool, defval=false)
inputExtendMonthlyOpen       = input(title='Extend MO', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyHigh  = input(title='Monthly high', type=input.bool, defval=true)
inputExtendMonthlyHigh       = input(title='Extend MH', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyLow   = input(title='Monthly low', type=input.bool, defval=true)
inputExtendMonthlyLow        = input(title='Extend ML', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyClose = input(title='Monthly close', type=input.bool, defval=true)
inputExtendMonthlyClose      = input(title='Extend MC', type=input.bool, defval=false)
inputLineWidthOhlcMonthly    = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcMonthly   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy68                      = input(title=' ', type=input.bool, defval=false)

inputLineTranspOhlcDaily     = 40
inputLineTranspOhlcWeekly    = 40
inputLineTranspOhlcMonthly   = 40
inputOhlcLabelColor          = #d1d4dc

////// Daily Open

openPriceD = security(syminfo.tickerid, 'D', open)
isDisplayedDailyOpen  = inputShowOhlcHtf and inputShowOhlcHtfDaily and inputShowOhlcHtfDailyOpen and openPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyOpenLine  = na

if isDisplayedDailyOpen and openPriceD[1] != openPriceD
    if not inputExtendDaylyOpen
        line.set_x2(dailyOpenLine, bar_index)
        line.set_extend(dailyOpenLine, extend.none)
    dailyOpenLine := line.new(bar_index, openPriceD, bar_index, openPriceD, extend=inputExtendDaylyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceD, 'DO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyOpen and not na(dailyOpenLine) and line.get_x2(dailyOpenLine) != bar_index
    line.set_x2(dailyOpenLine, bar_index)

////// Daily High

highPriceD = security(syminfo.tickerid, 'D', high)
isDisplayedDailyHigh  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyHigh and highPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyHighLine  = na

if isDisplayedDailyHigh and highPriceD[1] != highPriceD
    if not inputExtendDaylyHigh
        line.set_x2(dailyHighLine, bar_index)
        line.set_extend(dailyHighLine, extend.none)
    dailyHighLine := line.new(bar_index, highPriceD, bar_index, highPriceD, extend=inputExtendDaylyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceD, 'DH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyHigh and not na(dailyHighLine) and line.get_x2(dailyHighLine) != bar_index
    line.set_x2(dailyHighLine, bar_index)

////// Daily Low

lowPriceD = security(syminfo.tickerid, 'D', low)
isDisplayedDailyLow  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyLow and lowPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyLowLine  = na

if isDisplayedDailyLow and lowPriceD[1] != lowPriceD
    if not inputExtendDaylyLow
        line.set_x2(dailyLowLine, bar_index)
        line.set_extend(dailyLowLine, extend.none)
    dailyLowLine := line.new(bar_index, lowPriceD, bar_index, lowPriceD, extend=inputExtendDaylyLow ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceD, 'DL', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyLow and not na(dailyLowLine) and line.get_x2(dailyLowLine) != bar_index
    line.set_x2(dailyLowLine, bar_index)

////// Daily Close

closePriceD = security(syminfo.tickerid, 'D', close)
isDisplayedDailyClose  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyClose and closePriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyCloseLine  = na

if isDisplayedDailyClose and closePriceD[1] != closePriceD
    if not inputExtendDaylyClose
        line.set_x2(dailyCloseLine, bar_index)
        line.set_extend(dailyCloseLine, extend.none)
    dailyCloseLine := line.new(bar_index, closePriceD, bar_index, closePriceD, extend=inputExtendDaylyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceD, 'DC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyClose and not na(dailyCloseLine) and line.get_x2(dailyCloseLine) != bar_index
    line.set_x2(dailyCloseLine, bar_index)

////// Weekly Open

openPriceW = security(syminfo.tickerid, 'W', open)
isDisplayedWeeklyOpen  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyOpen and openPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyOpenLine  = na

if isDisplayedWeeklyOpen and openPriceW[1] != openPriceW
    if not inputExtendWeeklyOpen
        line.set_x2(weeklyOpenLine, bar_index)
        line.set_extend(weeklyOpenLine, extend.none)
    weeklyOpenLine := line.new(bar_index, openPriceW, bar_index, openPriceW, extend=inputExtendWeeklyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceW, 'WO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyOpen and not na(weeklyOpenLine) and line.get_x2(weeklyOpenLine) != bar_index
    line.set_x2(weeklyOpenLine, bar_index)

////// Weekly High

highPriceW = security(syminfo.tickerid, 'W', high)
isDisplayedWeeklyHigh  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyHigh and highPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyHighLine  = na

if isDisplayedWeeklyHigh and highPriceW[1] != highPriceW
    if not inputExtendWeeklyHigh
        line.set_x2(weeklyHighLine, bar_index)
        line.set_extend(weeklyHighLine, extend.none)
    weeklyHighLine := line.new(bar_index, highPriceW, bar_index, highPriceW, extend=inputExtendWeeklyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceW, 'WH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyHigh and not na(weeklyHighLine) and line.get_x2(weeklyHighLine) != bar_index
    line.set_x2(weeklyHighLine, bar_index)

////// Weekly Low

lowPriceW = security(syminfo.tickerid, 'W', low)
isDisplayedWeeklyLow  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyLow and lowPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyLowLine  = na

if isDisplayedWeeklyLow and lowPriceW[1] != lowPriceW
    if not inputExtendWeeklyLow
        line.set_x2(weeklyLowLine, bar_index)
        line.set_extend(weeklyLowLine, extend.none)
    weeklyLowLine := line.new(bar_index, lowPriceW, bar_index, lowPriceW, extend=inputExtendWeeklyLow  ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceW, 'WL', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyLow and not na(weeklyLowLine) and line.get_x2(weeklyLowLine) != bar_index
    line.set_x2(weeklyLowLine, bar_index)

////// Weekly Close

closePriceW = security(syminfo.tickerid, 'W', close)
isDisplayedWeeklyClose  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyClose and closePriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyCloseLine  = na

if isDisplayedWeeklyClose and closePriceW[1] != closePriceW
    if not inputExtendWeeklyClose
        line.set_x2(weeklyCloseLine, bar_index)
        line.set_extend(weeklyCloseLine, extend.none)
    weeklyCloseLine := line.new(bar_index, closePriceW, bar_index, closePriceW, extend=inputExtendWeeklyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceW, 'WC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyClose and not na(weeklyCloseLine) and line.get_x2(weeklyCloseLine) != bar_index
    line.set_x2(weeklyCloseLine, bar_index)

////// Monthly Open

openPriceM = security(syminfo.tickerid, 'M', open)
isDisplayedMonthlyOpen  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyOpen and openPriceM and not timeframe.ismonthly
var line monthlyOpenLine  = na

if isDisplayedMonthlyOpen and openPriceM[1] != openPriceM
    if not inputExtendMonthlyOpen
        line.set_x2(monthlyOpenLine, bar_index)
        line.set_extend(monthlyOpenLine, extend.none)
    monthlyOpenLine := line.new(bar_index, openPriceM, bar_index, openPriceM, extend= inputExtendMonthlyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceM, 'MO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyOpen and not na(monthlyOpenLine) and line.get_x2(monthlyOpenLine) != bar_index
    line.set_x2(monthlyOpenLine, bar_index)

////// Monthly High

highPriceM = security(syminfo.tickerid, 'M', high)
isDisplayedMonthlyHigh  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyHigh and highPriceM and not timeframe.ismonthly
var line monthlyHighLine  = na

if isDisplayedMonthlyHigh and highPriceM[1] != highPriceM
    if not inputExtendMonthlyHigh
        line.set_x2(monthlyHighLine, bar_index)
        line.set_extend(monthlyHighLine, extend.none)
    monthlyHighLine := line.new(bar_index, highPriceM, bar_index, highPriceM, extend=inputExtendMonthlyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceM, 'MH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyHigh and not na(monthlyHighLine) and line.get_x2(monthlyHighLine) != bar_index
    line.set_x2(monthlyHighLine, bar_index)

////// Monthly Low

lowPriceM = security(syminfo.tickerid, 'M', low)
isDisplayedMonthlyLow  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyLow and lowPriceM and not timeframe.ismonthly
var line monthlyLowLine  = na

if isDisplayedMonthlyLow and lowPriceM[1] != lowPriceM
    if not inputExtendMonthlyLow
        line.set_x2(monthlyLowLine, bar_index)
        line.set_extend(monthlyLowLine, extend.none)
    monthlyLowLine := line.new(bar_index, lowPriceM, bar_index, lowPriceM, extend=inputExtendMonthlyLow ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceM, 'ML', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyLow and not na(monthlyLowLine) and line.get_x2(monthlyLowLine) != bar_index
    line.set_x2(monthlyLowLine, bar_index)

////// Monthly Close

closePriceM = security(syminfo.tickerid, 'M', close)
isDisplayedMonthlyClose  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyClose and closePriceM and not timeframe.ismonthly
var line monthlyCloseLine  = na

if isDisplayedMonthlyClose and closePriceM[1] != closePriceM
    if not inputExtendMonthlyClose
        line.set_x2(monthlyCloseLine, bar_index)
        line.set_extend(monthlyCloseLine, extend.none)
    monthlyCloseLine := line.new(bar_index, closePriceM, bar_index, closePriceM, extend=inputExtendMonthlyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceM, 'MC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyClose and not na(monthlyCloseLine) and line.get_x2(monthlyCloseLine) != bar_index
    line.set_x2(monthlyCloseLine, bar_index)

////////////////////////////////////////////////////////////////////////////////
// Custom alerts

alertcondition(lBearCross1h or lBearCrossC, title='Sell signal', message='Sell signal')
alertcondition(lBullCross1h or lBullCrossC, title='Buy signal', message='Buy signal')
alertcondition(lBullCross1h or lBearCross1h or lBullCrossC or lBearCrossC, title='Buy or sell signal', message='Buy or sell signal')
