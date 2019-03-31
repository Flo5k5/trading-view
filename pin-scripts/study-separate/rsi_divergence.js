//@version=3
study(title="RSI Divergence", shorttitle="RSI Divergence", overlay=false)
//https://www.tradingview.com/script/fH6e5TuN-RSI-Divergence/

////////////////////////////////////////////////////////////////////////////////
// Variables

src_fast = close, len_fast = input(5, minval=1, title="Length Fast RSI")
src_slow = close, len_slow = input(14,minval=1, title="Length Slow RSI")
up_fast = rma(max(change(src_fast), 0), len_fast)
down_fast = rma(-min(change(src_fast), 0), len_fast)
rsi_fast = down_fast == 0 ? 100 : up_fast == 0 ? 0 : 100 - (100 / (1 + up_fast / down_fast))
up_slow = rma(max(change(src_slow), 0), len_slow)
down_slow = rma(-min(change(src_slow), 0), len_slow)
rsi_slow = down_slow == 0 ? 100 : up_slow == 0 ? 0 : 100 - (100 / (1 + up_slow / down_slow))
//plotfast = plot(rsi_fast, color=blue)
//plotslow = plot(rsi_slow, color=orange)
divergence = rsi_fast - rsi_slow

plotdiv = plot(divergence, color = divergence > 0 ? lime:red, linewidth = 2)
//band1 = hline(70,color=green)
//band0 = hline(30,color=red)
band = hline(0)