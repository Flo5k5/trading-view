// credits: https://www.tradingview.com/script/euLEv7Po-Smart-Volume-beta/

//@version=4
study(title="Smart Volume", shorttitle="SmVol", precision=0)
showMA = input(true)

// the resolution to build up/down parts of the volume bar
resol = input('15', type=input.resolution, title="detailed resolution")


getMins() =>
    if timeframe.isintraday
        timeframe.multiplier
    else
        if timeframe.isdaily
            timeframe.multiplier * 24*60
        else 
            if timeframe.isweekly
                timeframe.multiplier * 7*24*60
            else
                if timeframe.ismonthly
                    timeframe.multiplier * 30*24*60
                else
                    -1

// workaround to call getMins() in the context of 'current' resolution, not 'detailed'
getMinsHack() =>
    security(syminfo.tickerid, timeframe.period, getMins())

sumLastTime(series, mins) => 
    s = 0.0
    for i = 0 to 1440
        if time[i] <= time - mins*60*1000
            break
        s := s + series[i]
    s
upVolume() => open <= close ? volume : 0
downVolume() => open > close ? volume : 0

upVol = security(syminfo.tickerid, resol, sumLastTime(upVolume(), getMinsHack()))
downVol = security(syminfo.tickerid, resol, sumLastTime(downVolume(), getMinsHack()))

downColor = #eb3d5c
upColor = #63b987
smaColor = #ff9850

plot(upVol + downVol, style=plot.style_histogram, color=downColor, transp=0)
plot(upVol, style=plot.style_histogram, color=upColor, transp=0)

plot(showMA ? sma(volume,20) : na, style=plot.style_line, color=smaColor, title="Volume MA")
