// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Auto-fibonacci (w/ log) - Flo5k5', shorttitle='Log Auto-Fibonacci - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Auto-fibo / log
// Tradingview script/e9AvttKQ-Auto-Fib
//

dummy8              = input(title='//////////////////////////////', type=input.bool, defval=false)
inputDisplayAutoFib = input(title='Auto fibonacci levels', type=input.bool, defval=true)
dummy81             = input(title=' ', type=input.bool, defval=false)
inputLookback       = input(title='Lookback period', type=input.integer, defval=360, minval=1)
inputFiboIsLog      = input(title='Logarithmic', type=input.bool, defval=true)
dummy82             = input(title=' ', type=input.bool, defval=false)
inputLineWidthFib   = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)

inputColorFib01     = #3d3d3d
inputColorFib236    = #cc2828
inputColorFib382    = #95cc28
inputColorFib500    = #28cc28
inputColorFib618    = #28cc95
inputColorFib786    = #2895cc
inputColorFib1618   = #2828cc
inputColorFib2618   = #cc2828
inputColorFib3618   = #9528cc

getFiboLevels(nHigh, nLow, isFiboReversed, isLog) =>
    if not na(nHigh) and not na(nLow)
        currentHigh    = isLog ? log(nHigh) : nHigh
        currentLow     = isLog ? log(nLow) : nLow
        range          = currentHigh - currentLow
        temp0          = isFiboReversed ? currentLow : currentHigh
        f0             = isLog ? exp(temp0) : temp0
        temp236        = isFiboReversed ? currentLow + range * 0.236 : currentHigh - range * 0.236
        f236           = isLog ? exp(temp236) : temp236
        temp382        = isFiboReversed ? currentLow + range * 0.382 : currentHigh - range * 0.382
        f382           = isLog ? exp(temp382) : temp382
        temp500        = isFiboReversed ? currentLow + range * 0.5 : currentHigh - range * 0.5
        f500           = isLog ? exp(temp500) : temp500
        temp618        = isFiboReversed ? currentLow + range * 0.618 : currentHigh - range * 0.618
        f618           = isLog ? exp(temp618) : temp618
        temp786        = isFiboReversed ? currentLow + range * 0.786 : currentHigh - range * 0.786
        f786           = isLog ? exp(temp786) : temp786
        temp1          = isFiboReversed ? currentHigh : currentLow
        f1             = isLog ? exp(temp1) : temp1
        temp1618       = isFiboReversed ? currentLow + range * 1.618 : currentHigh - range * 1.618
        f1618          = isLog ? exp(temp1618) : temp1618
        temp2618       = isFiboReversed ? currentLow + range * 2.618 : currentHigh - range * 2.618
        f2618          = isLog ? exp(temp2618) : temp2618
        temp3618       = isFiboReversed ? currentLow + range * 3.618 : currentHigh - range * 3.618
        f3618          = isLog ? exp(temp3618) : temp3618
        [f0, f236, f382, f500, f618, f786, f1, f1618, f2618, f3618]

recentHighest  = highest(high, inputLookback)
recentLowest   = lowest(low, inputLookback)
highestIndex   = highestbars(high, inputLookback)
lowestIndex    = lowestbars(low, inputLookback)

if inputDisplayAutoFib and barstate.islast
    isFiboReversed = highestIndex < lowestIndex
    displayIndex   = isFiboReversed ? bar_index + highestIndex : bar_index + lowestIndex

    [fib0, fib236, fib382, fib500, fib618, fib786, fib1, fib1618, fib2618, fib3618] = getFiboLevels(recentHighest, recentLowest, isFiboReversed, inputFiboIsLog)

    line.new(bar_index + highestIndex, recentHighest, bar_index + lowestIndex, recentLowest, style=line.style_dashed, extend=extend.none, color=inputColorFib01, width=1)
        
    line.new(displayIndex, fib0, bar_index, fib0, extend=extend.none, color=inputColorFib01, width=inputLineWidthFib)
    label.new(displayIndex, fib0, '0', style=label.style_none, textcolor=inputColorFib01)

    line.new(displayIndex, fib236, bar_index, fib236, extend=extend.none, color=inputColorFib236, width=inputLineWidthFib)
    label.new(displayIndex, fib236, '0.236', style=label.style_none, textcolor=inputColorFib236)

    line.new(displayIndex, fib382, bar_index, fib382, extend=extend.none, color=inputColorFib382, width=inputLineWidthFib)
    label.new(displayIndex, fib382, '0.382', style=label.style_none, textcolor=inputColorFib382)

    line.new(displayIndex, fib500, bar_index, fib500, extend=extend.none, color=inputColorFib500, width=inputLineWidthFib)
    label.new(displayIndex, fib500, '0.5', style=label.style_none, textcolor=inputColorFib500)

    line.new(displayIndex, fib618, bar_index, fib618, extend=extend.none, color=inputColorFib618, width=inputLineWidthFib)
    label.new(displayIndex, fib618, '0.618', style=label.style_none, textcolor=inputColorFib618)

    line.new(displayIndex, fib786, bar_index, fib786, extend=extend.none, color=inputColorFib786, width=inputLineWidthFib)
    label.new(displayIndex, fib786, '0.786', style=label.style_none, textcolor=inputColorFib786)

    line.new(displayIndex, fib1, bar_index, fib1, extend=extend.none, color=inputColorFib01, width=inputLineWidthFib)
    label.new(displayIndex, fib1, '1', style=label.style_none, textcolor=inputColorFib01)

    line.new(displayIndex, fib1618, bar_index, fib1618, extend=extend.none, color=inputColorFib1618, width=inputLineWidthFib)
    label.new(displayIndex, fib1618, '1.618', style=label.style_none, textcolor=inputColorFib1618)

    line.new(displayIndex, fib2618, bar_index, fib2618, extend=extend.none, color=inputColorFib2618, width=inputLineWidthFib)
    label.new(displayIndex, fib2618, '2.618', style=label.style_none, textcolor=inputColorFib2618)

    line.new(displayIndex, fib3618, bar_index, fib3618, extend=extend.none, color=inputColorFib3618, width=inputLineWidthFib)
    label.new(displayIndex, fib3618, '3.618', style=label.style_none, textcolor=inputColorFib3618)
