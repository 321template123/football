import { nullToUndefined } from "@/tools/nullToUndefined";
import { loadData } from "./loadData";

const TEAMSURL = `${process.env.API_ADDRESS}teams/`

export const loadTeams = async () => await loadData(`${TEAMSURL}`,'Не удалось загрузить список команд')
export const loadTeamCalendar = async (search:URLSearchParams) => {
	const team_id = nullToUndefined(search.get('team_id'))
	search.delete('team_id')
	return await loadData(`${TEAMSURL}${team_id}/matches?${search.toString()}`,'Не удалось загрузить список команд')
}