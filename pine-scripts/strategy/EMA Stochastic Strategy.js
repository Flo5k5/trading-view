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
inputSmoothingMa3    = input.string('EMA', title='Smoothing MA3', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
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
inputLinewidth       = input.int(1, title='Line width', minval=1, maxval=5)
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
inputShow12H             = input.bool(true, title='Show 12h')
inputShow1D              = input.bool(true, title='Show D')
inputShow3D              = input.bool(true, title='Show 3D')
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

// Multi-timeframe stack — anti-repaint via lookahead_on + previous closed bar [1].
// Returns the values from the *previous* HTF bar so the signal never changes
// once a chart bar closes (even if the current HTF bar is still forming).
//
// Trade-off: signals arrive 1 HTF bar delayed (e.g. 60 min on 1h, 4h on 4h, etc.),
// which is appropriate for event-driven alerting. See TradingView's Repainting
// concepts guide for details.
getStochRsiCrossPrev() =>
    [r, k, d, lBear, sBear, lBull, sBull] = getStochRsiCross(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)
    [r[1], k[1], d[1], lBear[1], sBear[1], lBull[1], sBull[1]]

[rsi1h,  k1h,  d1h,  lBearCross1h,  sBearCross1h,  lBullCross1h,  sBullCross1h]  = request.security(syminfo.tickerid, "60",  getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)
[rsi4h,  k4h,  d4h,  lBearCross4h,  sBearCross4h,  lBullCross4h,  sBullCross4h]  = request.security(syminfo.tickerid, "240", getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)
[rsi12h, k12h, d12h, lBearCross12h, sBearCross12h, lBullCross12h, sBullCross12h] = request.security(syminfo.tickerid, "720", getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)
[rsi1D,  k1D,  d1D,  lBearCross1D,  sBearCross1D,  lBullCross1D,  sBullCross1D]  = request.security(syminfo.tickerid, "D",   getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)
[rsi3D,  k3D,  d3D,  lBearCross3D,  sBearCross3D,  lBullCross3D,  sBullCross3D]  = request.security(syminfo.tickerid, "3D",  getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)
[rsi1W,  k1W,  d1W,  lBearCross1W,  sBearCross1W,  lBullCross1W,  sBullCross1W]  = request.security(syminfo.tickerid, "W",   getStochRsiCrossPrev(), lookahead = barmerge.lookahead_on)

srColor = lBullStochCrossC or sBullStochCrossC or lBullCrossC or sBullCrossC
   ? (lBullStochCrossC or lBullCrossC ? color.new(colorLong, 0)  : color.new(colorLong, 60))
   : (lBearStochCrossC or lBearCrossC ? color.new(colorShort, 0) : color.new(colorShort, 60))

// Helper: bull cross color when bull, bear cross color when bear (or na otherwise)
crossColor(lBull, sBull, lBear, sBear) =>
    lBull or sBull ? (lBull ? color.new(colorLong, 0)  : color.new(colorLong,  60))
                   : (lBear ? color.new(colorShort, 0) : color.new(colorShort, 60))

plotshape(inputShowC and inputShowStochRsiCrosses and ((timeframe.isintraday and not (timeframe.multiplier == 240 or timeframe.multiplier == 60)) or inputShowOnlyC) and (lBearStochCrossC or sBearStochCrossC or lBullStochCrossC or sBullStochCrossC or lBearCrossC or sBearCrossC or lBullCrossC or sBullCrossC) ? close : na, title='Cross Stoch RSI Current TF', style=shape.circle, text='', location=location.absolute, color=srColor)

// Higher timeframe plots — only when "Show only current TF" is OFF
plotshape(not inputShowOnlyC and inputShow1H  and inputShowStochRsiCrosses and (lBearCross1h  or sBearCross1h  or lBullCross1h  or sBullCross1h)  ? close : na, title='Cross Stoch RSI 1H',  style=shape.circle, text='1H',  location=location.absolute, color=crossColor(lBullCross1h,  sBullCross1h,  lBearCross1h,  sBearCross1h))
plotshape(not inputShowOnlyC and inputShow4H  and inputShowStochRsiCrosses and (lBearCross4h  or sBearCross4h  or lBullCross4h  or sBullCross4h)  ? close : na, title='Cross Stoch RSI 4H',  style=shape.circle, text='4H',  location=location.absolute, color=crossColor(lBullCross4h,  sBullCross4h,  lBearCross4h,  sBearCross4h))
plotshape(not inputShowOnlyC and inputShow12H and inputShowStochRsiCrosses and (lBearCross12h or sBearCross12h or lBullCross12h or sBullCross12h) ? close : na, title='Cross Stoch RSI 12H', style=shape.circle, text='12H', location=location.absolute, color=crossColor(lBullCross12h, sBullCross12h, lBearCross12h, sBearCross12h))
plotshape(not inputShowOnlyC and inputShow1D  and inputShowStochRsiCrosses and (lBearCross1D  or sBearCross1D  or lBullCross1D  or sBullCross1D)  ? close : na, title='Cross Stoch RSI D',   style=shape.circle, text='D',   location=location.absolute, color=crossColor(lBullCross1D,  sBullCross1D,  lBearCross1D,  sBearCross1D))
plotshape(not inputShowOnlyC and inputShow3D  and inputShowStochRsiCrosses and (lBearCross3D  or sBearCross3D  or lBullCross3D  or sBullCross3D)  ? close : na, title='Cross Stoch RSI 3D',  style=shape.circle, text='3D',  location=location.absolute, color=crossColor(lBullCross3D,  sBullCross3D,  lBearCross3D,  sBearCross3D))
plotshape(not inputShowOnlyC and inputShow1W  and inputShowStochRsiCrosses and (lBearCross1W  or sBearCross1W  or lBullCross1W  or sBullCross1W)  ? close : na, title='Cross Stoch RSI W',   style=shape.circle, text='W',   location=location.absolute, color=crossColor(lBullCross1W,  sBullCross1W,  lBearCross1W,  sBearCross1W))

////////////////////////////////////////////////////////////////////////////////
// RSI background — overbought/oversold zones tinted on the chart background
// (adapted from "Background color RSI - Flo5k5", migrated to v6 here)

dummy4              = input.bool(false, title='//////////////////////////////')
inputShowBgRsi      = input.bool(true,  title='RSI background')
dummy41             = input.bool(false, title=' ')
inputLengthRsiBg    = input.int(14,    title='RSI BG Length', minval=1)
inputRsiSrcBg       = input.source(close, title='RSI BG Source')
inputOvsLvl         = input.int(30,    title='Oversold level',   minval=0, maxval=100)
inputOvbLvl         = input.int(70,    title='Overbought level', minval=0, maxval=100)
dummy42             = input.bool(false, title=' ')
inputShowBgColor    = input.bool(true,  title='Display background color')
inputShowXOverOB    = input.bool(false, title='Label on RSI cross over Overbought')
inputShowXUnderOB   = input.bool(true,  title='Label on RSI cross under Overbought (bearish)')
inputShowXOverOS    = input.bool(true,  title='Label on RSI cross over Oversold (bullish)')
inputShowXUnderOS   = input.bool(false, title='Label on RSI cross under Oversold')
dummy43             = input.bool(false, title=' ')
inputShowRsiLength  = input.bool(true,  title='Display RSI length on label')

rsiBg      = ta.rsi(inputRsiSrcBg, inputLengthRsiBg)
floorRsiBg = math.floor(rsiBg)
bgRsiColor = inputShowBgRsi and inputShowBgColor
   ? (rsiBg <= inputOvsLvl ? color.new(color.green, 90)
   :  rsiBg >= inputOvbLvl ? color.new(color.red,   90)
   :                          na)
   : na

bgcolor(color=bgRsiColor, title='Background color RSI')

rsiBgLabel = inputShowRsiLength ? 'R' + str.tostring(inputLengthRsiBg) : 'R'

if inputShowBgRsi and inputShowXOverOB and ta.crossover(floorRsiBg, inputOvbLvl)
    label.new(bar_index, high + high * 0.002, text=rsiBgLabel, color=color.lime, style=label.style_label_down, size=size.tiny)

if inputShowBgRsi and inputShowXUnderOB and ta.crossunder(floorRsiBg, inputOvbLvl)
    label.new(bar_index, high + high * 0.002, text=rsiBgLabel, color=color.red,  style=label.style_label_down, size=size.tiny)

if inputShowBgRsi and inputShowXOverOS and ta.crossover(floorRsiBg, inputOvsLvl)
    label.new(bar_index, low - low * 0.002, text=rsiBgLabel, color=color.lime, style=label.style_label_up, size=size.tiny)

if inputShowBgRsi and inputShowXUnderOS and ta.crossunder(floorRsiBg, inputOvsLvl)
    label.new(bar_index, low - low * 0.002, text=rsiBgLabel, color=color.red,  style=label.style_label_up, size=size.tiny)

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
//
// Per-timeframe: pick which ones to enable in TradingView's alert UI. Only the
// "long" cross variants (k crosses d while d in extreme zone) are exposed —
// the "short" variants trigger too often to be useful as alerts.

// Current timeframe
alertcondition(lBearCrossC,  title='Sell signal C',   message='[ema-stochastic-strategy-v1] Sell signal — current TF')
alertcondition(lBullCrossC,  title='Buy signal C',    message='[ema-stochastic-strategy-v1] Buy signal — current TF')

// Higher timeframes (anti-repaint via lookahead_on + [1])
alertcondition(lBearCross1h,  title='Sell signal 1H',  message='[ema-stochastic-strategy-v1] Sell signal — 1H')
alertcondition(lBullCross1h,  title='Buy signal 1H',   message='[ema-stochastic-strategy-v1] Buy signal — 1H')
alertcondition(lBearCross4h,  title='Sell signal 4H',  message='[ema-stochastic-strategy-v1] Sell signal — 4H')
alertcondition(lBullCross4h,  title='Buy signal 4H',   message='[ema-stochastic-strategy-v1] Buy signal — 4H')
alertcondition(lBearCross12h, title='Sell signal 12H', message='[ema-stochastic-strategy-v1] Sell signal — 12H')
alertcondition(lBullCross12h, title='Buy signal 12H',  message='[ema-stochastic-strategy-v1] Buy signal — 12H')
alertcondition(lBearCross1D,  title='Sell signal D',   message='[ema-stochastic-strategy-v1] Sell signal — Daily')
alertcondition(lBullCross1D,  title='Buy signal D',    message='[ema-stochastic-strategy-v1] Buy signal — Daily')
alertcondition(lBearCross3D,  title='Sell signal 3D',  message='[ema-stochastic-strategy-v1] Sell signal — 3-Day')
alertcondition(lBullCross3D,  title='Buy signal 3D',   message='[ema-stochastic-strategy-v1] Buy signal — 3-Day')
alertcondition(lBearCross1W,  title='Sell signal W',   message='[ema-stochastic-strategy-v1] Sell signal — Weekly')
alertcondition(lBullCross1W,  title='Buy signal W',    message='[ema-stochastic-strategy-v1] Buy signal — Weekly')

// Aggregated (any timeframe)
alertcondition(lBearCrossC or lBearCross1h or lBearCross4h or lBearCross12h or lBearCross1D or lBearCross3D or lBearCross1W,
   title='Sell signal ANY', message='[ema-stochastic-strategy-v1] Sell signal — any TF')
alertcondition(lBullCrossC or lBullCross1h or lBullCross4h or lBullCross12h or lBullCross1D or lBullCross3D or lBullCross1W,
   title='Buy signal ANY',  message='[ema-stochastic-strategy-v1] Buy signal — any TF')
