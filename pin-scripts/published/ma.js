// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='5 moving averages - Flo5k5', shorttitle='5 MA - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth   = 1
colorBlue   = #00FFFF
colorGreen  = #00FF00
colorYellow = #FFEB3B
colorOrange = #FF9800
colorRed    = #F44336

////////////////////////////////////////////////////////////////////////////////
// MAs

dummy0               = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowSmas        = input(title='MAs', type=input.bool, defval=true)
dummy01              = input(title=' ', type=input.bool, defval=false)
inputMa1             = input(title='MA 1', type=input.integer, defval=9, minval=0)
inputSmoothingMa1    = input(title='Smoothing MA1', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa1         = input(title='Show MA 1', type=input.bool, defval=false)
dummy02              = input(title=' ', type=input.bool, defval=false)
inputMa2             = input(title='MA 2', type=input.integer, defval=21, minval=0)
inputSmoothingMa2    = input(title='Smoothing MA2', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa2         = input(title='Show MA 2', type=input.bool, defval=false)
dummy03              = input(title=' ', type=input.bool, defval=false)
inputMa3             = input(title='MA 3', type=input.integer, defval=20, minval=0)
inputSmoothingMa3    = input(title='Smoothing MA3', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa3         = input(title='Show MA 3', type=input.bool, defval=true)
dummy04              = input(title=' ', type=input.bool, defval=false)
inputMa4             = input(title='MA 4', type=input.integer, defval=50, minval=0)
inputSmoothingMa4    = input(title='Smoothing MA4', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa4         = input(title='Show MA 4', type=input.bool, defval=true)
dummy05              = input(title=' ', type=input.bool, defval=false)
inputMa5             = input(title='MA 5', type=input.integer, defval=200, minval=0)
inputSmoothingMa5    = input(title='Smoothing MA5', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa5         = input(title='Show MA 5', type=input.bool, defval=true)
dummy06              = input(title=' ', type=input.bool, defval=false)
inputLinewidth       = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)
inputSmaTransparency = input(title='MA transparency', type=input.integer, defval=20, minval=0, maxval=100)
inputAlmaOffset      = input(title='ALMA Offset', defval=0.85, minval=1)
inputAlmaSigma       = input(title='ALMA Sigma', defval=6, minval=0)
inputMaIsLog         = input(title='Logarithmic', type=input.bool, defval=true)

getMa(src, length, maType, almaOffset, almaSigma, isLog) => 
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

ma1 = getMa(close, inputMa1, inputSmoothingMa1, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma2 = getMa(close, inputMa2, inputSmoothingMa2, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma3 = getMa(close, inputMa3, inputSmoothingMa3, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma4 = getMa(close, inputMa4, inputSmoothingMa4, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)
ma5 = getMa(close, inputMa5, inputSmoothingMa5, inputAlmaOffset, inputAlmaSigma, inputMaIsLog)

plot(inputShowSmas and inputShowMa1 and ma1 != 0 ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 1')
plot(inputShowSmas and inputShowMa2 and ma2 != 0 ? ma2 : na, color=colorGreen, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 2')
plot(inputShowSmas and inputShowMa3 and ma3 != 0 ? ma3 : na, color=colorYellow, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 3')
plot(inputShowSmas and inputShowMa4 and ma4 != 0 ? ma4 : na, color=colorOrange, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 4')
plot(inputShowSmas and inputShowMa5 and ma5 != 0 ? ma5 : na, color=colorRed, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA 5')
