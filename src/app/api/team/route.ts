import { loadCompetitionCalendar } from "@/server_services/leagues";
import { loadTeamCalendar } from "@/server_services/teams";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {

	try {
		const team = await loadTeamCalendar(request.nextUrl.searchParams)
		return NextResponse.json({ matches: team })
	} catch (error: any) {
		return NextResponse.json({ error: error.message })
	}
	return NextResponse.json({ error: "HELLO" })
}