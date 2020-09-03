// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Background color Stochastic - Flo5k5', shorttitle='Stoch Background - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong   = #00FEFF
colorShort  = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// Background color

dummy3                = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowStochRsi     = input(title='Stochastic', type=input.bool, defval=true)
dummy31               = input(title=' ', type=input.bool, defval=false)
inputK                = input(type=input.integer, title='K', defval=14, minval=1)
inputD                = input(type=input.integer, title='D', defval=3, minval=1)
inputSmooth           = input(type=input.integer, title='Smooth', defval=3, minval=1)
inputOvsLvl           = input(type=input.integer, title='Oversold level', defval=20, minval=0, maxval=100)
inputOvbLvl           = input(type=input.integer, title='Overbought level', defval=80, minval=0, maxval=100)
inputUseK             = input(title='Use K', type=input.bool, defval=true)
inputUseD             = input(title='Use D', type=input.bool, defval=true)

k = sma(stoch(close, high, low, inputK), inputSmooth)
d = sma(k, inputD)

backgroundColorBarK = inputUseK and k <= inputOvsLvl ? color.green : inputUseK and k >= inputOvbLvl ? color.red : na
backgroundColorBarD = inputUseD and d <= inputOvsLvl ? color.green : inputUseD and d >= inputOvbLvl ? color.red : na

bgcolor(color=backgroundColorBarK, title='Background color Stochastic K', transp=90)
bgcolor(color=backgroundColorBarD, title='Background color Stochastic D', transp=90)
