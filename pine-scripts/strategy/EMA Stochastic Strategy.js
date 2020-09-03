// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='EMA/Stochastic Strategy - Flo5k5', shorttitle='EMA/Stoch - Flo5k5', overlay=true)

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
// Custom alerts

alertcondition(lBearCross1h or lBearCrossC, title='Sell signal', message='Sell signal')
alertcondition(lBullCross1h or lBullCrossC, title='Buy signal', message='Buy signal')
alertcondition(lBullCross1h or lBearCross1h or lBullCrossC or lBearCrossC, title='Buy or sell signal', message='Buy or sell signal')
