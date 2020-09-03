// credits: https://backtest-rookies.com/2019/02/15/tradingview-volume-profile-with-lower-time-frame-data/

//@version=3
study("Intra-bar Volume", overlay=false)

lower_tf = input("5", title='Lower Timeframe to Assess')

balanced_volume() =>
    vol = na
    for i = 0 to change(time(period))
        if open[i] == close[i]
            vol := na(vol) ? volume[i] : vol + volume[i]
    vol

buying_volume() =>
    vol = na
    for i = 0 to change(time(period))
        if open[i] < close[i]
            vol := na(vol) ? volume[i] : vol + volume[i]
    vol

selling_volume() =>
    vol = na
    for i = 0 to change(time(period))
        if open[i] > close[i]
            vol := na(vol) ? volume[i] : vol + volume[i]
    vol

lower_buy_vol =  security(tickerid, lower_tf, buying_volume())
lower_sell_vol =  security(tickerid, lower_tf, selling_volume())
balanced_vol =  security(tickerid, lower_tf, balanced_volume())

plot(balanced_vol, style=columns, color=black, transp=70, title='Balanced Volume')
plot(lower_buy_vol, style=columns, color=green, title='Buying Volume')
plot(lower_sell_vol, style=columns, color=red, transp=50, title='Selling Volume')
