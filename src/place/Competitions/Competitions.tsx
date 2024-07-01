'use client'

import { loadCompetitions, loadAreas } from '@/client_services/leagues'
import { IArea, ICompetition } from '@/globals/interfaces'
import { Alert, IconButton, Pagination, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './Competitions.module.css'
import { Error, ReportProblem, Search, Autorenew } from '@mui/icons-material'
import { FilterArea } from './Filter/FilterArea/FilterArea'
import { FilterName } from './Filter/FilterName/FilterName'
import { useSearchParams } from 'next/navigation'
import { VIEW_COMPETITIONS_COUNT } from '@/globals/variables'
import Link from 'next/link'

export const Competitions = () => {

	// Состояния для управления странцей
	const [areas, setAreas] = useState<IArea[]>([])
	const [competitions, setCompetitions] = useState<ICompetition[]>([])

	// Для реализации пагинации
	const [view, setView] = useState<ICompetition[]>([])
	const [total, setTotal] = useState<number>(0)
	const [page, setPage] = useState<number>(1)

	// Состояния загрузки данных
	const [areas_load, setAreasLoad] = useState<boolean>(true)
	const [areas_error, setAreasError] = useState<string | undefined>(undefined)
	const [areas_warning, setAreasWarning] = useState<string | undefined>(undefined)

	const [competitions_load, setCompetitionsLoad] = useState<boolean>(true)
	const [competitions_error, setCompetitionsError] = useState<string | undefined>(undefined)
	const [competitions_warning, setCompetitionsWarning] = useState<string | undefined>(undefined)

	// Загрузка данных происходит при монтировании объекта
	useEffect(() => {
		fetchAreas()
		fetchCompetitions()
	}, [])

	useEffect(() => {
		if (competitions.length === 0) return
		const start = (page - 1) * VIEW_COMPETITIONS_COUNT
		const end = start + VIEW_COMPETITIONS_COUNT
		setView(competitions.slice(start, end))
	}, [competitions, page])

	useEffect(() => {
		setPage(1)
	}, [total])

	// Функция загрузки фильтра областей
	const fetchAreas = async () => {

		setAreasError(undefined)
		setAreasWarning(undefined)

		// Ожидаем данных
		const responce_areas = await loadAreas()
		// Обрабатываем результат
		const data = await responce_areas.json()

		if (data.error) {
			// При ошибке
			setAreasError(data.error)
		} else if (data.areas) {
			// Если пришли данные
			if (data.areas.length === 0) {
				// Пустой массив
				setAreasWarning("Список фильтров пустой")
			} else {
				// Наполненный массив
				setAreas(data.areas)
			}
		} else {
			// Непредведенная ошибка
			setAreasError("Непредвиденная ошибка")
		}
		// Завершаем загрузку
		setAreasLoad(false)
	}

	// Функция загрузки лиг
	const fetchCompetitions = async (areas?: number, name?: string) => {
		setCompetitionsError(undefined)
		setCompetitionsWarning(undefined)
		// Ожидаем данных
		const responce_competitons = await loadCompetitions(areas)
		// Обрабатываем результат
		const data = await responce_competitons.json()
		if (data.error) {
			// При ошибке
			setCompetitionsError(data.error)
		} else if (data.competitions) {
			// Если пришли данные
			if (data.competitions.length === 0) {
				// Пустой массив
				setCompetitionsWarning("Список лиг пустой.")
			} else {
				// Наполненный массив
				if (name) {
					setCompetitions(data.competitions.competitions.filter((competition: ICompetition) => competition.name.includes(name)))
				} else {
					setCompetitions(data.competitions.competitions)
				}
				setTotal(Math.ceil(data.competitions.count / VIEW_COMPETITIONS_COUNT))
			}
		} else {
			// Непредведенная ошибка
			setCompetitionsError("Непредвиденная ошибка")
		}
		// Завершаем загрузку
		setCompetitionsLoad(false)
	}

	const find = () => {
		setCompetitionsLoad(true)
		const [area,] = (document.getElementById("filter-area") as HTMLInputElement).value.split(' ')
		const name = (document.getElementById("filter-name") as HTMLInputElement).value
		if (area === "" && name !== "") {
			document.getElementById("filter-area")?.focus()
			return
		}
		fetchCompetitions(+area, name)
	}

	if (areas_load) return <Alert className={style.content} icon={<Autorenew className='animation-spin' fontSize="inherit" />} severity="success">Загрузка ...</Alert>
	if (areas_error) return <Alert className={style.content} icon={<Error fontSize="inherit" />} severity="error">{areas_error}</Alert>
	if (areas_warning) return <Alert className={style.content} icon={<ReportProblem fontSize="inherit" />} severity="warning">{areas_warning}</Alert>

	// КАЛЕНДАРЬ ЛИГИ ВОЗВРАЩАЮТСЯ
	// const responce_competitons_calendar = await loadCompetitionCalendar(2016)
	// const responce_competiton_calendar = await loadCompetitionCalendar(2016,"2022-12-01","2022-12-31")
	// const competiton = await responce_competiton_calendar.json()
	// console.log(competiton);

	// КОМАНДЫ ВОЗВРАЩАЮТСЯ
	// const responce_teams = await loadTeams()
	// const teams = await responce_teams.json()
	// console.log(teams);

	// КАЛЕНДАРЬ ЛИГИ ВОЗВРАЩАЮТСЯ
	// const responce_team_calendar = await loadTeamCalendar(57)
	// const responce_team_calendar = await loadTeamCalendar(57,"2022-12-01","2022-12-31")
	// const team = await responce_team_calendar.json()
	// console.log(team);

	// 2072 2301

	return <Stack className={style.content} alignItems={"center"}>
		<Stack className={style.filter} direction={"row"} alignItems={"center"}>
			<FilterArea filling={areas.map((area: IArea) => `${area.id} ${area.name}`)}></FilterArea>
			<FilterName></FilterName>
			<IconButton onClick={find}><Search /></IconButton>
		</Stack>
		<div className={style.list}>
			{competitions_load && <Alert className={style.content} icon={<Autorenew className='animation-spin' fontSize="inherit" />} severity="success">Загрузка ...</Alert>}
			{competitions_error && <Alert className={style.content} icon={<Error fontSize="inherit" />} severity="error">{competitions_error}</Alert>}
			{competitions_warning && <Alert className={style.content} icon={<ReportProblem fontSize="inherit" />} severity="warning">{competitions_warning}</Alert>}
			{!competitions_load && !competitions_error && !competitions_warning && <>
				{view.map((competition: ICompetition) => <Link href={`/competition?id=${competition.id}`}>
					<Stack className={style.competition} alignItems={"center"} justifyContent={"flex-end"}>
						<img className={style.image} src={competition.emblem} />
						<span className={style.title}>{competition.name}</span>
					</Stack>
				</Link>)}
			</>}
		</div>
		<Pagination page={page} onChange={(event: any, page: number) => setPage(page)} count={total} color="primary" />
	</Stack>
}
