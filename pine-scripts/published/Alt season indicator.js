// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Alt season indicator - Flo5k5', shorttitle='Alt szn - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Alt szn
// [TODO]: add a check to exclude non crypto assets from this feature
// [TODO]: add smoothing choice for MA

dummy7             = input(title='//////////////////////////////', type=input.bool, defval=false)
inputDisplayAltSzn = input(title='Alt dominance SMA cross', type=input.bool, defval=false)
dummy71            = input(title=' ', type=input.bool, defval=false)
inputMaAltSzn      = input(title='SMA', type=input.integer, defval=20, minval=1)
inputSmoothing     = input(title='Smoothing', defval='SMA', options=['RMA', 'SMA', 'EMA', 'WMA', 'VWMA', 'SMMA', 'HullMA', 'LSMA', 'DEMA', 'TEMA'])

closeBtcDom        = security('CRYPTOCAP:BTC.D', timeframe.period, close)
smaBtcDom          = security('CRYPTOCAP:BTC.D', timeframe.period, sma(close, inputMaAltSzn))

plotchar(inputDisplayAltSzn and crossunder(closeBtcDom, smaBtcDom), title='BTC dominance crossing under MA', char='☀,', transp=0, location=location.belowbar, color=color.white, editable=true, size=size.auto)
plotchar(inputDisplayAltSzn and crossover(closeBtcDom, smaBtcDom), title='BTC Dominance crossing over MA', char='❄', transp=0, location=location.abovebar, color=color.white, editable=true, size=size.auto)
