export type IPlan = "TIER_ONE" | "TIER_TWO" | "TIER_THREE" | "TIER_FOUR"

export interface ICompetition {
	id: number
	area: IArea
	name: string
	code: string
	type: string
	emblem: string
	plan: IPlan
	currentSeason: ISeason
	numberOfAvailableSeasons: number
	lastUpdated: string
}

export interface IArea {
	id: number
	name: string
	code: string
	flag: string
}

export interface ISeason {
	id: number
	startDate: string
	endDate: string
	currentMatchday: number
	winner: IWinner
}

export interface IWinner {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
	address: string
	website: string
	founded: number
	clubColors: string
	venue: string
	lastUpdated: string
}

export interface IMatch {
	area: IArea
	awayTeam: ITeam
	competition: ICompetitionMini
	group: unknown
	homeTeam: ITeam
	id: number
	lastUpdated: string
	matchday: number
	stage: string
	status: string
	utcDate: string
	odds: IOdds
	referees: any[]
	score: IScore
	season: ISeason
}

export interface IOdds {
	msg: string
}
export interface IScore {
	winner: IWinner
	duration: string
	fullTime: ITime
	halfTime: ITime
}

export interface ITime {
	away: unknown
	home: unknown
}

export interface ITeam {
	crest: string
	id: number
	name: string
	shortName: string
	tla: string
}
export interface ICompetitionMini {
	code: string
	emblem: string
	id: number
	name: string
	type: string
}
