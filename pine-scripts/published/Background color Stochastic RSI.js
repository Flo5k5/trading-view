// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Background color Stochastic RSI - Flo5k5', shorttitle='Stoch RSI Background - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

colorLong   = #00FEFF
colorShort  = #EC03EA

////////////////////////////////////////////////////////////////////////////////
// Background color

dummy3                = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowStochRsi     = input(title='Stochastic RSI', type=input.bool, defval=true)
dummy31               = input(title=' ', type=input.bool, defval=false)
inputLengthRsi        = input(type=input.integer, title='RSI Length', defval=14, minval=1)
inputLengthStoch      = input(type=input.integer, title='Stoch Length', defval=14, minval=1)
inputSmoothK          = input(type=input.integer, title='Smooth K', defval=3, minval=1)
inputSmoothD          = input(type=input.integer, title='Smooth D', defval=3, minval=1)
inputRsiSrc           = input(title='RSI Source', defval=close)
inputOvsLvl           = input(type=input.integer, title='Oversold level', defval=20, minval=0, maxval=100)
inputOvbLvl           = input(type=input.integer, title='Overbought level', defval=80, minval=0, maxval=100)
inputUseK             = input(title='Use K', type=input.bool, defval=true)
inputUseD             = input(title='Use D', type=input.bool, defval=true)

getStochRsi(rsiSource, rsiLength, lengthStoch, smoothK, smoothD) =>
    rsi = rsi(rsiSource, rsiLength)
    k   = sma(stoch(rsi, rsi, rsi, lengthStoch), smoothK)
    d   = sma(k, smoothD)
    [rsi, k, d]

[rsi, k, d]         = getStochRsi(inputRsiSrc, inputLengthRsi, inputLengthStoch, inputSmoothK, inputSmoothD)
backgroundColorBarK = inputUseK and k <= inputOvsLvl ? color.green : inputUseK and k >= inputOvbLvl ? color.red : na
backgroundColorBarD = inputUseD and d <= inputOvsLvl ? color.green : inputUseD and d >= inputOvbLvl ? color.red : na

bgcolor(color=backgroundColorBarK, title='Background color Stochastic RSI K', transp=90)
bgcolor(color=backgroundColorBarD, title='Background color Stochastic RSI D', transp=90)


