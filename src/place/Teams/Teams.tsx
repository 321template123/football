'use client'

import { loadTeams } from '@/client_services/teams'
import { ICompetition, IMatch, ITeam } from '@/globals/interfaces'
import { Alert, IconButton, Pagination, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from './Teams.module.css'
import { Error, ReportProblem, Search, Autorenew } from '@mui/icons-material'
import { FilterName } from './Filter/FilterName/FilterName'
import { VIEW_COMPETITIONS_COUNT } from '@/globals/variables'
import Link from 'next/link'
import { match } from 'assert'

export const Teams = () => {

	const [teams, setTeams] = useState<ITeam[]>([])

	// Для реализации пагинации
	const [view, setView] = useState<ITeam[]>([])
	const [total, setTotal] = useState<number>(0)
	const [page, setPage] = useState<number>(1)

	// Состояния загрузки данных
	const [teams_load, setTeamsLoad] = useState<boolean>(true)
	const [teams_error, setTeamsError] = useState<string | undefined>(undefined)
	const [teams_warning, setTeamsWarning] = useState<string | undefined>(undefined)

	// Загрузка данных происходит при монтировании объекта
	useEffect(() => {
		fetchTeams()
	}, [])

	useEffect(() => {
		if (teams.length === 0) return
		const start = (page - 1) * VIEW_COMPETITIONS_COUNT
		const end = start + VIEW_COMPETITIONS_COUNT
		setView(teams.slice(start, end))
	}, [teams, page])

	useEffect(() => {
		setPage(1)
	}, [total])

	// Функция загрузки лиг
	const fetchTeams = async (name?: string) => {
		setTeamsWarning(undefined)
		setTeamsError(undefined)
		setTeamsLoad(true)
		const responce_competitons = await loadTeams()
		const data = await responce_competitons.json()
		if (data.error) setTeamsError(data.error)
		if (data.teams) {
			let _teams: ITeam[] = []
			if (name) _teams = data.teams.teams.filter((team: ICompetition) => team.name.includes(name))
			else _teams = data.teams.teams
			if (_teams.length === 0) {
				setTeamsWarning("Список команд пуст. Необходимо выбрать другие параметры для фильров.")
				setTotal(0)
			} else {
				setTeams(_teams)
				setTotal(Math.ceil(_teams.length / VIEW_COMPETITIONS_COUNT))
				console.log(_teams)
			}
		}
		setTeamsLoad(false)
	}

	const find = () => {
		const name = (document.getElementById("filter-name") as HTMLInputElement).value
		fetchTeams(name)
	}

	return <Stack className={style.content} alignItems={"center"}>
		<Stack className={style.filter} direction={"row"} alignItems={"center"}>
			<FilterName></FilterName>
			<IconButton onClick={find}><Search /></IconButton>
		</Stack>
		<div className={style.list}>
			{teams_load && <Alert className={style.content} icon={<Autorenew className='animation-spin' fontSize="inherit" />} severity="success">Загрузка ...</Alert>}
			{teams_error && <Alert className={style.content} icon={<Error fontSize="inherit" />} severity="error">{teams_error}</Alert>}
			{teams_warning && <Alert className={style.content} icon={<ReportProblem fontSize="inherit" />} severity="warning">{teams_warning}</Alert>}
			{!teams_load && !teams_error && !teams_warning && <>
				{view.map((team: ITeam) => <Link href={`/team?id=${team.id}`}>
					<Stack className={style.competition} alignItems={"center"} justifyContent={"flex-end"}>
						<img className={style.image} src={team.crest} />
						<span className={style.title}>{team.name}</span>
					</Stack>
				</Link>)}
			</>}
		</div>
		<Pagination page={page} onChange={(event: any, page: number) => setPage(page)} count={total} color="primary" />
	</Stack>
}
