// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title="Price Volume - Flo5k5", format=format.volume)
inputMa              = input(title='MA Length', type=input.integer, defval=9, minval=0)
inputSmoothingMa     = input(title='Smoothing MA1', defval='EMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])
inputShowMa          = input(title='Show MA', type=input.bool, defval=true)
inputLinewidth       = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
inputSmaTransparency = input(title='MA transparency', type=input.integer, defval=0, minval=0, maxval=100)

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

nv          = volume * close
ma1         = getMa(nv, inputMa, inputSmoothingMa, 0.85, 6, false)
colorBlue   = color.white
plot(nv, color=open > close ? color.red : color.green, title="RV", style=plot.style_columns)
plot(inputShowMa and ma1 != 0 ? ma1 : na, color=colorBlue, linewidth=inputLinewidth, transp=inputSmaTransparency, title='MA')
