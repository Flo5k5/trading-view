// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © flo5k5

//@version=4
study(title='Color trading Session - Flo5k5', shorttitle='Session - Flo5k5', overlay=true)

////////////////////////////////////////////////////////////////////////////////
// Variables

regular           = #0000FF

////////////////////////////////////////////////////////////////////////////////
// Session

// dummy1            = input(title='//////////////////////////////', type=input.bool, defval=false)
dummy2            = input(title='Session (input only GMT+0)', type=input.bool, defval=false)
dummy3            = input(title=' ', type=input.bool, defval=false)
inputFromHour     = input(title='From:', type=input.integer, defval=7, minval=0, maxval=23)
inputFromMinute   = input(title=' ', type=input.integer, defval=0, minval=0, maxval=59)
inputFromSecond   = input(title=' ', type=input.integer, defval=0, minval=0, maxval=59)
inputToHour       = input(title='To:', type=input.integer, defval=15, minval=0, maxval=23)
inputToMinute     = input(title=' ', type=input.integer, defval=30, minval=0, maxval=59)
inputToSecond     = input(title=' ', type=input.integer, defval=0, minval=0, maxval=59)
inputWeekdays     = input(title='Week days', type=input.bool, defval=true)
inputWeekend      = input(title='Weekend', type=input.bool, defval=false)

isWeekday         = dayofweek == dayofweek.monday or dayofweek == dayofweek.tuesday or dayofweek == dayofweek.wednesday or dayofweek == dayofweek.thursday or dayofweek == dayofweek.friday
isWeekend         = dayofweek == dayofweek.saturday or dayofweek == dayofweek.sunday
isDayOk           = (inputWeekdays and isWeekday) or (inputWeekend and isWeekend)

t1                = timestamp('GMT+0', year, month, dayofmonth, inputFromHour, inputFromMinute, inputFromSecond)
t2                = timestamp('GMT+0', year, month, dayofmonth, inputToHour, inputToMinute, inputToSecond)
isTimeOk          = (time >= t1) and (time <= t2)

bgcolor(isDayOk and isTimeOk ? regular : na, transp = 80)