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
import { error } from 'console'

export const Competitions = () => {

	const [areas, setAreas] = useState<IArea[]>([])
	const [competitions, setCompetitions] = useState<ICompetition[]>([])
	const [view, setView] = useState<ICompetition[]>([])
	const [total, setTotal] = useState<number>(0)
	const [page, setPage] = useState<number>(1)
	const [areas_load, setAreasLoad] = useState<boolean>(false)
	const [areas_error, setAreasError] = useState<string | undefined>(undefined)
	const [areas_warning, setAreasWarning] = useState<string | undefined>(undefined)
	const [competitions_load, setCompetitionsLoad] = useState<boolean>(false)
	const [competitions_error, setCompetitionsError] = useState<string | undefined>(undefined)
	const [competitions_warning, setCompetitionsWarning] = useState<string | undefined>(undefined)

	useEffect(() => { setPage(1) }, [total])
	useEffect(() => { fetchAreas(); fetchCompetitions() }, [])
	useEffect(() => {
		if (competitions.length === 0) return
		const [start, end] = [(page - 1) * VIEW_COMPETITIONS_COUNT, (page - 1) * VIEW_COMPETITIONS_COUNT + VIEW_COMPETITIONS_COUNT]
		setView(competitions.slice(start, end))
	}, [competitions, page])

	const fetchAreas = async () => {
		setAreasLoad(true)
		const responce_areas = await loadAreas()
		const data = await responce_areas.json()
		if (data.error) setAreasError(data.error)
		if (data.areas) {
			if (data.areas.length === 0) setAreasWarning("Фильтр пуст")
			else setAreas(data.areas)
		}
		setAreasLoad(false)
	}
	const fetchCompetitions = async (areas?: number, name?: string) => {
		setCompetitionsWarning(undefined)
		setCompetitionsError(undefined)
		setCompetitionsLoad(true)
		const responce_competitons = await loadCompetitions(areas)
		const data = await responce_competitons.json()
		if (data.error) setCompetitionsError(data.error)
		if (data.competitions) {
			let _competitions: ICompetition[] = []
			if (name) _competitions = data.competitions.competitions.filter((competition: ICompetition) => competition.name.includes(name))
			else _competitions = data.competitions.competitions
			if (_competitions.length === 0) {
				setCompetitionsWarning("Список лиг пуст. Необходимо выбрать другие параметры для фильров.")
				setTotal(0)
			} else {
				setCompetitions(_competitions)
				setTotal(Math.ceil(_competitions.length / VIEW_COMPETITIONS_COUNT))
			}
		}
		setCompetitionsLoad(false)
	}

	const find = () => {
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
				{view.map((competition: ICompetition, index: number) => <Link key={index} href={`/competition?id=${competition.id}`}>
					<Stack className={style.competition} alignItems={"center"} justifyContent={"flex-end"}>
						<img className={style.image} src={competition.emblem} />
						<span className={style.title}>{competition.name}</span>
						<span className={style.title}>{competition.area.name}</span>
					</Stack>
				</Link>)}
			</>}
		</div>
		<Pagination page={page} onChange={(event: any, page: number) => setPage(page)} count={total} color="primary" />
	</Stack>
}
