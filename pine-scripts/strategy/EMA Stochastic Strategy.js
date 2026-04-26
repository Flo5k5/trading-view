// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=6
indicator(title='EMA/Stochastic Strategy - Flo5k5', shorttitle='EMA/Stoch - Flo5k5', overlay=true)

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

dummy0               = input.bool(false, title='//////////////////////////////')
inputShowSmas        = input.bool(true, title='MAs')
dummy01              = input.bool(false, title=' ')
inputMa1             = input.int(9, title='MA 1', minval=0)
inputSmoothingMa1    = input.string('EMA', title='Smoothing MA1', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa1         = input.bool(false, title='Show MA 1')
dummy02              = input.bool(false, title=' ')
inputMa2             = input.int(21, title='MA 2', minval=0)
inputSmoothingMa2    = input.string('EMA', title='Smoothing MA2', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa2         = input.bool(false, title='Show MA 2')
dummy03              = input.bool(false, title=' ')
inputMa3             = input.int(20, title='MA 3', minval=0)
inputSmoothingMa3    = input.string('SMA', title='Smoothing MA3', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa3         = input.bool(true, title='Show MA 3')
dummy04              = input.bool(false, title=' ')
inputMa4             = input.int(50, title='MA 4', minval=0)
inputSmoothingMa4    = input.string('SMA', title='Smoothing MA4', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa4         = input.bool(true, title='Show MA 4')
dummy05              = input.bool(false, title=' ')
inputMa5             = input.int(200, title='MA 5', minval=0)
inputSmoothingMa5    = input.string('SMA', title='Smoothing MA5', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa5         = input.bool(true, title='Show MA 5')
dummy06              = input.bool(false, title=' ')
inputLinewidth       = input.int(2, title='Line width', minval=1, maxval=5)
inputSmaTransparency = input.int(20, title='MA transparency', minval=0, maxval=100)
inputAlmaOffset      = input.float(0.85, title='ALMA Offset', minval=0)
inputAlmaSigma       = input.float(6, title='ALMA Sigma', minval=0)
inputMaIsLog         = input.bool(true, title='Logarithmic')

getMa(src, length, maType, almaOffset, almaSigma, isLog) =>
    if maType == 'RMA'
        ta.rma(src, length)
    else if maType == 'SMA'
        ta.sma(src, length)
    else if maType == 'EMA'
        ta.ema(src, length)
    else if maType == 'WMA'
        ta.wma(src, length)
    else if maType == 'VWMA'
        ta.vwma(src, length)
    else if maType == 'SMMA'
        na(src[1]) ? ta.sma(src, length) : (src[1] * (length - 1) + src) / length
    else if maType == 'HullMA'
        ta.wma(2 * ta.wma(src, length / 2) - ta.wma(src, length), math.round(math.sqrt(length)))
    else if maType == 'LSMA'
        ta.alma(src, length, almaOffset, almaSigma)
    else if maType == 'DEMA'
        e1 = ta.ema(src, length)
        e2 = ta.ema(e1, length)
        2 * e1 - e2
    else if maType == 'TEMA'
        ema1 = ta.ema(src, length)
        ema2 = ta.ema(ema1, length)
        ema3 = ta.ema(ema2, length)
        3 * (ema1 - ema2) + ema3
    else
        src

ma1 = getMa(close, inputMa1, inputSmoothingMa1, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma2 = getMa(close, inputMa2, inputSmoothingMa2, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma3 = getMa(close, inputMa3, inputSmoothingMa3, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma4 = getMa(close, inputMa4, inputSmoothingMa4, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma5 = getMa(close, inputMa5, inputSmoothingMa5, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)

plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=color.new(colorBlue,   inputSmaTransparency), linewidth=inputLinewidth, title='MA 1')
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=color.new(colorGreen,  inputSmaTransparency), linewidth=inputLinewidth, title='MA 2')
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=color.new(colorYellow, inputSmaTransparency), linewidth=inputLinewidth, title='MA 3')
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=color.new(colorOrange, inputSmaTransparency), linewidth=inputLinewidth, title='MA 4')
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=color.new(colorRed,    inputSmaTransparency), linewidth=inputLinewidth, title='MA 5')

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI

dummy3                   = input.bool(false, title='//////////////////////////////')
inputShowStochRsiCrosses = input.bool(true, title='MTF Stoch RSI crosses')
dummy31                  = input.bool(false, title=' ')
inputOffsetCross         = input.int(0, title='Crosses offset')
inputLengthRsi           = input.int(14, title='RSI Length', minval=1)
inputLengthStoch         = input.int(14, title='Stoch Length', minval=1)
inputSmoothK             = input.int(3,  title='Smooth K', minval=1)
inputSmoothD             = input.int(3,  title='Smooth D', minval=1)
inputRsiSrc              = input.source(close, title='RSI Source')
dummy32                  = input.bool(false, title=' ')
inputShowOnlyC           = input.bool(true, title='Show only current TF')
inputShowC               = input.bool(true, title='Show current TF')
inputShow1H              = input.bool(true, title='Show 1h')
inputShow4H              = input.bool(true, title='Show 4h')
inputShow1D              = input.bool(true, title='Show D')
inputShow1W              = input.bool(true, title='Show W')

getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    rsi = ta.rsi(rsiSource, rsiLength)
    k   = ta.sma(ta.stoch(rsi, rsi, rsi, lengthStoch), smoothK)
    d   = ta.sma(k, smoothD)
    [rsi, k, d]

getStochRsiCross(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    [rsi, k, d] = getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD)
    lBearCross = ta.crossunder(k, d) and d >= 80
    // mBearCross  = ta.crossunder(k, d) and d > 20 and d < 80
    // sBearCross = ta.crossunder(k, d) and d >= 0 and d <= 20
    sBearCross = ta.crossunder(k, d) and d < 80
    lBullCross = ta.crossover(k, d)  and d < 20
    // lBullCross = ta.crossover(k, d) and d >= 0 and d <= 20
    // mBullCross  = ta.crossover(k, d) and d > 20 and d < 80
    sBullCross = ta.crossover(k, d)  and d >= 20
    [rsi, k, d, lBearCross, sBearCross, lBullCross, sBullCross]

// Current timeframe
[rsiC, kC, dC, lBearCrossC, sBearCrossC, lBullCrossC, sBullCrossC] = getStochRsiCross(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)

stochKC          = ta.sma(ta.stoch(close, high, low, inputLengthStoch), inputSmoothK)
stochDC          = ta.sma(stochKC, inputSmoothD)
lBearStochCrossC = ta.crossunder(stochKC, stochDC) and stochDC >= 80
sBearStochCrossC = ta.crossunder(stochKC, stochDC) and stochDC < 80
lBullStochCrossC = ta.crossover(stochKC, stochDC)  and stochDC < 20
sBullStochCrossC = ta.crossover(stochKC, stochDC)  and stochDC >= 20

// Multi-timeframe 1h — anti-repaint via lookahead_on + previous closed bar [1]
// Returns the values from the *previous* HTF bar so the signal never changes
// once a chart bar closes (even if the current HTF bar is still forming).
get1hCross() =>
    [r, k, d, lBear, sBear, lBull, sBull] = getStochRsiCross(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)
    [r[1], k[1], d[1], lBear[1], sBear[1], lBull[1], sBull[1]]

[rsi1h, k1h, d1h, lBearCross1h, sBearCross1h, lBullCross1h, sBullCross1h] = request.security(syminfo.tickerid, "60", get1hCross(), lookahead = barmerge.lookahead_on)

// TODO V2: implement 4H / 1D / 1W using inputShow4H / inputShow1D / inputShow1W
//          on the same get*Cross() pattern with lookahead_on + [1].

srColor = lBullStochCrossC or sBullStochCrossC or lBullCrossC or sBullCrossC
   ? (lBullStochCrossC or lBullCrossC ? color.new(colorLong, 0)  : color.new(colorLong, 60))
   : (lBearStochCrossC or lBearCrossC ? color.new(colorShort, 0) : color.new(colorShort, 60))

plotshape(inputShowC and inputShowStochRsiCrosses and ((timeframe.isintraday and not (timeframe.multiplier == 240 or timeframe.multiplier == 60)) or inputShowOnlyC) and (lBearStochCrossC or sBearStochCrossC or lBullStochCrossC or sBullStochCrossC or lBearCrossC or sBearCrossC or lBullCrossC or sBullCrossC) ? close : na, title='Cross Stoch RSI Current TF', style=shape.circle, text='', location=location.absolute, color=srColor)

////////////////////////////////////////////////////////////////////////////////
// SAR

dummy1            = input.bool(false, title='//////////////////////////////')
inputShowSar      = input.bool(false, title='SAR')
dummy11           = input.bool(false, title=' ')
inputStartSar     = input.float(0.2, title='Start',     minval=0.1)
inputIncSar       = input.float(0.2, title='Increment', minval=0.1)
inputMaxSar       = input.float(0.2, title='Maximum',   minval=0.1)
inputLineWidthSar = input.int(2,     title='Line width', minval=1, maxval=5)

sarValue = ta.sar(inputStartSar, inputIncSar, inputMaxSar)
plot(inputShowSar ? sarValue : na, style=plot.style_cross, linewidth=inputLineWidthSar, color=sarValue <= low ? colorGreen : colorRed)

////////////////////////////////////////////////////////////////////////////////
// Custom alerts

alertcondition(lBearCross1h or lBearCrossC,                                       title='Sell signal',         message='[ema-stochastic-strategy-v1] Sell signal')
alertcondition(lBullCross1h or lBullCrossC,                                       title='Buy signal',          message='[ema-stochastic-strategy-v1] Buy signal')
alertcondition(lBullCross1h or lBearCross1h or lBullCrossC or lBearCrossC,        title='Buy or sell signal',  message='[ema-stochastic-strategy-v1] Buy or sell signal')
