// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Bollinger bands (w/ log, 2 deviations) - Flo5k5', shorttitle='BB Log - 2 Multi - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Bollinger Bands 

dummy2           = input(title='//////////////////////////////', type=input.bool, defval=false)
inputShowBB      = input(title='Bollinger Bands', type=input.bool, defval=false)
dummy21          = input(title=' ', type=input.bool, defval=false)
inputLengthBB    = input(20, title='MA Length', minval=1)
inputSrcBB       = input(close, title='Source')
inputMultBB1     = input(2.0, title='Primary deviation', minval=0.001, maxval=50)
inputMultBB2     = input(1.0, title='Secondary deviation', minval=0.001, maxval=50)
inputShowMultBB2 = input(title='Show second Mult', type=input.bool, defval=true)
inputBBIsLog     = input(title='Logarithmic', type=input.bool, defval=true)

srcBB  = inputBBIsLog ? log(inputSrcBB) : inputSrcBB
stdDev = stdev(srcBB, inputLengthBB)
dev1   = inputMultBB1 * stdDev
dev2   = inputMultBB2 * stdDev
basis  = sma(srcBB, inputLengthBB)
upper1 = basis + dev1
lower1 = basis - dev1
upper2 = basis + dev2
lower2 = basis - dev2

plot(inputShowBB ? (inputBBIsLog ? exp(basis) : basis) : na, title='Bollinger moving average', color=color.red)
p1Dev1 = plot(inputShowBB ? (inputBBIsLog ? exp(upper1) : upper1)  : na, title='Upper bollinger band primary deviation', color=color.blue, linewidth=2, transp=70)
p2Dev1 = plot(inputShowBB ? (inputBBIsLog ? exp(lower1) : lower1) : na, title='Lower bollinger band primary deviation', color=color.blue, linewidth=2, transp=70)
p1Dev2 = plot(inputShowBB and inputShowMultBB2 ? (inputBBIsLog ? exp(upper2) : upper2) : na, title='Upper bollinger band secondary deviation', color=color.blue, linewidth=2, transp=70)
p2Dev2 = plot(inputShowBB and inputShowMultBB2 ? (inputBBIsLog ? exp(lower2) : lower2) : na, title='Lower bollinger band secondary deviation', color=color.blue, linewidth=2, transp=70)
fill(p1Dev1, p2Dev1, title='Bollinger bands background color', transp=95)
