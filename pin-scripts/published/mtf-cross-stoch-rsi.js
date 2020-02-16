// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='MTF Cross Stochastic RSI - Flo5k5', shorttitle='MTF X Stoch RSI - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong   = #00FEFF
colorShort  = #EC03EA

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
