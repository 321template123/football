export const loadTeams = async () => await fetch(`/api/teams`)
export const loadTeamCalendar = async (team_id:number,start_date?:string,end_date?:string) => {
	const search = new URLSearchParams()
	search.append("team_id",`${team_id}`)
	if(start_date && end_date){
		search.append("dateFrom",start_date)
		search.append("dateTo",end_date)
	}
	return await fetch(`/api/team/?${search.toString()}`)
}