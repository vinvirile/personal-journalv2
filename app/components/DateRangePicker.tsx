'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };

  return (
    <div className="flex items-center space-x-4 my-4"> {/* Removed p-4, bg-gray-100, rounded-lg, shadow */}
       <span className="font-medium text-gray-700">Filter by Date:</span>
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Start Date"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        dateFormat="MM/dd/yyyy"
        isClearable
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate || undefined}
        placeholderText="End Date"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        dateFormat="MM/dd/yyyy"
        isClearable
      />
    </div>
  );
};

export default DateRangePickerComponent;
