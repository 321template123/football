'use client'

import { Stack } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { zhCN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import { locale } from 'dayjs';
import { useEffect, useState } from "react";

export const FilterDate = () => {

	const [dateFrom, setDateFrom] = useState<Dayjs>(dayjs(new Date()));
	const [dateTo, setDateTo] = useState<Dayjs>(dayjs(new Date()));

	useEffect(() => {
		if (dateFrom.diff(dateTo, "day") > 0) {
			setDateTo(dateFrom)
		}
	}, [dateFrom])

	return <Stack direction={"row"}>
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
			<DatePicker
				className="filter-dateFrom"
				format="YYYY-MM-DD"
				label="Начало"
				value={dateFrom}
				onChange={(newValue: any) => setDateFrom(newValue)}
			/>
			<DatePicker
				className="filter-dateTo"
				format="YYYY-MM-DD"
				minDate={dateFrom}
				label="Конец"
				value={dateTo}
				onChange={(newValue) => setDateTo(newValue as Dayjs)}
			/>
		</LocalizationProvider>
	</Stack>
}
