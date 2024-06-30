'use client'

import { loadAreas, loadCompetitionCalendar, loadCompetitions } from '@/client_services/leagues'
import { loadTeamCalendar, loadTeams } from '@/client_services/teams'
import React from 'react'

export const Competitions = () => {

	const fetchData = async () => {
		// ОБЛАСТИ ВОЗВРАЩАЮТСЯ
		const responce_areas = await loadAreas()
		const areas = await responce_areas.json()
		console.log(areas);

		// ЛИГИ ВОЗВРАЩАЮТСЯ
		const responce_competitons = await loadCompetitions(2077)
		const competitons = await responce_competitons.json()
		console.log(competitons);

		// КАЛЕНДАРЬ ЛИГИ ВОЗВРАЩАЮТСЯ
		// const responce_competitons_calendar = await loadCompetitionCalendar(2016)
		const responce_competiton_calendar = await loadCompetitionCalendar(2016,"2022-12-01","2022-12-31")
		const competiton = await responce_competiton_calendar.json()
		console.log(competiton);

		// КОМАНДЫ ВОЗВРАЩАЮТСЯ
		const responce_teams = await loadTeams()
		const teams = await responce_teams.json()
		console.log(teams);

		// КАЛЕНДАРЬ ЛИГИ ВОЗВРАЩАЮТСЯ
		// const responce_team_calendar = await loadTeamCalendar(57)
		const responce_team_calendar = await loadTeamCalendar(57,"2022-12-01","2022-12-31")
		const team = await responce_team_calendar.json()
		console.log(team);

		// 2072 2301
	}

	fetchData()

	return (
		<div>Competitions</div>
	)
}
