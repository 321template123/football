'use client'

import { IMatch } from '@/globals/interfaces'
import { Alert, Box, IconButton, Pagination, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Error, ReportProblem, Search, Autorenew } from '@mui/icons-material'
import style from './Competition.module.css'
import { useSearchParams } from 'next/navigation'
import { nullToUndefined } from '@/tools/nullToUndefined'
import { loadCompetitionCalendar } from '@/client_services/leagues'
import { VIEW_MATCHES_COUNT } from '@/globals/variables'

export const Competition = () => {

	const search = useSearchParams()

	// Состояния для управления странцей
	const [matches, setMatches] = useState<IMatch[]>([])

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
		fetchCompetition(id)
	}, [search])

	useEffect(() => {
		if (matches.length === 0) return
		const start = (page - 1) * VIEW_MATCHES_COUNT
		const end = start + VIEW_MATCHES_COUNT
		setView(matches.slice(start, end))
	}, [matches, page])

	useEffect(() => {
		setPage(1)
	}, [total])

	// Функция загрузки лиг
	const fetchCompetition = async (id: number, dateFrom?: string, dateTo?: string) => {

		setMatchesError(undefined)
		setMatchesWarning(undefined)
		// Ожидаем данных
		const responce_competitons = await loadCompetitionCalendar(id, dateFrom, dateTo)
		// Обрабатываем результат
		const data = await responce_competitons.json()
		if (data.error) {
			// При ошибке
			setMatchesError(data.error)
		} else if (data.matches) {
			// Если пришли данные
			if (data.matches.length === 0) {
				// Пустой массив
				setMatchesWarning("Список лиг пустой.")
			} else {
				setMatches(data.matches.matches)
				setTotal(Math.ceil(data.matches.resultSet.count / VIEW_MATCHES_COUNT))
			}
		} else {
			// Непредведенная ошибка
			setMatchesError("Непредвиденная ошибка")
		}
		// Завершаем загрузку
		setMatchesLoad(false)
	}

	const find = () => {
	}

	return <Stack className={style.content} alignItems={"center"}>
		<Stack className={style.filter} direction={"row"} alignItems={"center"}>
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