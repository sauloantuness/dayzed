(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
  (global = global || self, factory(global.Dayzed = {}, global.React, global.PropTypes));
}(this, (function (exports, react, PropTypes) { 'use strict';

  PropTypes = PropTypes && Object.prototype.hasOwnProperty.call(PropTypes, 'default') ? PropTypes['default'] : PropTypes;

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };
    return _extends.apply(this, arguments);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }

    var number = Number(dirtyNumber);

    if (isNaN(number)) {
      return number;
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }

  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
    }
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */

  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument); // Clone the date

    if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime());
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument);
    } else {
      if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
        // eslint-disable-next-line no-console
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"); // eslint-disable-next-line no-console

        console.warn(new Error().stack);
      }

      return new Date(NaN);
    }
  }

  /**
   * @name addDays
   * @category Day Helpers
   * @summary Add the specified number of days to the given date.
   *
   * @description
   * Add the specified number of days to the given date.
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} - the new date with the days added
   * @throws {TypeError} - 2 arguments required
   *
   * @example
   * // Add 10 days to 1 September 2014:
   * const result = addDays(new Date(2014, 8, 1), 10)
   * //=> Thu Sep 11 2014 00:00:00
   */

  function addDays(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var amount = toInteger(dirtyAmount);

    if (isNaN(amount)) {
      return new Date(NaN);
    }

    if (!amount) {
      // If 0 days, no-op to avoid changing times in the hour before end of DST
      return date;
    }

    date.setDate(date.getDate() + amount);
    return date;
  }

  /**
   * @name addMonths
   * @category Month Helpers
   * @summary Add the specified number of months to the given date.
   *
   * @description
   * Add the specified number of months to the given date.
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the months added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 5 months to 1 September 2014:
   * const result = addMonths(new Date(2014, 8, 1), 5)
   * //=> Sun Feb 01 2015 00:00:00
   */

  function addMonths(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var amount = toInteger(dirtyAmount);

    if (isNaN(amount)) {
      return new Date(NaN);
    }

    if (!amount) {
      // If 0 months, no-op to avoid changing times in the hour before end of DST
      return date;
    }

    var dayOfMonth = date.getDate(); // The JS Date object supports date math by accepting out-of-bounds values for
    // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
    // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
    // want except that dates will wrap around the end of a month, meaning that
    // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
    // we'll default to the end of the desired month by adding 1 to the desired
    // month and using a date of 0 to back up one day to the end of the desired
    // month.

    var endOfDesiredMonth = new Date(date.getTime());
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
    var daysInMonth = endOfDesiredMonth.getDate();

    if (dayOfMonth >= daysInMonth) {
      // If we're already at the end of the month, then this is the correct date
      // and we're done.
      return endOfDesiredMonth;
    } else {
      // Otherwise, we now know that setting the original day-of-month value won't
      // cause an overflow, so set the desired day-of-month. Note that we can't
      // just set the date of `endOfDesiredMonth` because that object may have had
      // its time changed in the unusual case where where a DST transition was on
      // the last day of the month and its local time was in the hour skipped or
      // repeated next to a DST transition.  So we use `date` instead which is
      // guaranteed to still have the original time.
      date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
      return date;
    }
  }

  /**
   * @name isBefore
   * @category Common Helpers
   * @summary Is the first date before the second one?
   *
   * @description
   * Is the first date before the second one?
   *
   * @param {Date|Number} date - the date that should be before the other one to return true
   * @param {Date|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is before the second date
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Is 10 July 1989 before 11 February 1987?
   * const result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> false
   */

  function isBefore(dirtyDate, dirtyDateToCompare) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var dateToCompare = toDate(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime();
  }

  /**
   * @name startOfDay
   * @category Day Helpers
   * @summary Return the start of a day for the given date.
   *
   * @description
   * Return the start of a day for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|Number} date - the original date
   * @returns {Date} the start of a day
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // The start of a day for 2 September 2014 11:55:00:
   * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 00:00:00
   */

  function startOfDay(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /**
   * @name isSameDay
   * @category Day Helpers
   * @summary Are the given dates in the same day (and year and month)?
   *
   * @description
   * Are the given dates in the same day (and year and month)?
   *
   * @param {Date|Number} dateLeft - the first date to check
   * @param {Date|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same day (and year and month)
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
   * const result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
   * //=> true
   *
   * @example
   * // Are 4 September and 4 October in the same day?
   * const result = isSameDay(new Date(2014, 8, 4), new Date(2014, 9, 4))
   * //=> false
   *
   * @example
   * // Are 4 September, 2014 and 4 September, 2015 in the same day?
   * const result = isSameDay(new Date(2014, 8, 4), new Date(2015, 8, 4))
   * //=> false
   */

  function isSameDay(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeftStartOfDay = startOfDay(dirtyDateLeft);
    var dateRightStartOfDay = startOfDay(dirtyDateRight);
    return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
  }

  /**
   * @name isToday
   * @category Day Helpers
   * @summary Is the given date today?
   * @pure false
   *
   * @description
   * Is the given date today?
   *
   * > ⚠️ Please note that this function is not present in the FP submodule as
   * > it uses `Date.now()` internally hence impure and can't be safely curried.
   *
   * @param {Date|Number} date - the date to check
   * @returns {Boolean} the date is today
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // If today is 6 October 2014, is 6 October 14:00:00 today?
   * const result = isToday(new Date(2014, 9, 6, 14, 0))
   * //=> true
   */

  function isToday(dirtyDate) {
    requiredArgs(1, arguments);
    return isSameDay(dirtyDate, Date.now());
  }

  /**
   * @name differenceInCalendarMonths
   * @category Month Helpers
   * @summary Get the number of calendar months between the given dates.
   *
   * @description
   * Get the number of calendar months between the given dates.
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar months
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many calendar months are between 31 January 2014 and 1 September 2014?
   * const result = differenceInCalendarMonths(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 0, 31)
   * )
   * //=> 8
   */

  function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
    requiredArgs(2, arguments);
    var dateLeft = toDate(dirtyDateLeft);
    var dateRight = toDate(dirtyDateRight);
    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
    return yearDiff * 12 + monthDiff;
  }

  /**
   * This is intended to be used to compose event handlers
   * They are executed in order until one of them calls
   * `event.preventDefault()`. Not sure this is the best
   * way to do this, but it seems legit...
   * @param {Function} fns the event hanlder functions
   * @return {Function} the event handler to add to an element
   */

  function composeEventHandlers() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return function (event) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return fns.some(function (fn) {
        fn && fn.apply(void 0, [event].concat(args));
        return event.defaultPrevented;
      });
    };
  }
  /**
   * Throws a helpful error message for required properties. Useful
   * to be used as a default in destructuring or object params.
   * @param {String} fnName the function name
   * @param {String} propName the prop name
   */

  function requiredProp(fnName, propName) {
    throw new Error("The property \"" + propName + "\" is required in \"" + fnName + "\"");
  }
  /**
   * Takes an argument and if it's an array, returns the first item in the array
   * otherwise returns the argument.
   * @param {*} arg the maybe-array
   * @return {*} the arg or it's first item
   */

  function unwrapChildrenForPreact(arg) {
    arg = Array.isArray(arg) ?
    /* istanbul ignore next (preact) */
    arg[0] : arg;
    return arg || noop;
  }

  function noop() {}
  /**
   * Takes a calendars array and figures out the number of months to subtract
   * based on the current offset and the minDate allowed.
   * @param {Object} param The param object
   * @param {Array} param.calendars The calendars array created by the getCalendars function
   * @param {Number} param.offset The num of months to be subtracted
   * @param {Date} param.minDate The earliest date we are allow to subtract back to
   * @returns {Number} The number of months to subtract
   */


  function subtractMonth(_ref) {
    var calendars = _ref.calendars,
        offset = _ref.offset,
        minDate = _ref.minDate;

    if (offset > 1 && minDate) {
      var firstDayOfMonth = calendars[0].firstDayOfMonth;
      var diffInMonths = differenceInCalendarMonths(firstDayOfMonth, minDate);

      if (diffInMonths < offset) {
        offset = diffInMonths;
      }
    }

    return offset;
  }
  /**
   * Takes a calendars array and figures out the number of months to add
   * based on the current offset and the maxDate allowed.
   * @param {Object} param The param object
   * @param {Array} param.calendars The calendars array created by the getCalendars function
   * @param {Number} param.offset The num of months to be added
   * @param {Date} param.maxDate The furthest date we are allow to add forward to
   * @returns {Number} The number of months to add
   */

  function addMonth(_ref2) {
    var calendars = _ref2.calendars,
        offset = _ref2.offset,
        maxDate = _ref2.maxDate;

    if (offset > 1 && maxDate) {
      var lastDayOfMonth = calendars[calendars.length - 1].lastDayOfMonth;
      var diffInMonths = differenceInCalendarMonths(maxDate, lastDayOfMonth);

      if (diffInMonths < offset) {
        offset = diffInMonths;
      }
    }

    return offset;
  }
  /**
   * Takes a calendars array and figures out if the back button should be
   * disabled based on the minDate allowed.
   * @param {Object} param The param object
   * @param {Array} param.calendars The calendars array created by the getCalendars function
   * @param {Date} param.minDate The earliest date available
   * @returns {Boolean} Whether the back button should be disabled.
   */

  function isBackDisabled(_ref3) {
    var calendars = _ref3.calendars,
        offset = _ref3.offset,
        minDate = _ref3.minDate;

    if (!minDate) {
      return false;
    }

    var firstDayOfMonth = calendars[0].firstDayOfMonth;
    var previousMonth = addMonths(firstDayOfMonth, -(offset - 1));
    var lastDayTargetMonth = addDays(previousMonth, -1);

    if (isBefore(lastDayTargetMonth, minDate)) {
      return true;
    }

    return false;
  }
  /**
   * Takes a calendars array and figures out if the forward button should be
   * disabled based on the maxDate allowed.
   * @param {Object} param The param object
   * @param {Array} param.calendars The calendars array created by the getCalendars function
   * @param {Date} param.maxDate The furthest date available
   * @returns {Boolean} Whether the forward button should be disabled.
   */

  function isForwardDisabled(_ref4) {
    var calendars = _ref4.calendars,
        offset = _ref4.offset,
        maxDate = _ref4.maxDate;

    if (!maxDate) {
      return false;
    }

    var lastDayOfMonth = calendars[calendars.length - 1].lastDayOfMonth;
    var firstDayNextMonth = addDays(lastDayOfMonth, 1);
    var firstDayTargetMonth = addMonths(firstDayNextMonth, offset - 1);

    if (isBefore(maxDate, firstDayTargetMonth)) {
      return true;
    }

    return false;
  }
  /**
   * Figures out the months data needed based off the number of monthsToDisplay
   * and other options provided.
   * @param {Object} param The param object
   * @param {Date} param.date The date to start the calendar at
   * @param {Array.<Date>} param.selected An array of dates currently selected
   * @param {Number} param.monthsToDisplay The number of months to return in the calendar view
   * @param {Number} param.offset The number of months to offset based off the param.date given
   * @param {Date} param.minDate The earliest date available
   * @param {Date} param.maxDate The furthest date available
   * @param {Number} param.firstDayOfWeek First day of week, 0-6 (Sunday to Saturday)
   * @param {Bool} param.showOutsideDays Flag to fill front and back weeks with dates from adjacent months
   * @returns {Array.<Object>} An array of objects with month data
   */

  function getCalendars(_ref5) {
    var date = _ref5.date,
        selected = _ref5.selected,
        monthsToDisplay = _ref5.monthsToDisplay,
        offset = _ref5.offset,
        minDate = _ref5.minDate,
        maxDate = _ref5.maxDate,
        firstDayOfWeek = _ref5.firstDayOfWeek,
        showOutsideDays = _ref5.showOutsideDays;
    var months = [];
    var startDate = getStartDate(date, minDate, maxDate);

    for (var i = 0; i < monthsToDisplay; i++) {
      var calendarDates = getMonths({
        month: startDate.getMonth() + i + offset,
        year: startDate.getFullYear(),
        selectedDates: selected,
        minDate: minDate,
        maxDate: maxDate,
        firstDayOfWeek: firstDayOfWeek,
        showOutsideDays: showOutsideDays
      });
      months.push(calendarDates);
    }

    return months;
  }
  /**
   * Figures out the actual start date based on
   * the min and max dates available.
   * @param {Date} date The we want to start the calendar at
   * @param {Date} minDate The earliest date available to start at
   * @param {Date} maxDate The latest date available to start at
   * @returns {Date} The actual start date
   */

  function getStartDate(date, minDate, maxDate) {
    var startDate = startOfDay(date);

    if (minDate) {
      var minDateNormalized = startOfDay(minDate);

      if (isBefore(startDate, minDateNormalized)) {
        startDate = minDateNormalized;
      }
    }

    if (maxDate) {
      var maxDateNormalized = startOfDay(maxDate);

      if (isBefore(maxDateNormalized, startDate)) {
        startDate = maxDateNormalized;
      }
    }

    return startDate;
  }
  /**
   * Figures what week/day data to return for the given month
   * and year. Adds flags to day data if found in the given selectedDates,
   * if is selectable inside the given min and max dates, or is today.
   * @param {Object} param The param object
   * @param {Number} param.month The month to grab data for
   * @param {Number} param.year The year to grab data for
   * @param {Array.<Date>} sparam.electedDates An array of dates currently selected
   * @param {Date} param.minDate The earliest date available
   * @param {Date} param.maxDate The furthest date available
   * @param {Number} param.firstDayOfWeek First day of week, 0-6 (Sunday to Saturday)
   * @param {Bool} param.showOutsideDays Flag to fill front and back weeks with dates from adjacent months
   * @returns {Object} The data for the selected month/year
   */


  function getMonths(_ref6) {
    var month = _ref6.month,
        year = _ref6.year,
        selectedDates = _ref6.selectedDates,
        minDate = _ref6.minDate,
        maxDate = _ref6.maxDate,
        firstDayOfWeek = _ref6.firstDayOfWeek,
        showOutsideDays = _ref6.showOutsideDays;
    // Get the normalized month and year, along with days in the month.
    var daysMonthYear = getNumDaysMonthYear(month, year);
    var daysInMonth = daysMonthYear.daysInMonth;
    month = daysMonthYear.month;
    year = daysMonthYear.year; // Fill out the dates for the month.

    var dates = [];

    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(year, month, day);
      var dateObj = {
        date: date,
        selected: isSelected(selectedDates, date),
        selectable: isSelectable(minDate, maxDate, date),
        today: isToday(date),
        prevMonth: false,
        nextMonth: false
      };
      dates.push(dateObj);
    }

    var firstDayOfMonth = new Date(year, month, 1);
    var lastDayOfMonth = new Date(year, month, daysInMonth);
    var frontWeekBuffer = fillFrontWeek({
      firstDayOfMonth: firstDayOfMonth,
      minDate: minDate,
      maxDate: maxDate,
      selectedDates: selectedDates,
      firstDayOfWeek: firstDayOfWeek,
      showOutsideDays: showOutsideDays
    });
    var backWeekBuffer = fillBackWeek({
      lastDayOfMonth: lastDayOfMonth,
      minDate: minDate,
      maxDate: maxDate,
      selectedDates: selectedDates,
      firstDayOfWeek: firstDayOfWeek,
      showOutsideDays: showOutsideDays
    });
    dates.unshift.apply(dates, frontWeekBuffer);
    dates.push.apply(dates, backWeekBuffer); // Get the filled out weeks for the
    // given dates.

    var weeks = getWeeks(dates); // return the calendar data.

    return {
      firstDayOfMonth: firstDayOfMonth,
      lastDayOfMonth: lastDayOfMonth,
      month: month,
      year: year,
      weeks: weeks
    };
  }
  /**
   * Fill front week with either empty buffer or dates from previous month,
   * depending on showOutsideDays flag
   * @param {Object} param The param object
   * @param {Array.<Date>} param.selectedDates An array of dates currently selected
   * @param {Date} param.minDate The earliest date available
   * @param {Date} param.maxDate The furthest date available
   * @param {Date} param.firstDayOfMonth First day of the month
   * @param {Number} param.firstDayOfWeek First day of week, 0-6 (Sunday to Saturday)
   * @param {Bool} param.showOutsideDays Flag to fill front and back weeks with dates from adjacent months
   * @returns {Array.<Date>} Buffer to fill front week
   */


  function fillFrontWeek(_ref7) {
    var firstDayOfMonth = _ref7.firstDayOfMonth,
        minDate = _ref7.minDate,
        maxDate = _ref7.maxDate,
        selectedDates = _ref7.selectedDates,
        firstDayOfWeek = _ref7.firstDayOfWeek,
        showOutsideDays = _ref7.showOutsideDays;
    var dates = [];
    var firstDay = (firstDayOfMonth.getDay() + 7 - firstDayOfWeek) % 7;

    if (showOutsideDays) {
      var lastDayOfPrevMonth = addDays(firstDayOfMonth, -1);
      var prevDate = lastDayOfPrevMonth.getDate();
      var prevDateMonth = lastDayOfPrevMonth.getMonth();
      var prevDateYear = lastDayOfPrevMonth.getFullYear(); // Fill out front week for days from
      // preceding month with dates from previous month.

      var counter = 0;

      while (counter < firstDay) {
        var date = new Date(prevDateYear, prevDateMonth, prevDate - counter);
        var dateObj = {
          date: date,
          selected: isSelected(selectedDates, date),
          selectable: isSelectable(minDate, maxDate, date),
          today: false,
          prevMonth: true,
          nextMonth: false
        };
        dates.unshift(dateObj);
        counter++;
      }
    } else {
      // Fill out front week for days from
      // preceding month with buffer.
      while (firstDay > 0) {
        dates.unshift('');
        firstDay--;
      }
    }

    return dates;
  }
  /**
   * Fill back weeks with either empty buffer or dates from next month,
   * depending on showOutsideDays flag
   * @param {Object} param The param object
   * @param {Array.<Date>} param.selectedDates An array of dates currently selected
   * @param {Date} param.minDate The earliest date available
   * @param {Date} param.maxDate The furthest date available
   * @param {Date} param.lastDayOfMonth Last day of the month
   * @param {Number} param.firstDayOfWeek First day of week, 0-6 (Sunday to Saturday)
   * @param {Bool} param.showOutsideDays Flag to fill front and back weeks with dates from adjacent months
   * @returns {Array.<Date>} Buffer to fill back week
   */


  function fillBackWeek(_ref8) {
    var lastDayOfMonth = _ref8.lastDayOfMonth,
        minDate = _ref8.minDate,
        maxDate = _ref8.maxDate,
        selectedDates = _ref8.selectedDates,
        firstDayOfWeek = _ref8.firstDayOfWeek,
        showOutsideDays = _ref8.showOutsideDays;
    var dates = [];
    var lastDay = (lastDayOfMonth.getDay() + 7 - firstDayOfWeek) % 7;

    if (showOutsideDays) {
      var firstDayOfNextMonth = addDays(lastDayOfMonth, 1);
      var nextDateMonth = firstDayOfNextMonth.getMonth();
      var nextDateYear = firstDayOfNextMonth.getFullYear(); // Fill out back week for days from
      // following month with dates from next month.

      var counter = 0;

      while (counter < 6 - lastDay) {
        var date = new Date(nextDateYear, nextDateMonth, 1 + counter);
        var dateObj = {
          date: date,
          selected: isSelected(selectedDates, date),
          selectable: isSelectable(minDate, maxDate, date),
          today: false,
          prevMonth: false,
          nextMonth: true
        };
        dates.push(dateObj);
        counter++;
      }
    } else {
      // Fill out back week for days from
      // following month with buffer.
      while (lastDay < 6) {
        dates.push('');
        lastDay++;
      }
    }

    return dates;
  }
  /**
   * Normalizes month (could be overflow) and year pairs and returns the
   * normalized month and year along with the number of days in the month.
   * @param {Number} month The month to normalize
   * @param {Number} year The year to normalize
   * @returns {Object} The normalized month and year along with the number of days in the month
   */


  function getNumDaysMonthYear(month, year) {
    // If a parameter you specify is outside of the expected range for Month or Day,
    // JS Date attempts to update the date information in the Date object accordingly!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate
    // Let Date handle the overflow of the month,
    // which should return the normalized month and year.
    var normalizedMonthYear = new Date(year, month, 1);
    month = normalizedMonthYear.getMonth();
    year = normalizedMonthYear.getFullYear(); // Overflow the date to the next month, then subtract the difference
    // to get the number of days in the previous month.
    // This will also account for leap years!

    var daysInMonth = 32 - new Date(year, month, 32).getDate();
    return {
      daysInMonth: daysInMonth,
      month: month,
      year: year
    };
  }
  /**
   * Takes an array of dates, and turns them into a multi dimensional
   * array with 7 entries for each week.
   * @param {Array.<Object>} dates An array of dates
   * @returns {Array} The weeks as a multi dimensional array
   */


  function getWeeks(dates) {
    var weeksLength = Math.ceil(dates.length / 7);
    var weeks = [];

    for (var i = 0; i < weeksLength; i++) {
      weeks[i] = [];

      for (var x = 0; x < 7; x++) {
        weeks[i].push(dates[i * 7 + x]);
      }
    }

    return weeks;
  }
  /**
   * Normalizes dates to the beginning of the day,
   * then checks to see if the day given is found
   * in the selectedDates.
   * @param {Array.<Date>} selectedDates An array of dates currently selected
   * @param {Date} date The date to search with against selectedDates
   * @returns {Boolean} Whether day is found in selectedDates
   */


  function isSelected(selectedDates, date) {
    selectedDates = Array.isArray(selectedDates) ? selectedDates : [selectedDates];
    return selectedDates.some(function (selectedDate) {
      if (selectedDate instanceof Date && startOfDay(selectedDate).getTime() === startOfDay(date).getTime()) {
        return true;
      }

      return false;
    });
  }
  /**
   * Checks to see if the date given is
   * between the min and max dates.
   * @param {Date} minDate The earliest date available
   * @param {Date} maxDate The furthest date available
   * @param {Date} date The date to compare with
   * @returns {Boolean} Whether the date is between min and max date
   */


  function isSelectable(minDate, maxDate, date) {
    if (minDate && isBefore(date, minDate) || maxDate && isBefore(maxDate, date)) {
      return false;
    }

    return true;
  }

  var _excluded = ["onClick", "dateObj"],
      _excluded2 = ["onClick", "offset", "calendars"],
      _excluded3 = ["onClick", "offset", "calendars"];

  function isOffsetControlled(propOffset) {
    return propOffset !== undefined;
  }

  function getOffset(prop, state) {
    return isOffsetControlled(prop) ? prop : state;
  }

  function getDateProps(onDateSelected, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        onClick = _ref.onClick,
        _ref$dateObj = _ref.dateObj,
        dateObj = _ref$dateObj === void 0 ? requiredProp('getDateProps', 'dateObj') : _ref$dateObj,
        rest = _objectWithoutPropertiesLoose(_ref, _excluded);

    return _extends({
      onClick: composeEventHandlers(onClick, function (event) {
        onDateSelected(dateObj, event);
      }),
      disabled: !dateObj.selectable,
      'aria-label': dateObj.date.toDateString(),
      'aria-pressed': dateObj.selected,
      role: 'button'
    }, rest);
  }

  function getBackProps(_ref2, _temp2) {
    var minDate = _ref2.minDate,
        offsetMonth = _ref2.offsetMonth,
        handleOffsetChanged = _ref2.handleOffsetChanged;

    var _ref3 = _temp2 === void 0 ? {} : _temp2,
        onClick = _ref3.onClick,
        _ref3$offset = _ref3.offset,
        offset = _ref3$offset === void 0 ? 1 : _ref3$offset,
        _ref3$calendars = _ref3.calendars,
        calendars = _ref3$calendars === void 0 ? requiredProp('getBackProps', 'calendars') : _ref3$calendars,
        rest = _objectWithoutPropertiesLoose(_ref3, _excluded2);

    return _extends({
      onClick: composeEventHandlers(onClick, function () {
        handleOffsetChanged(offsetMonth - subtractMonth({
          calendars: calendars,
          offset: offset,
          minDate: minDate
        }));
      }),
      disabled: isBackDisabled({
        calendars: calendars,
        offset: offset,
        minDate: minDate
      }),
      'aria-label': "Go back " + offset + " month" + (offset === 1 ? '' : 's')
    }, rest);
  }

  function getForwardProps(_ref4, _temp3) {
    var maxDate = _ref4.maxDate,
        offsetMonth = _ref4.offsetMonth,
        handleOffsetChanged = _ref4.handleOffsetChanged;

    var _ref5 = _temp3 === void 0 ? {} : _temp3,
        onClick = _ref5.onClick,
        _ref5$offset = _ref5.offset,
        offset = _ref5$offset === void 0 ? 1 : _ref5$offset,
        _ref5$calendars = _ref5.calendars,
        calendars = _ref5$calendars === void 0 ? requiredProp('getForwardProps', 'calendars') : _ref5$calendars,
        rest = _objectWithoutPropertiesLoose(_ref5, _excluded3);

    return _extends({
      onClick: composeEventHandlers(onClick, function () {
        handleOffsetChanged(offsetMonth + addMonth({
          calendars: calendars,
          offset: offset,
          maxDate: maxDate
        }));
      }),
      disabled: isForwardDisabled({
        calendars: calendars,
        offset: offset,
        maxDate: maxDate
      }),
      'aria-label': "Go forward " + offset + " month" + (offset === 1 ? '' : 's')
    }, rest);
  }

  function useDayzed(_ref6) {
    var _ref6$date = _ref6.date,
        date = _ref6$date === void 0 ? new Date() : _ref6$date,
        maxDate = _ref6.maxDate,
        minDate = _ref6.minDate,
        _ref6$monthsToDisplay = _ref6.monthsToDisplay,
        monthsToDisplay = _ref6$monthsToDisplay === void 0 ? 1 : _ref6$monthsToDisplay,
        _ref6$firstDayOfWeek = _ref6.firstDayOfWeek,
        firstDayOfWeek = _ref6$firstDayOfWeek === void 0 ? 0 : _ref6$firstDayOfWeek,
        _ref6$showOutsideDays = _ref6.showOutsideDays,
        showOutsideDays = _ref6$showOutsideDays === void 0 ? false : _ref6$showOutsideDays,
        offset = _ref6.offset,
        onDateSelected = _ref6.onDateSelected,
        _ref6$onOffsetChanged = _ref6.onOffsetChanged,
        onOffsetChanged = _ref6$onOffsetChanged === void 0 ? function () {} : _ref6$onOffsetChanged,
        selected = _ref6.selected;

    var _useState = react.useState(0),
        stateOffset = _useState[0],
        setStateOffset = _useState[1];

    var offsetMonth = getOffset(offset, stateOffset);

    function handleOffsetChanged(newOffset) {
      if (!isOffsetControlled(offset)) {
        setStateOffset(newOffset);
      }

      onOffsetChanged(newOffset);
    }

    var calendars = getCalendars({
      date: date,
      selected: selected,
      monthsToDisplay: monthsToDisplay,
      minDate: minDate,
      maxDate: maxDate,
      offset: offsetMonth,
      firstDayOfWeek: firstDayOfWeek,
      showOutsideDays: showOutsideDays
    });
    return {
      calendars: calendars,
      getDateProps: getDateProps.bind(null, onDateSelected),
      getBackProps: getBackProps.bind(null, {
        minDate: minDate,
        offsetMonth: offsetMonth,
        handleOffsetChanged: handleOffsetChanged
      }),
      getForwardProps: getForwardProps.bind(null, {
        maxDate: maxDate,
        offsetMonth: offsetMonth,
        handleOffsetChanged: handleOffsetChanged
      })
    };
  }

  function Dayzed(props) {
    var dayzedCalendar = useDayzed(props);
    var children = unwrapChildrenForPreact(props.render || props.children);
    return children(dayzedCalendar);
  }

  Dayzed.defaultProps = {
    date: new Date(),
    monthsToDisplay: 1,
    onOffsetChanged: function onOffsetChanged() {},
    firstDayOfWeek: 0,
    showOutsideDays: false
  };
  Dayzed.propTypes = {
    render: PropTypes.func,
    children: PropTypes.func,
    date: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    monthsToDisplay: PropTypes.number,
    firstDayOfWeek: PropTypes.number,
    showOutsideDays: PropTypes.bool,
    offset: PropTypes.number,
    onDateSelected: PropTypes.func.isRequired,
    onOffsetChanged: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.arrayOf(Date), PropTypes.instanceOf(Date)])
  };

  exports.default = Dayzed;
  exports.useDayzed = useDayzed;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dayzed.umd.js.map
