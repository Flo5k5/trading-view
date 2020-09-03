// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Background color RSI - Flo5k5', shorttitle='RSI Background - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong   = #00FEFF
colorShort  = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// Background color

inputShowBgRsi        = input(title='RSI', type=input.bool, defval=true)
dummy41               = input(title=' ', type=input.bool, defval=false)
inputLengthRsi        = input(type=input.integer, title='Length', defval=14, minval=1)
inputRsiSrc           = input(title='Source', defval=close)
inputOvsLvl           = input(type=input.integer, title='Oversold level', defval=30, minval=0, maxval=100)
inputOvbLvl           = input(type=input.integer, title='Overbought level', defval=70, minval=0, maxval=100)
dummy42               = input(title=' ', type=input.bool, defval=false)
inputShowBgColor      = input(title='Display background color', type=input.bool, defval=true)
inputShowXOverOB      = input(title='Display label when RSI crosses over Overbought level', type=input.bool, defval=false)
inputShowXUnderOB     = input(title='Display label when RSI crosses under Overbought level (bearish)', type=input.bool, defval=true)
inputShowXOverOS      = input(title='Display label when RSI crosses over Oversold level (bullish)', type=input.bool, defval=true)
inputShowXUnderOS     = input(title='Display label when RSI crosses under Oversold level', type=input.bool, defval=false)
dummy43               = input(title=' ', type=input.bool, defval=false)
inputShowLength       = input(title='Display length on label', type=input.bool, defval=true)

rsi                   = rsi(inputRsiSrc, inputLengthRsi)
floor_rsi             = floor(rsi)
backgroundColorBarRsi = inputShowBgColor ? (rsi <= inputOvsLvl ? color.green : (rsi >= inputOvbLvl  ? color.red : na)) : na

bgcolor(color=backgroundColorBarRsi, title='Background color RSI', transp=90)

textLabel = inputShowLength ? 'R'+tostring(inputLengthRsi) : 'R'

if inputShowXOverOB and crossover(floor_rsi, inputOvbLvl)
    label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.lime, style=label.style_labeldown, size=size.tiny)

if inputShowXUnderOB and crossunder(floor_rsi, inputOvbLvl)
    label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.red, style=label.style_labeldown, size=size.tiny)

if inputShowXOverOS and crossover(floor_rsi, inputOvsLvl)
    label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.lime, style=label.style_labelup, size=size.tiny)

if inputShowXUnderOS and crossunder(floor_rsi, inputOvsLvl)
    label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.red, style=label.style_labelup, size=size.tiny)
