import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, Card, IconButton, Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Extend dayjs with UTC plugin, enabling UTC date parsing, formatting, and manipulation
dayjs.extend(utc);

/**
 * EventSearchFilter component provides a search interface for filtering events.
 * Features include:
 * - Location-based filtering by city or state
 * - Date range selection with start and end dates
 * - URL parameter synchronization
 * - Responsive design
 * - Automatic date validation and constraints
 *
 * @component
 * @returns {JSX.Element} A card containing search filters and a search button
 */
export const EventSearchFilter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize cityOrState with URL search parameter or empty string
  const [cityOrState, setCityOrState] = useState(() => {
    const locationParam = searchParams.get('searchlocation');
    return locationParam || '';
  });

  // Initialize start date from URL parameters, ensuring it's not in the past
  const [startDate, setStartDate] = useState(() => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    if (!startParam || !endParam) {
      return null;
    }
    const dateOnly = startParam.split('T')[0]; // Extract date only from start date
    const date = dayjs(dateOnly); // Parse date using dayjs
    return date.isBefore(dayjs(), 'day') ? dayjs() : date; // Ensure date is not in the past
  });

  // Initialize end date from URL parameters, ensuring it's not in the past
  const [endDate, setEndDate] = useState(() => {
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    if (!startParam || !endParam) {
      return null;
    }
    const dateOnly = endParam.split('T')[0]; // Extract date only from end date
    const date = dayjs(dateOnly);
    return date.isBefore(dayjs(), 'day') ? dayjs() : date;
  });

  // Handle search action and update URL parameters
  const handleSearch = () => {
    // Build filter conditions
    const filters = {
      startDateStr: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDateStr: endDate ? endDate.format('YYYY-MM-DD') : '',
      searchlocation: cityOrState,
    };

    // Preserve current `type` and `keyword` from URL, while updating filter conditions
    const currentType = searchParams.get('type');
    const currentKeyword = searchParams.get('keyword');

    // Build new URL parameters with current `type` and `keyword`, and updated filter conditions
    const newSearchParams = new URLSearchParams();
    if (currentType) newSearchParams.set('type', currentType);
    if (currentKeyword) newSearchParams.set('keyword', currentKeyword);
    if (filters.startDateStr) newSearchParams.set('startDate', filters.startDateStr);
    if (filters.endDateStr) newSearchParams.set('endDate', filters.endDateStr);
    if (filters.searchlocation) newSearchParams.set('searchlocation', filters.searchlocation);

    // Navigate to the new URL with updated parameters
    navigate(`/events?${newSearchParams.toString()}`);
  };

  // Update both start and end dates when start date changes
  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    if (endDate) {
      // Keep the same number of days between start and end dates
      const daysDiff = endDate.diff(startDate, 'day');
      setEndDate(newStartDate.add(daysDiff, 'day'));
    } else {
      // If no end date, set end date to be the same as start date
      setEndDate(newStartDate);
    }
  };

  // Update end date ensuring it's not before start date
  const handleEndDateChange = (newEndDate) => {
    if (newEndDate.isBefore(startDate)) {
      return;
    }
    setEndDate(newEndDate);
  };

  // Handle Enter key press for location search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    // Main container card for the filter components
    <Card sx={{ p: 3, mb: 3 }}>
      {/* Responsive stack container for filter elements */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {/* Location search input field with clear button */}
        <TextField
          fullWidth
          placeholder="City or State"
          size="small"
          sx={{ flex: 1 }}
          value={cityOrState}
          InputProps={{
            endAdornment: cityOrState && (
              <IconButton
                edge="end"
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '-8px' }}
                onClick={() => setCityOrState('')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          onChange={(e) => setCityOrState(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Date picker container with custom adapter */}
        {/* LocalizationProvider: Provides localization services for date pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Start date picker with custom styling and clear functionality */}
          <DatePicker
            format="YYYY-MM-DD" // Format date as YYYY-MM-DD
            label="Start Date"
            minDate={dayjs()} // Set minimum date to today
            value={startDate}
            slotProps={{
              textField: {
                size: 'small',
                inputProps: { readOnly: true },
                onFocus: () => {
                  if (!startDate) {
                    setStartDate(dayjs());
                    setEndDate(dayjs());
                  }
                },
                sx: {
                  '& .MuiInputAdornment-root': {
                    position: 'absolute',
                    right: '32px',
                    '& .MuiButtonBase-root': {
                      padding: '4px',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      color: 'text.secondary',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    paddingRight: '60px',
                  },
                },
              },
              // Clear button functionality
              actionBar: {
                actions: ['clear', 'today'],
                onClear: () => {
                  setStartDate(null);
                  setEndDate(null);
                },
              },
            }}
            slots={{
              openPickerIcon: CalendarMonthOutlinedIcon,
            }}
            onChange={handleStartDateChange}
          />

          {/* End date picker with custom styling and clear functionality */}
          <DatePicker
            disabled={!startDate}
            format="YYYY-MM-DD"
            label="End Date"
            minDate={startDate || dayjs()}
            value={endDate}
            slotProps={{
              textField: {
                size: 'small',
                inputProps: { readOnly: true },
                onFocus: () => {
                  if (!endDate && startDate) {
                    setEndDate(startDate);
                  }
                },
                sx: {
                  '& .MuiInputAdornment-root': {
                    position: 'absolute',
                    right: '32px',
                    '& .MuiButtonBase-root': {
                      padding: '4px',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      color: 'text.secondary',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    paddingRight: '60px',
                  },
                },
              },
              actionBar: {
                actions: ['clear', 'today'],
                onClear: () => setEndDate(startDate),
              },
            }}
            slots={{
              openPickerIcon: CalendarMonthOutlinedIcon,
            }}
            onChange={handleEndDateChange}
          />
        </LocalizationProvider>

        {/* Search button to trigger filter application */}
        <Button
          variant="contained"
          sx={{
            minWidth: 100,
            height: 40,
            textTransform: 'none',
          }}
          onClick={handleSearch}
        >
          Show
        </Button>
      </Stack>
    </Card>
  );
};
