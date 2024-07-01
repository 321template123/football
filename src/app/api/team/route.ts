import { loadCompetitionCalendar } from "@/server_services/leagues";
import { loadTeamCalendar, loadTeamData } from "@/server_services/teams";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {

	try {
		const data = await loadTeamData(request.nextUrl.searchParams)
		const team = await loadTeamCalendar(request.nextUrl.searchParams)
		return NextResponse.json({ matches: team, team: data })
	} catch (error: any) {
		return NextResponse.json({ error: error.message })
	}
	return NextResponse.json({ error: "HELLO" })
}