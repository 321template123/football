'use client'

import { IMatch } from '@/globals/interfaces'
import { Alert, Box, IconButton, Pagination, Stack } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import { Error, ReportProblem, Search, Autorenew } from '@mui/icons-material'
import style from './Team.module.css'
import { useSearchParams } from 'next/navigation'
import { nullToUndefined } from '@/tools/nullToUndefined'
import { loadTeamCalendar } from '@/client_services/teams'
import { VIEW_MATCHES_COUNT } from '@/globals/variables'
import { FilterDate } from './Filter/FilterDate/FilterDate'
import { FilterName } from './Filter/FilterName/FilterName'

export const Team = () => {

	const search = useSearchParams()

	// Состояния для управления странцей
	const [matches, setMatches] = useState<IMatch[]>([])
	const [id, setId] = useState<number>(0)

	// Для реализации пагинации
	const [view, setView] = useState<IMatch[]>([])
	const [total, setTotal] = useState<number>(0)
	const [page, setPage] = useState<number>(1)

	// Состояния загрузки данных
	const [matches_load, setMatchesLoad] = useState<boolean>(true)
	const [matches_error, setMatchesError] = useState<string | undefined>(undefined)
	const [matches_warning, setMatchesWarning] = useState<string | undefined>(undefined)

	// Загрузка данных происходит при параметров строки
	useEffect(() => {
		if (!search) return
		const id = nullToUndefined(search.get("id"))
		setId(id)
	}, [search])

	useEffect(() => {
		if (id === 0) return
		fetchTeam(id)
	}, [id])

	useEffect(() => {
		if (matches.length === 0) return
		window.scrollTo(0, 0)
		const [start, end] = [(page - 1) * VIEW_MATCHES_COUNT, (page - 1) * VIEW_MATCHES_COUNT + VIEW_MATCHES_COUNT]
		setView(matches.slice(start, end))
	}, [matches, page])

	useEffect(() => {
		setPage(1)
	}, [total])

	// Функция загрузки лиг
	const fetchTeam = async (id: number, dateFrom?: string, dateTo?: string, name?: string) => {
		setMatchesWarning(undefined)
		setMatchesError(undefined)
		setMatchesLoad(true)
		const responce_compitition_calendar = await loadTeamCalendar(id, dateFrom, dateTo)
		const data = await responce_compitition_calendar.json()
		if (data.error) setMatchesError(data.error)
		if (data.matches) {
			let _matches: IMatch[] = []
			if (name) _matches = data.matches.matches.filter((match: IMatch) => match.homeTeam.name.includes(name) || match.awayTeam.name.includes(name))
			else _matches = data.matches.matches
			if (_matches.length === 0) {
				setMatchesWarning("Список матчей пуст. Необходимо выбрать другие параметры для фильров.")
				setTotal(0)
			} else {
				setMatches(_matches)
				setTotal(Math.ceil(_matches.length / VIEW_MATCHES_COUNT))
			}
		}
		setMatchesLoad(false)
	}

	const find = () => {
		const dateFrom = (document.getElementsByClassName("filter-dateFrom")[0].childNodes[1].childNodes[0] as HTMLInputElement).value
		const dateTo = (document.getElementsByClassName("filter-dateTo")[0].childNodes[1].childNodes[0] as HTMLInputElement).value
		const name = (document.getElementById("filter-name") as HTMLInputElement).value

		fetchTeam(id, dateFrom, dateTo, name)
	}

	return <Stack className={style.content} alignItems={"center"}>
		<Stack className={style.filter} alignItems={"center"} sx={{ flexDirection: { xs: "column", md: "row" } }}>
			<FilterDate />
			<FilterName />
			<IconButton onClick={find}><Search /></IconButton>
		</Stack>
		<Stack alignItems={"center"} sx={{ width: "100%" }}>
			{matches_load && <Alert className={style.content} icon={<Autorenew className='animation-spin' fontSize="inherit" />} severity="success">Загрузка ...</Alert>}
			{matches_error && <Alert className={style.content} icon={<Error fontSize="inherit" />} severity="error">{matches_error}</Alert>}
			{matches_warning && <Alert className={style.content} icon={<ReportProblem fontSize="inherit" />} severity="warning">{matches_warning}</Alert>}
			{!matches_load && !matches_error && !matches_warning && <>
				{view.map((match: IMatch) => <Stack className={style.match} sx={{ width: "100%", flexDirection: { xs: "column", md: "row" } }} justifyContent={"space-around"}>
					<Stack alignItems={"center"}>
						<span>{new Date(match.utcDate).toLocaleDateString()}</span>
						<span>{new Date(match.utcDate).toLocaleTimeString()}</span>
					</Stack>
					<Stack direction={"row"} justifyContent={"space-around"} sx={{ width: "100%" }}>
						<Stack sx={{ width: "100%", flexDirection: { xs: "column", md: "row" } }} alignItems={"center"} justifyContent={"space-around"}>
							<img src={match.homeTeam.crest} width={50} />
							<span>{match.homeTeam.name}</span>
						</Stack>
						<Stack sx={{ width: "100%", flexDirection: { xs: "column", md: "row" } }} alignItems={"center"} justifyContent={"space-around"}>
							<img src={match.awayTeam.crest} width={50} />
							<span>{match.awayTeam.name}</span>
						</Stack>
					</Stack>
				</Stack>)}
			</>}
		</Stack>
		<Pagination page={page} onChange={(event: any, page: number) => setPage(page)} count={total} color="primary" />
	</Stack>
}

export function AwaitTeam() {
	return (
		// You could have a loading skeleton as the `fallback` too
		<Suspense>
			<Team />
		</Suspense>
	)
}