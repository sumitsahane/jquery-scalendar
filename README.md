# jQuery-sCalendar
This plugin helps you to select the multiple dates using ctrl, shift keys and also using drag.

## Dependencies
You just need to import the jQuery and moment js in your page.

You can use the cdn links:

https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.0/moment.min.js

or download and import it.

## Uses
You can use this plugin with `input(text)` or `div`

```
var calObject = $("#cal").sCalendar({
		// default settings here
	});
```
Using `calObject` you can call its methods.

## Default Settings
* Set default selected date 
```
defaultDate: moment() // or new Date()
```
* Set first day of week
```
firstDayOfWeek: 1 // 1-7 (Monday to Sunday)
```
* Set minimum date
```
minDate: moment("2017-11-17") // by default its null
```
* Set maximum date
```
maxDate: moment("2017-12-17") // by default its null
```
* Set date format
```
dateFormat: "DD-MM-YYYY" // you can use other moment js formats
```

## Methods
* Get selected dates
```
calObject.getScalDates() // this returns the selected dates array
```
* Set default selected date or multiple dates
```
calObject.setScalDates("2017-11-17") // or you can pass the array of dates ["2017-11-17","2017-11-18","2017-11-20"] 
```
* Destroy the calendar
```
calObject.destroyScal() // after this you need to reinitialize the sCalendar to use it. 
```
* Hide the calendar
```
calObject.hideScal()
```
* Show the calendar
```
calObject.showScal()
```

## Thanks
`JavaScript` 
`jQuery`
