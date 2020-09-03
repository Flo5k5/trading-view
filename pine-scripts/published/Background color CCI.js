// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Background color CCI - Flo5k5', shorttitle='CCI Background - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong   = #00FEFF
colorShort  = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// Background color

inputCci            = input(title='CCI', type=input.bool, defval=true)
dummy41             = input(title=' ', type=input.bool, defval=false)
length              = input(20, minval=1)
src                 = input(close, title='Source')
dummy42             = input(title=' ', type=input.bool, defval=false)
inputShowBgColor    = input(title='Display background color', type=input.bool, defval=true)
inputShowXOver100   = input(title='Display label when CCI crosses over 100', type=input.bool, defval=false)
inputShowXUnder100  = input(title='Display label when CCI crosses under 100 (bearish)', type=input.bool, defval=true)
inputShowXOverM100  = input(title='Display label when CCI crosses over -100 (bullish)', type=input.bool, defval=true)
inputShowXUnderM100 = input(title='Display label when CCI crosses under -100', type=input.bool, defval=false)
dummy43             = input(title=' ', type=input.bool, defval=false)
inputShowLength     = input(title='Display length on label', type=input.bool, defval=false)

ma             = sma(src, length)
cci            = (src - ma) / (0.015 * dev(src, length))
floor_cci      = floor(cci)

backgroundColorBarCci = inputShowBgColor ? (cci <= -100 ? color.green : (cci >= 100  ? color.red : na)) : na
bgcolor(color=backgroundColorBarCci, title='Background color CCI', transp=90)

textLabel = inputShowLength ? 'C'+tostring(length) : 'C'

if inputShowXOver100 and crossover(floor_cci, 100)
    label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.lime, style=label.style_labeldown, size=size.tiny)

if inputShowXUnder100 and crossunder(floor_cci, 100)
    label.new(bar_index, (high + high * 0.002), text=textLabel, color=color.red, style=label.style_labeldown, size=size.tiny)

if inputShowXOverM100 and crossover(floor_cci, -100)
    label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.lime, style=label.style_labelup, size=size.tiny)

if inputShowXUnderM100 and crossunder(floor_cci, -100)
    label.new(bar_index, (low - low * 0.002), text=textLabel, color=color.red, style=label.style_labelup, size=size.tiny)
