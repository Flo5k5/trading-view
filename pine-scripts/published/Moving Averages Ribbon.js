// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Moving Averages Ribbon - Flo5k5', shorttitle='MA Ribbon - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth     = 1
colorBlue     = #00FFFF
colorGreen    = #00FF00
colorYellow   = #FFEB3B
colorOrange   = #FF9800
colorRed      = #F44336
colorDarkBlue = #017567

////////////////////////////////////////////////////////////////////////////////
// MAs

dummy0               = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowSmas        = input(title='MAs', type=input.bool, defval=true)
inputSmoothingMa     = input(title='Smoothing', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
dummy01              = input(title=' ', type=input.bool, defval=false)
inputShowMa1         = input(title='MA 1', type=input.bool, defval=true)
inputMa1             = input(title='Length', type=input.integer, defval=10, minval=0)
dummy02              = input(title=' ', type=input.bool, defval=false)
inputShowMa2         = input(title='MA 2', type=input.bool, defval=true)
inputMa2             = input(title='Length', type=input.integer, defval=20, minval=0)
dummy03              = input(title=' ', type=input.bool, defval=false)
inputShowMa3         = input(title='MA 3', type=input.bool, defval=true)
inputMa3             = input(title='Length', type=input.integer, defval=30, minval=0)
dummy04              = input(title=' ', type=input.bool, defval=false)
inputShowMa4         = input(title='MA 4', type=input.bool, defval=true)
inputMa4             = input(title='Length', type=input.integer, defval=40, minval=0)
dummy05              = input(title=' ', type=input.bool, defval=false)
inputShowMa5         = input(title='MA 5', type=input.bool, defval=true)
inputMa5             = input(title='Length', type=input.integer, defval=50, minval=0)
dummy06              = input(title=' ', type=input.bool, defval=false)
inputShowMa6         = input(title='MA 6', type=input.bool, defval=true)
inputMa6             = input(title='Length', type=input.integer, defval=60, minval=0)
dummy07              = input(title=' ', type=input.bool, defval=false)
inputShowMa7         = input(title='MA 7', type=input.bool, defval=true)
inputMa7             = input(title='Length', type=input.integer, defval=70, minval=0)
dummy08              = input(title=' ', type=input.bool, defval=false)
inputShowMa8         = input(title='MA 8', type=input.bool, defval=true)
inputMa8             = input(title='Length', type=input.integer, defval=80, minval=0)
dummy09              = input(title=' ', type=input.bool, defval=false)
inputShowMa9         = input(title='MA 9', type=input.bool, defval=true)
inputMa9             = input(title='Length', type=input.integer, defval=90, minval=0)
dummy10              = input(title=' ', type=input.bool, defval=false)
inputShowMa10        = input(title='MA 10', type=input.bool, defval=true)
inputMa10            = input(title='Length', type=input.integer, defval=100, minval=0)
dummy11              = input(title=' ', type=input.bool, defval=false)
inputLinewidth       = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)
inputSmaTransparency = input(title='MA transparency', type=input.integer, defval=20, minval=0, maxval=100)
inputAlmaOffset      = input(title='ALMA Offset', defval=0.85, minval=1)
inputAlmaSigma       = input(title='ALMA Sigma', defval=6, minval=0)
inputMaIsLog         = input(title='Logarithmic', type=input.bool, defval=true)

getMa(src, length, maType, almaOffset, almaSigma) => 
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

ma1 = getMa(close, inputMa1, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma2 = getMa(close, inputMa2, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma3 = getMa(close, inputMa3, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma4 = getMa(close, inputMa4, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma5 = getMa(close, inputMa5, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma6 = getMa(close, inputMa6, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma7 = getMa(close, inputMa7, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma8 = getMa(close, inputMa8, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma9 = getMa(close, inputMa9, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)
ma10 = getMa(close, inputMa10, inputSmoothingMa, inputAlmaOffset, inputAlmaSigma)

plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 1')
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=colorGreen, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 2')
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=colorYellow, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 3')
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=colorOrange, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 4')
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=colorRed, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 5')
plot(inputShowSmas and inputShowMa6 and ma6 != 0 ? ma6 : na, color=colorDarkBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 6')
plot(inputShowSmas and inputShowMa7 and ma7 != 0 ? ma7 : na, color=colorDarkBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 7')
plot(inputShowSmas and inputShowMa8 and ma8 != 0 ? ma8 : na, color=colorDarkBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 8')
plot(inputShowSmas and inputShowMa9 and ma9 != 0 ? ma9 : na, color=colorDarkBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 9')
plot(inputShowSmas and inputShowMa10 and ma10 != 0 ? ma10 : na, color=colorDarkBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 10')
