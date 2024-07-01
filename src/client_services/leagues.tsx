export const loadAreas = async () => await fetch("./api/areas/")

export const loadCompetitions = async (areas?: number) => {
	const search = new URLSearchParams()
	console.log(areas)
	if (areas)
		search.append("areas", `${areas}`)
	return await fetch(`./api/competitions/?${search.toString()}`)
}
export const loadCompetitionCalendar = async (competiton_id: number, start_date?: string, end_date?: string) => {
	const search = new URLSearchParams()
	search.append("competiton_id", `${competiton_id}`)
	if (start_date && end_date) {
		search.append("dateFrom", start_date)
		search.append("dateTo", end_date)
	}
	return await fetch(`./api/competition/?${search.toString()}`)
}