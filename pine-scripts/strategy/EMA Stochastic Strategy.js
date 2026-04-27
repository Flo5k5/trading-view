// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=6
indicator(title='EMA/Stochastic Strategy - Flo5k5', shorttitle='EMA/Stoch', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth   = 1
colorBlue   = #00FFFF
colorGreen  = #00FF00
colorYellow = #FFEB3B
colorOrange = #FF9800
colorRed    = #F44336
colorPurple = #9C27B0
colorLong   = #00FEFF
colorShort  = #EC03EA

// Convention couleurs par période (court → long terme) :
//   period ≤ 10  : bleu    (typique 7, 9)
//   ≤ 30         : vert    (20, 21)
//   ≤ 75         : jaune   (50)
//   ≤ 150        : orange  (100)
//   ≤ 250        : rouge   (200)
//   > 250        : violet  (300+)
maColor(period) =>
    period <= 10  ? colorBlue
     : period <= 30  ? colorGreen
     : period <= 75  ? colorYellow
     : period <= 150 ? colorOrange
     : period <= 250 ? colorRed
     :                 colorPurple

////////////////////////////////////////////////////////////////////////////////
// Moving Averages

GROUP_MA = 'Moving Averages'

inputShowSmas        = input.bool(true,  title='Show MAs',                          group=GROUP_MA)
inputMa1             = input.int(9,      title='MA 1 length (default 9 → bleu)',    minval=0, group=GROUP_MA)
inputSmoothingMa1    = input.string('EMA', title='MA 1 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa1         = input.bool(false, title='Show MA 1',                         group=GROUP_MA)
inputMa2             = input.int(20,     title='MA 2 length (default 20 → vert)',   minval=0, group=GROUP_MA)
inputSmoothingMa2    = input.string('EMA', title='MA 2 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa2         = input.bool(true,  title='Show MA 2',                         group=GROUP_MA)
inputMa3             = input.int(50,     title='MA 3 length (default 50 → jaune)',  minval=0, group=GROUP_MA)
inputSmoothingMa3    = input.string('EMA', title='MA 3 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa3         = input.bool(true,  title='Show MA 3',                         group=GROUP_MA)
inputMa4             = input.int(100,    title='MA 4 length (default 100 → orange)', minval=0, group=GROUP_MA)
inputSmoothingMa4    = input.string('EMA', title='MA 4 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa4         = input.bool(false, title='Show MA 4',                         group=GROUP_MA)
inputMa5             = input.int(200,    title='MA 5 length (default 200 → rouge)', minval=0, group=GROUP_MA)
inputSmoothingMa5    = input.string('EMA', title='MA 5 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa5         = input.bool(true,  title='Show MA 5',                         group=GROUP_MA)
inputMa6             = input.int(300,    title='MA 6 length (default 300 → violet)', minval=0, group=GROUP_MA)
inputSmoothingMa6    = input.string('EMA', title='MA 6 smoothing', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'], group=GROUP_MA)
inputShowMa6         = input.bool(false, title='Show MA 6',                         group=GROUP_MA)
inputLinewidth       = input.int(1,      title='Line width',  minval=1, maxval=5,   group=GROUP_MA)
inputSmaTransparency = input.int(20,     title='Transparency', minval=0, maxval=100, group=GROUP_MA)
inputAlmaOffset      = input.float(0.85, title='ALMA Offset',  minval=0,            group=GROUP_MA)
inputAlmaSigma       = input.float(6,    title='ALMA Sigma',   minval=0,            group=GROUP_MA)
inputMaIsLog         = input.bool(true,  title='Logarithmic',                       group=GROUP_MA)

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
ma6 = getMa(close, inputMa6, inputSmoothingMa6, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)

// Couleur dérivée de la période (cf. maColor) : si l'utilisateur change la
// période d'un slot, la couleur s'adapte automatiquement à la convention.
plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=color.new(maColor(inputMa1), inputSmaTransparency), linewidth=inputLinewidth, title='MA 1')
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=color.new(maColor(inputMa2), inputSmaTransparency), linewidth=inputLinewidth, title='MA 2')
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=color.new(maColor(inputMa3), inputSmaTransparency), linewidth=inputLinewidth, title='MA 3')
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=color.new(maColor(inputMa4), inputSmaTransparency), linewidth=inputLinewidth, title='MA 4')
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=color.new(maColor(inputMa5), inputSmaTransparency), linewidth=inputLinewidth, title='MA 5')
plot(inputShowSmas and inputShowMa6 and ma6 != 0 ? ma6 : na, color=color.new(maColor(inputMa6), inputSmaTransparency), linewidth=inputLinewidth, title='MA 6')

////////////////////////////////////////////////////////////////////////////////
// Price/MA cross signals — restored from the original 10 Moving Averages script.
// Drops a snowflake (❄) below the bar when price crosses under the chosen MA,
// a sun (☀) above the bar when price crosses over. The target MA is picked via
// dropdown so the same script can be used for short-term (MA1) or long-term
// (MA5/MA6) reactive entries.

GROUP_SIG = 'Price/MA cross signals'

inputShowSignal      = input.bool(false, title='Show price/MA cross signals', group=GROUP_SIG)
inputMaSignalUnder   = input.string('MA3', title='Price crossing UNDER',  options=['MA1', 'MA2', 'MA3', 'MA4', 'MA5', 'MA6'], group=GROUP_SIG)
inputMaSignalOver    = input.string('MA3', title='Price crossing OVER',   options=['MA1', 'MA2', 'MA3', 'MA4', 'MA5', 'MA6'], group=GROUP_SIG)

pickMa(label) =>
    label == 'MA1' ? ma1
     : label == 'MA2' ? ma2
     : label == 'MA3' ? ma3
     : label == 'MA4' ? ma4
     : label == 'MA5' ? ma5
     :                  ma6

// Pine v6 short-circuit evaluation skips the right operand when the left is
// false, which can desynchronize ta.* historical state. Compute the cross
// flags unconditionally and gate visibility with the toggle.
maUnder          = pickMa(inputMaSignalUnder)
maOver           = pickMa(inputMaSignalOver)
crossUnderRaw    = ta.crossunder(close, maUnder)
crossOverRaw     = ta.crossover(close,  maOver)
signalCrossUnder = inputShowSignal and crossUnderRaw
signalCrossOver  = inputShowSignal and crossOverRaw

plotchar(signalCrossUnder, title='Price crossing under MA', char='❄', location=location.belowbar, color=color.white, editable=true, size=size.auto)
plotchar(signalCrossOver,  title='Price crossing over MA',  char='☀', location=location.abovebar, color=color.white, editable=true, size=size.auto)

////////////////////////////////////////////////////////////////////////////////
// Stoch RSI — multi-timeframe cross detection (anti-repaint via lookahead_on + [1])

GROUP_SR = 'Stoch RSI MTF'

inputShowStochRsiCrosses = input.bool(true,  title='Show Stoch RSI crosses',  group=GROUP_SR)
inputLengthRsi           = input.int(14,    title='RSI Length',    minval=1,  group=GROUP_SR)
inputLengthStoch         = input.int(14,    title='Stoch Length',  minval=1,  group=GROUP_SR)
inputSmoothK             = input.int(3,     title='Smooth K',      minval=1,  group=GROUP_SR)
inputSmoothD             = input.int(3,     title='Smooth D',      minval=1,  group=GROUP_SR)
inputRsiSrc              = input.source(close, title='RSI Source',            group=GROUP_SR)
inputShowOnlyC           = input.bool(true,  title='Show only current TF',    group=GROUP_SR)
inputShowC               = input.bool(true,  title='Show current TF',         group=GROUP_SR)
inputShow1H              = input.bool(true,  title='Show 1h',                 group=GROUP_SR)
inputShow4H              = input.bool(true,  title='Show 4h',                 group=GROUP_SR)
inputShow12H             = input.bool(true,  title='Show 12h',                group=GROUP_SR)
inputShow1D              = input.bool(true,  title='Show D',                  group=GROUP_SR)
inputShow3D              = input.bool(true,  title='Show 3D',                 group=GROUP_SR)
inputShow1W              = input.bool(true,  title='Show W',                  group=GROUP_SR)

getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    rsi = ta.rsi(rsiSource, rsiLength)
    k   = ta.sma(ta.stoch(rsi, rsi, rsi, lengthStoch), smoothK)
    d   = ta.sma(k, smoothD)
    [rsi, k, d]

getStochRsiCross(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    [rsi, k, d] = getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD)
    lBearCross = ta.crossunder(k, d) and d >= 80
    sBearCross = ta.crossunder(k, d) and d < 80
    lBullCross = ta.crossover(k, d)  and d < 20
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
// Background — pick a single oscillator source via dropdown.
// Stacking multiple backgrounds just averages them into mud, so this section
// keeps it exclusive: pick one of {None, RSI, CCI, Stochastic, Stochastic RSI}.
//
// RSI uses 7 colored zones (configurable in the Style tab via input.color()):
//   ≥ Extremely Overbought  → Color 0  (rouge profond, default)
//   ≥ Overbought            → Color 1  (rouge)
//   ≥ Buy                   → Color 2  (transparent par défaut)
//   ≥ Neutral               → Color 3  (gris transparent)
//   ≥ Cold                  → Color 4  (gris transparent)
//   ≥ Oversold              → Color 5  (bleu)
//   < Oversold              → Color 6  (violet, extrêmement oversold)
//
// CCI / Stochastic / Stoch RSI use simpler 2-zone OB/OS tinting.

GROUP_BG       = 'Background — Source'
GROUP_BG_RSI   = 'Background — RSI mode'
GROUP_BG_CCI   = 'Background — CCI mode'
GROUP_BG_STOCH = 'Background — Stoch / Stoch RSI mode'
GROUP_BG_LBL   = 'Background — Cross labels'

inputBgSource       = input.string('RSI', title='Background source', options=['None', 'RSI', 'CCI', 'Stochastic', 'Stochastic RSI'], group=GROUP_BG)
inputShowBgColor    = input.bool(true,    title='Display background color',                                                          group=GROUP_BG)

// === RSI inputs (used when source = "RSI") ===
inputLengthRsiBg    = input.int(14,    title='RSI Length',                  minval=1,            group=GROUP_BG_RSI)
inputRsiSrcBg       = input.source(close, title='RSI Source',                                    group=GROUP_BG_RSI)
inputRsiExtOvs      = input.int(20,    title='RSI: Extremely Oversold',     minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiOvs         = input.int(30,    title='RSI: Oversold',               minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiCold        = input.int(40,    title='RSI: Cold',                   minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiNeu         = input.int(45,    title='RSI: Neutral',                minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiBuy         = input.int(55,    title='RSI: Buy',                    minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiOvb         = input.int(70,    title='RSI: Overbought',             minval=0, maxval=100, group=GROUP_BG_RSI)
inputRsiExtOvb      = input.int(80,    title='RSI: Extremely Overbought',   minval=0, maxval=100, group=GROUP_BG_RSI)

// === CCI inputs (used when source = "CCI") ===
inputLengthCciBg    = input.int(20,    title='CCI Length', minval=1,  group=GROUP_BG_CCI)
inputCciSrcBg       = input.source(close, title='CCI Source',         group=GROUP_BG_CCI)
inputCciOvs         = input.int(-100,  title='CCI: Oversold',         group=GROUP_BG_CCI)
inputCciOvb         = input.int(100,   title='CCI: Overbought',       group=GROUP_BG_CCI)

// === Stochastic / Stoch RSI inputs (length params shared between both) ===
inputBgStochLen     = input.int(14,    title='Stoch Length',       minval=1,           group=GROUP_BG_STOCH)
inputBgStochSmoothK = input.int(3,     title='Stoch Smooth K',     minval=1,           group=GROUP_BG_STOCH)
inputBgStochSmoothD = input.int(3,     title='Stoch Smooth D',     minval=1,           group=GROUP_BG_STOCH)
inputBgStochOvs     = input.int(20,    title='Stoch: Oversold',    minval=0, maxval=100, group=GROUP_BG_STOCH)
inputBgStochOvb     = input.int(80,    title='Stoch: Overbought',  minval=0, maxval=100, group=GROUP_BG_STOCH)
inputBgStochUseK    = input.bool(true, title='Use K',                                  group=GROUP_BG_STOCH)
inputBgStochUseD    = input.bool(true, title='Use D',                                  group=GROUP_BG_STOCH)

// === Cross labels (active for RSI and CCI sources only) ===
inputShowXOverOB    = input.bool(false, title='Label on cross over Overbought',                  group=GROUP_BG_LBL)
inputShowXUnderOB   = input.bool(true,  title='Label on cross under Overbought (bearish)',       group=GROUP_BG_LBL)
inputShowXOverOS    = input.bool(true,  title='Label on cross over Oversold (bullish)',          group=GROUP_BG_LBL)
inputShowXUnderOS   = input.bool(false, title='Label on cross under Oversold',                   group=GROUP_BG_LBL)
inputShowBgLength   = input.bool(true,  title='Display length on label',                         group=GROUP_BG_LBL)

// === 7 configurable RSI zone colors (visible in the Style tab) ===
inputBgRsiColor0    = input.color(color.new(#5C0000, 70),  title='RSI Color 0  (≥ Ext. Overbought)')
inputBgRsiColor1    = input.color(color.new(#FF0000, 80),  title='RSI Color 1  (Overbought → Ext. OB)')
inputBgRsiColor2    = input.color(color.new(#00FF00, 100), title='RSI Color 2  (Buy → Overbought)')
inputBgRsiColor3    = input.color(color.new(#808080, 95),  title='RSI Color 3  (Neutral → Buy)')
inputBgRsiColor4    = input.color(color.new(#808080, 95),  title='RSI Color 4  (Cold → Neutral)')
inputBgRsiColor5    = input.color(color.new(#2196F3, 80),  title='RSI Color 5  (Oversold → Cold)')
inputBgRsiColor6    = input.color(color.new(#5C00CC, 70),  title='RSI Color 6  (< Oversold)')

// === Compute oscillator values ===
rsiBg      = ta.rsi(inputRsiSrcBg, inputLengthRsiBg)
floorRsiBg = math.floor(rsiBg)

cciSma   = ta.sma(inputCciSrcBg, inputLengthCciBg)
cciDev   = ta.dev(inputCciSrcBg, inputLengthCciBg)
cciVal   = (inputCciSrcBg - cciSma) / (0.015 * cciDev)
floorCci = math.floor(cciVal)

stochBgK = ta.sma(ta.stoch(close, high, low, inputBgStochLen), inputBgStochSmoothK)
stochBgD = ta.sma(stochBgK, inputBgStochSmoothD)

[bgStochRsiR, bgStochRsiK, bgStochRsiD] = getStochRsi(inputRsiSrcBg, inputLengthRsiBg, inputBgStochLen, inputBgStochSmoothK, inputBgStochSmoothD)

// === Per-source background color resolvers ===
rsiBgZone() =>
    rsiBg >= inputRsiExtOvb ? inputBgRsiColor0
     : rsiBg >= inputRsiOvb  ? inputBgRsiColor1
     : rsiBg >= inputRsiBuy  ? inputBgRsiColor2
     : rsiBg >= inputRsiNeu  ? inputBgRsiColor3
     : rsiBg >= inputRsiCold ? inputBgRsiColor4
     : rsiBg >= inputRsiOvs  ? inputBgRsiColor5
     :                         inputBgRsiColor6

cciBgZone() =>
    cciVal >= inputCciOvb ? color.new(color.red,   80)
     : cciVal <= inputCciOvs ? color.new(color.green, 80)
     : na

stochBgZone() =>
    bullish = (inputBgStochUseK and stochBgK <= inputBgStochOvs) or (inputBgStochUseD and stochBgD <= inputBgStochOvs)
    bearish = (inputBgStochUseK and stochBgK >= inputBgStochOvb) or (inputBgStochUseD and stochBgD >= inputBgStochOvb)
    bearish ? color.new(color.red, 80) : bullish ? color.new(color.green, 80) : na

stochRsiBgZone() =>
    bullish = (inputBgStochUseK and bgStochRsiK <= inputBgStochOvs) or (inputBgStochUseD and bgStochRsiD <= inputBgStochOvs)
    bearish = (inputBgStochUseK and bgStochRsiK >= inputBgStochOvb) or (inputBgStochUseD and bgStochRsiD >= inputBgStochOvb)
    bearish ? color.new(color.red, 80) : bullish ? color.new(color.green, 80) : na

// === Apply selected background ===
chosenBgColor = inputShowBgColor
   ? (inputBgSource == 'RSI'            ? rsiBgZone()
   :  inputBgSource == 'CCI'            ? cciBgZone()
   :  inputBgSource == 'Stochastic'     ? stochBgZone()
   :  inputBgSource == 'Stochastic RSI' ? stochRsiBgZone()
   :                                      na)
   : na

bgcolor(color=chosenBgColor, title='Background color')

// === Cross labels — only meaningful for RSI and CCI sources ===
labelText = inputShowBgLength
   ? (inputBgSource == 'CCI' ? 'C' + str.tostring(inputLengthCciBg) : 'R' + str.tostring(inputLengthRsiBg))
   : (inputBgSource == 'CCI' ? 'C' : 'R')

// Pre-compute cross flags so Pine v6 short-circuit evaluation does not skip
// the ta.* calls inside the conditional below (cf. Price/MA cross signals).
rsiCrossOverOb  = ta.crossover(floorRsiBg, inputRsiOvb)
rsiCrossUnderOb = ta.crossunder(floorRsiBg, inputRsiOvb)
rsiCrossOverOs  = ta.crossover(floorRsiBg, inputRsiOvs)
rsiCrossUnderOs = ta.crossunder(floorRsiBg, inputRsiOvs)
cciCrossOverOb  = ta.crossover(floorCci, inputCciOvb)
cciCrossUnderOb = ta.crossunder(floorCci, inputCciOvb)
cciCrossOverOs  = ta.crossover(floorCci, inputCciOvs)
cciCrossUnderOs = ta.crossunder(floorCci, inputCciOvs)

// RSI cross labels (use Overbought / Oversold thresholds)
if inputBgSource == 'RSI' and inputShowXOverOB and rsiCrossOverOb
    label.new(bar_index, high + high * 0.002, text=labelText, color=color.lime, style=label.style_label_down, size=size.tiny)
if inputBgSource == 'RSI' and inputShowXUnderOB and rsiCrossUnderOb
    label.new(bar_index, high + high * 0.002, text=labelText, color=color.red,  style=label.style_label_down, size=size.tiny)
if inputBgSource == 'RSI' and inputShowXOverOS and rsiCrossOverOs
    label.new(bar_index, low - low * 0.002, text=labelText, color=color.lime, style=label.style_label_up, size=size.tiny)
if inputBgSource == 'RSI' and inputShowXUnderOS and rsiCrossUnderOs
    label.new(bar_index, low - low * 0.002, text=labelText, color=color.red,  style=label.style_label_up, size=size.tiny)

// CCI cross labels (use ±100 — configurable via inputCciOvb / inputCciOvs)
if inputBgSource == 'CCI' and inputShowXOverOB and cciCrossOverOb
    label.new(bar_index, high + high * 0.002, text=labelText, color=color.lime, style=label.style_label_down, size=size.tiny)
if inputBgSource == 'CCI' and inputShowXUnderOB and cciCrossUnderOb
    label.new(bar_index, high + high * 0.002, text=labelText, color=color.red,  style=label.style_label_down, size=size.tiny)
if inputBgSource == 'CCI' and inputShowXOverOS and cciCrossOverOs
    label.new(bar_index, low - low * 0.002, text=labelText, color=color.lime, style=label.style_label_up, size=size.tiny)
if inputBgSource == 'CCI' and inputShowXUnderOS and cciCrossUnderOs
    label.new(bar_index, low - low * 0.002, text=labelText, color=color.red,  style=label.style_label_up, size=size.tiny)

////////////////////////////////////////////////////////////////////////////////
// SAR

GROUP_SAR = 'Parabolic SAR'

inputShowSar      = input.bool(false, title='Show SAR',  group=GROUP_SAR)
inputStartSar     = input.float(0.2, title='Start',     minval=0.1, group=GROUP_SAR)
inputIncSar       = input.float(0.2, title='Increment', minval=0.1, group=GROUP_SAR)
inputMaxSar       = input.float(0.2, title='Maximum',   minval=0.1, group=GROUP_SAR)
inputLineWidthSar = input.int(2,     title='Line width', minval=1, maxval=5, group=GROUP_SAR)

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

// Price/MA cross signals — fire on the chosen MA
alertcondition(signalCrossUnder, title='Price crossing under MA', message='[ema-stochastic-strategy-v1] Price crossed UNDER selected MA')
alertcondition(signalCrossOver,  title='Price crossing over MA',  message='[ema-stochastic-strategy-v1] Price crossed OVER selected MA')
