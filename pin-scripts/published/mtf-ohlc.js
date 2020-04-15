// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Extendable OHLC (daily, weekly, monthly) - Flo5k5', shorttitle='MTF OHLC - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

lineWidth   = 1

////////////////////////////////////////////////////////////////////////////////
// Open High Low Close HTF
//
// Tradingview script/F8yZU30q-Open-High-Low-HTF
// 

dummy6                       = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowOhlcHtf             = input(title='OHLC HTF', type=input.bool, defval=true)
dummy61                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcLabels          = input(title='Show labels', type=input.bool, defval=false)
dummy62                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfDaily        = input(title='Show daily', type=input.bool, defval=false)
dummy63                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfDailyOpen    = input(title='Daily open', type=input.bool, defval=false)
inputExtendDaylyOpen         = input(title='Extend DO', type=input.bool, defval=false)
inputShowOhlcHtfDailyHigh    = input(title='Daily high', type=input.bool, defval=false)
inputExtendDaylyHigh         = input(title='Extend DH', type=input.bool, defval=false)
inputShowOhlcHtfDailyLow     = input(title='Daily low', type=input.bool, defval=false)
inputExtendDaylyLow          = input(title='Extend DL', type=input.bool, defval=false)
inputShowOhlcHtfDailyClose   = input(title='Daily close', type=input.bool, defval=false)
inputExtendDaylyClose        = input(title='Extend DC', type=input.bool, defval=false)
inputLineWidthOhlcDaily      = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcDaily   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy64                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfWeekly       = input(title='Show weekly', type=input.bool, defval=false)
dummy65                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyOpen   = input(title='Weekly open', type=input.bool, defval=false)
inputExtendWeeklyOpen        = input(title='Extend WO', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyHigh   = input(title='Weekly high', type=input.bool, defval=false)
inputExtendWeeklyHigh        = input(title='Extend WH', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyLow    = input(title='Weekly low', type=input.bool, defval=false)
inputExtendWeeklyLow         = input(title='Extend WL', type=input.bool, defval=false)
inputShowOhlcHtfWeeklyClose  = input(title='Weekly close', type=input.bool, defval=false)
inputExtendWeeklyClose       = input(title='Extend WC', type=input.bool, defval=false)
inputLineWidthOhlcWeekly     = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcWeekly   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy66                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfMonthly      = input(title='Show monthly', type=input.bool, defval=true)
dummy67                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyOpen  = input(title='Monthly open', type=input.bool, defval=false)
inputExtendMonthlyOpen       = input(title='Extend MO', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyHigh  = input(title='Monthly high', type=input.bool, defval=true)
inputExtendMonthlyHigh       = input(title='Extend MH', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyLow   = input(title='Monthly low', type=input.bool, defval=true)
inputExtendMonthlyLow        = input(title='Extend ML', type=input.bool, defval=false)
inputShowOhlcHtfMonthlyClose = input(title='Monthly close', type=input.bool, defval=true)
inputExtendMonthlyClose      = input(title='Extend MC', type=input.bool, defval=false)
inputLineWidthOhlcMonthly    = input(title='Line width', type=input.integer, defval=1, minval=1, maxval=5)
// inputLineTranspOhlcMonthly   = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy68                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfYearly       = input(title='Show yearly', type=input.bool, defval=true)
dummy69                      = input(title=' ', type=input.bool, defval=false)
inputShowOhlcHtfYearlyOpen   = input(title='Yearly open', type=input.bool, defval=false)
inputExtendYearlyOpen        = input(title='Extend YO', type=input.bool, defval=false)
inputShowOhlcHtfYearlyHigh   = input(title='Yearly high', type=input.bool, defval=true)
inputExtendYearlyHigh        = input(title='Extend YH', type=input.bool, defval=false)
inputShowOhlcHtfYearlyLow    = input(title='Yearly low', type=input.bool, defval=true)
inputExtendYearlyLow         = input(title='Extend YL', type=input.bool, defval=false)
inputShowOhlcHtfYearlyClose  = input(title='Yearly close', type=input.bool, defval=true)
inputExtendYearlyClose       = input(title='Extend YC', type=input.bool, defval=false)
inputLineWidthOhlcYearly     = input(title='Line width', type=input.integer, defval=2, minval=1, maxval=5)
// inputLineTranspOhlcYearly = input(title='Line transparency', type=input.integer, defval=50, minval=0, maxval=100)
dummy70                      = input(title=' ', type=input.bool, defval=false)

inputLineTranspOhlcDaily     = 40
inputLineTranspOhlcWeekly    = 40
inputLineTranspOhlcMonthly   = 40
inputLineTranspOhlcYearly    = 40
inputOhlcLabelColor          = #d1d4dc

////// Daily Open

openPriceD = security(syminfo.tickerid, 'D', open)
isDisplayedDailyOpen  = inputShowOhlcHtf and inputShowOhlcHtfDaily and inputShowOhlcHtfDailyOpen and openPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyOpenLine  = na

if isDisplayedDailyOpen and openPriceD[1] != openPriceD
    if not inputExtendDaylyOpen
        line.set_x2(dailyOpenLine, bar_index)
        line.set_extend(dailyOpenLine, extend.none)
    dailyOpenLine := line.new(bar_index, openPriceD, bar_index, openPriceD, extend=inputExtendDaylyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceD, 'DO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyOpen and not na(dailyOpenLine) and line.get_x2(dailyOpenLine) != bar_index
    line.set_x2(dailyOpenLine, bar_index)

////// Daily High

highPriceD = security(syminfo.tickerid, 'D', high)
isDisplayedDailyHigh  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyHigh and highPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyHighLine  = na

if isDisplayedDailyHigh and highPriceD[1] != highPriceD
    if not inputExtendDaylyHigh
        line.set_x2(dailyHighLine, bar_index)
        line.set_extend(dailyHighLine, extend.none)
    dailyHighLine := line.new(bar_index, highPriceD, bar_index, highPriceD, extend=inputExtendDaylyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceD, 'DH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyHigh and not na(dailyHighLine) and line.get_x2(dailyHighLine) != bar_index
    line.set_x2(dailyHighLine, bar_index)

////// Daily Low

lowPriceD = security(syminfo.tickerid, 'D', low)
isDisplayedDailyLow  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyLow and lowPriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyLowLine  = na

if isDisplayedDailyLow and lowPriceD[1] != lowPriceD
    if not inputExtendDaylyLow
        line.set_x2(dailyLowLine, bar_index)
        line.set_extend(dailyLowLine, extend.none)
    dailyLowLine := line.new(bar_index, lowPriceD, bar_index, lowPriceD, extend=inputExtendDaylyLow ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceD, 'DL', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyLow and not na(dailyLowLine) and line.get_x2(dailyLowLine) != bar_index
    line.set_x2(dailyLowLine, bar_index)

////// Daily Close

closePriceD = security(syminfo.tickerid, 'D', close)
isDisplayedDailyClose  = inputShowOhlcHtf and inputShowOhlcHtfDaily  and inputShowOhlcHtfDailyClose and closePriceD and not timeframe.isdaily and not timeframe.isweekly and not timeframe.ismonthly
var line dailyCloseLine  = na

if isDisplayedDailyClose and closePriceD[1] != closePriceD
    if not inputExtendDaylyClose
        line.set_x2(dailyCloseLine, bar_index)
        line.set_extend(dailyCloseLine, extend.none)
    dailyCloseLine := line.new(bar_index, closePriceD, bar_index, closePriceD, extend=inputExtendDaylyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily), width=inputLineWidthOhlcDaily)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceD, 'DC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcDaily))

if isDisplayedDailyClose and not na(dailyCloseLine) and line.get_x2(dailyCloseLine) != bar_index
    line.set_x2(dailyCloseLine, bar_index)

////// Weekly Open

openPriceW = security(syminfo.tickerid, 'W', open)
isDisplayedWeeklyOpen  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyOpen and openPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyOpenLine  = na

if isDisplayedWeeklyOpen and openPriceW[1] != openPriceW
    if not inputExtendWeeklyOpen
        line.set_x2(weeklyOpenLine, bar_index)
        line.set_extend(weeklyOpenLine, extend.none)
    weeklyOpenLine := line.new(bar_index, openPriceW, bar_index, openPriceW, extend=inputExtendWeeklyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceW, 'WO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyOpen and not na(weeklyOpenLine) and line.get_x2(weeklyOpenLine) != bar_index
    line.set_x2(weeklyOpenLine, bar_index)

////// Weekly High

highPriceW = security(syminfo.tickerid, 'W', high)
isDisplayedWeeklyHigh  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyHigh and highPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyHighLine  = na

if isDisplayedWeeklyHigh and highPriceW[1] != highPriceW
    if not inputExtendWeeklyHigh
        line.set_x2(weeklyHighLine, bar_index)
        line.set_extend(weeklyHighLine, extend.none)
    weeklyHighLine := line.new(bar_index, highPriceW, bar_index, highPriceW, extend=inputExtendWeeklyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceW, 'WH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyHigh and not na(weeklyHighLine) and line.get_x2(weeklyHighLine) != bar_index
    line.set_x2(weeklyHighLine, bar_index)

////// Weekly Low

lowPriceW = security(syminfo.tickerid, 'W', low)
isDisplayedWeeklyLow  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyLow and lowPriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyLowLine  = na

if isDisplayedWeeklyLow and lowPriceW[1] != lowPriceW
    if not inputExtendWeeklyLow
        line.set_x2(weeklyLowLine, bar_index)
        line.set_extend(weeklyLowLine, extend.none)
    weeklyLowLine := line.new(bar_index, lowPriceW, bar_index, lowPriceW, extend=inputExtendWeeklyLow  ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceW, 'WL', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyLow and not na(weeklyLowLine) and line.get_x2(weeklyLowLine) != bar_index
    line.set_x2(weeklyLowLine, bar_index)

////// Weekly Close

closePriceW = security(syminfo.tickerid, 'W', close)
isDisplayedWeeklyClose  = inputShowOhlcHtf and inputShowOhlcHtfWeekly and inputShowOhlcHtfWeeklyClose and closePriceW and not timeframe.isweekly and not timeframe.ismonthly
var line weeklyCloseLine  = na

if isDisplayedWeeklyClose and closePriceW[1] != closePriceW
    if not inputExtendWeeklyClose
        line.set_x2(weeklyCloseLine, bar_index)
        line.set_extend(weeklyCloseLine, extend.none)
    weeklyCloseLine := line.new(bar_index, closePriceW, bar_index, closePriceW, extend=inputExtendWeeklyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly), width=inputLineWidthOhlcWeekly)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceW, 'WC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcWeekly))

if isDisplayedWeeklyClose and not na(weeklyCloseLine) and line.get_x2(weeklyCloseLine) != bar_index
    line.set_x2(weeklyCloseLine, bar_index)

////// Monthly Open

openPriceM = security(syminfo.tickerid, 'M', open)
isDisplayedMonthlyOpen  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyOpen and openPriceM and not timeframe.ismonthly
var line monthlyOpenLine  = na

if isDisplayedMonthlyOpen and openPriceM[1] != openPriceM
    if not inputExtendMonthlyOpen
        line.set_x2(monthlyOpenLine, bar_index)
        line.set_extend(monthlyOpenLine, extend.none)
    monthlyOpenLine := line.new(bar_index, openPriceM, bar_index, openPriceM, extend= inputExtendMonthlyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceM, 'MO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyOpen and not na(monthlyOpenLine) and line.get_x2(monthlyOpenLine) != bar_index
    line.set_x2(monthlyOpenLine, bar_index)

////// Monthly High

highPriceM = security(syminfo.tickerid, 'M', high)
isDisplayedMonthlyHigh  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyHigh and highPriceM and not timeframe.ismonthly
var line monthlyHighLine  = na

if isDisplayedMonthlyHigh and highPriceM[1] != highPriceM
    if not inputExtendMonthlyHigh
        line.set_x2(monthlyHighLine, bar_index)
        line.set_extend(monthlyHighLine, extend.none)
    monthlyHighLine := line.new(bar_index, highPriceM, bar_index, highPriceM, extend=inputExtendMonthlyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceM, 'MH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyHigh and not na(monthlyHighLine) and line.get_x2(monthlyHighLine) != bar_index
    line.set_x2(monthlyHighLine, bar_index)

////// Monthly Low

lowPriceM = security(syminfo.tickerid, 'M', low)
isDisplayedMonthlyLow  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyLow and lowPriceM and not timeframe.ismonthly
var line monthlyLowLine  = na

if isDisplayedMonthlyLow and lowPriceM[1] != lowPriceM
    if not inputExtendMonthlyLow
        line.set_x2(monthlyLowLine, bar_index)
        line.set_extend(monthlyLowLine, extend.none)
    monthlyLowLine := line.new(bar_index, lowPriceM, bar_index, lowPriceM, extend=inputExtendMonthlyLow ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceM, 'ML', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyLow and not na(monthlyLowLine) and line.get_x2(monthlyLowLine) != bar_index
    line.set_x2(monthlyLowLine, bar_index)

////// Monthly Close

closePriceM = security(syminfo.tickerid, 'M', close)
isDisplayedMonthlyClose  = inputShowOhlcHtf and inputShowOhlcHtfMonthly and inputShowOhlcHtfMonthlyClose and closePriceM and not timeframe.ismonthly
var line monthlyCloseLine  = na

if isDisplayedMonthlyClose and closePriceM[1] != closePriceM
    if not inputExtendMonthlyClose
        line.set_x2(monthlyCloseLine, bar_index)
        line.set_extend(monthlyCloseLine, extend.none)
    monthlyCloseLine := line.new(bar_index, closePriceM, bar_index, closePriceM, extend=inputExtendMonthlyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly), width=inputLineWidthOhlcMonthly)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceM, 'MC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcMonthly))

if isDisplayedMonthlyClose and not na(monthlyCloseLine) and line.get_x2(monthlyCloseLine) != bar_index
    line.set_x2(monthlyCloseLine, bar_index)

////// Yearly Open

openPriceY = security(syminfo.tickerid, '12M', open)
isDisplayedYearlyOpen  = inputShowOhlcHtf and inputShowOhlcHtfYearly and inputShowOhlcHtfYearlyOpen and openPriceY and timeframe.period != '12M'
var line yearlyOpenLine  = na

if isDisplayedYearlyOpen and openPriceY[1] != openPriceY
    if not inputExtendYearlyOpen
        line.set_x2(yearlyOpenLine, bar_index)
        line.set_extend(yearlyOpenLine, extend.none)
    yearlyOpenLine := line.new(bar_index, openPriceY, bar_index, openPriceY, extend= inputExtendYearlyOpen ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly), width=inputLineWidthOhlcYearly)
    if inputShowOhlcLabels
        label.new(bar_index, openPriceY, 'YO', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly))

if isDisplayedYearlyOpen and not na(yearlyOpenLine) and line.get_x2(yearlyOpenLine) != bar_index
    line.set_x2(yearlyOpenLine, bar_index)

////// Yearly High

highPriceY = security(syminfo.tickerid, '12M', high)
isDisplayedYearlyHigh  = inputShowOhlcHtf and inputShowOhlcHtfYearly and inputShowOhlcHtfYearlyHigh and highPriceY and timeframe.period != '12M'
var line yearlyHighLine  = na

if isDisplayedYearlyHigh and highPriceY[1] != highPriceY
    if not inputExtendYearlyHigh
        line.set_x2(yearlyHighLine, bar_index)
        line.set_extend(yearlyHighLine, extend.none)
    yearlyHighLine := line.new(bar_index, highPriceY, bar_index, highPriceY, extend=inputExtendYearlyHigh ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly), width=inputLineWidthOhlcYearly)
    if inputShowOhlcLabels
        label.new(bar_index, highPriceY, 'YH', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly))

if isDisplayedYearlyHigh and not na(yearlyHighLine) and line.get_x2(yearlyHighLine) != bar_index
    line.set_x2(yearlyHighLine, bar_index)

////// Yearly Low

lowPriceY = security(syminfo.tickerid, '12M', low)
isDisplayedYearlyLow  = inputShowOhlcHtf and inputShowOhlcHtfYearly and inputShowOhlcHtfYearlyLow and lowPriceY and timeframe.period != '12M'
var line yearlyLowLine  = na

if isDisplayedYearlyLow and lowPriceY[1] != lowPriceY
    if not inputExtendYearlyLow
        line.set_x2(yearlyLowLine, bar_index)
        line.set_extend(yearlyLowLine, extend.none)
    yearlyLowLine := line.new(bar_index, lowPriceY, bar_index, lowPriceY, extend=inputExtendYearlyLow ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly), width=inputLineWidthOhlcYearly)
    if inputShowOhlcLabels
        label.new(bar_index, lowPriceY, 'YL', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly))

if isDisplayedYearlyLow and not na(yearlyLowLine) and line.get_x2(yearlyLowLine) != bar_index
    line.set_x2(yearlyLowLine, bar_index)

////// Yearly Close

closePriceY = security(syminfo.tickerid, '12M', close)
isDisplayedYearlyClose  = inputShowOhlcHtf and inputShowOhlcHtfYearly and inputShowOhlcHtfYearlyClose and closePriceY and timeframe.period != '12M'
var line yearlyCloseLine  = na

if isDisplayedYearlyClose and closePriceY[1] != closePriceY
    if not inputExtendYearlyClose
        line.set_x2(yearlyCloseLine, bar_index)
        line.set_extend(yearlyCloseLine, extend.none)
    yearlyCloseLine := line.new(bar_index, closePriceY, bar_index, closePriceY, extend=inputExtendYearlyClose ? extend.right : extend.none, color=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly), width=inputLineWidthOhlcYearly)
    if inputShowOhlcLabels
        label.new(bar_index, closePriceY, 'YC', style=label.style_none, textcolor=color.new(inputOhlcLabelColor, inputLineTranspOhlcYearly))

if isDisplayedYearlyClose and not na(yearlyCloseLine) and line.get_x2(yearlyCloseLine) != bar_index
    line.set_x2(yearlyCloseLine, bar_index)
