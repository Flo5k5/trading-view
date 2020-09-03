// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Background color Stochastic RSI - Flo5k5', shorttitle='StochRSI background - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong         = #00FEFF
colorShort        = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// Stochastic

// dummy2           = input(title='//////////////////////////////', type=input.bool, defval=false)
// inputShowStochX  = input(title='Stochastic cross', type=input.bool, defval=true)
// dummy21          = input(title=' ', type=input.bool, defval=false)
// inputPeriodK     = input(type=input.integer, title='K', defval=14, minval=1)
// inputPeriodD     = input(type=input.integer, title='D', defval=3, minval=1)
// inputSmoothK     = input(type=input.integer, title='Smooth', defval=3, minval=1)

// k                = sma(stoch(close, high, low, inputPeriodK), inputSmoothK)
// d                = sma(k, inputPeriodD)

// largeBearStochX  = crossunder(k, d) and d >= 80
// smallBearStochX  = crossunder(k, d) and d < 80
// largeBullStochX  = crossover(k, d) and d < 20
// smallBullStochX  = crossover(k, d) and d >= 20

// plotColorStoch = largeBullStochX or smallBullStochX ? (largeBullStochX ? color.new(colorLong, 0) : color.new(colorLong, 50)) : (largeBearStochX ? color.new(colorShort, 0) : color.new(colorShort, 50))
// plotPositionStoch = inputShowStochX and (largeBearStochX or smallBearStochX or largeBullStochX or smallBullStochX) ? close : na

// plotshape(plotPositionStoch,  title='Cross Stochastic (circle)', style=shape.circle, text='', location=location.absolute, color=plotColorStoch)


////////////////////////////////////////////////////////////////////////////////
// Stochastic RSI

dummy3               = input(title='//////////////////////////////', type=input.bool, defval=false)
input                = input(title='Stochastic RSI cross', type=input.bool, defval=true)
dummy31              = input(title=' ', type=input.bool, defval=false)
inputSmoothKstoch    = input(type=input.integer, title='K', defval=3, minval=1)
inputSmoothD         = input(type=input.integer, title='D', defval=3, minval=1)
inputLengthRSI       = input(type=input.integer, title='RSI Length', defval=14, minval=1)
inputLengthStoch     = input(type=input.integer, title='Stochastic Length', defval=14, minval=1)
inputRsiSrc          = input(title='RSI Source', defval=close)
dummy32              = input(title=' ', type=input.bool, defval=false)
inputShowBgColor     = input(title='Display background color', type=input.bool, defval=true)
inputShowStrongBearX = input(title='Display strong bear cross (K x D >= 80)', type=input.bool, defval=true)
inputShowWeakBearX   = input(title='Display weak bear cross (K x D < 80)', type=input.bool, defval=true)
inputShowStrongBullX = input(title='Display strong bull cross (K x D < 20)', type=input.bool, defval=true)
inputShowWeakBullX   = input(title='Display weak bull cross (K x D >= 20)', type=input.bool, defval=true)

rsi1                 = rsi(inputRsiSrc, inputLengthRSI)
stochK               = sma(stoch(rsi1, rsi1, rsi1, inputLengthStoch), inputSmoothKstoch)
stochD               = sma(stochK, inputSmoothD)

largeBearStochrX     = crossunder(stochK, stochD) and stochD >= 80
smallBearStochrX     = crossunder(stochK, stochD) and stochD < 80
largeBullStochrX     = crossover(stochK, stochD) and stochD < 20
smallBullStochrX     = crossover(stochK, stochD) and stochD >= 20

// plotColorStochr  = largeBullStochrX or smallBullStochrX ? (largeBullStochrX ? color.new(colorLong, 0) : color.new(colorLong, 50)) : (largeBearStochrX ? color.new(colorShort, 0) : color.new(colorShort, 50))
// plotPositionStochr = inputShowBgColor and (largeBearStochrX or smallBearStochrX or largeBullStochrX or smallBullStochrX) ? close : na

// plotshape(plotPositionStochr,  title='Cross Stochastic RSI (xcross)', style=shape.xcross, text='', location=location.absolute, color=plotColorStochr)

textLabel = 'SR'

if inputShowStrongBearX and largeBearStochrX
    label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.red, style=label.style_labeldown, size=size.tiny)

// if inputShowWeakBearX and smallBearStochrX
//     label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.red, style=label.style_labeldown, size=size.tiny)

if inputShowStrongBullX and largeBullStochrX
    label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.lime, style=label.style_labelup, size=size.tiny)

// if inputShowWeakBullX and smallBullStochrX
//     label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.lime, style=label.style_labelup, size=size.tiny)

// if crossunder(stochD, 80)
//     label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.red, style=label.style_labeldown, size=size.tiny)

// if crossover(stochD, 20)
//     label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.lime, style=label.style_labelup, size=size.tiny)