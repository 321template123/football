import { nullToUndefined } from "@/tools/nullToUndefined";
import { loadData } from "./loadData";

const AREASURL = `${process.env.API_ADDRESS}areas/`
const COMPETITONSURL = `${process.env.API_ADDRESS}competitions/`

export const loadAreas = async () => await loadData(`${AREASURL}`,'Не удалось загрузить список областей')
export const loadCompetitions = async (search:string) => await loadData(`${COMPETITONSURL}?${search}`,'Не удалось загрузить список лиг')

export const loadCompetitionCalendar = async (search:URLSearchParams) => {
	const competiton_id = nullToUndefined(search.get('competiton_id'))
	search.delete('competiton_id')
	return await loadData(`${COMPETITONSURL}${competiton_id}/matches?${search.toString()}`,'Не удалось загрузить список лиг')
}