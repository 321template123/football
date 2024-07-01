import { loadCompetitionCalendar } from "@/server_services/leagues";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {

	try {
		const competition = await loadCompetitionCalendar(request.nextUrl.searchParams)
		return NextResponse.json({ matches: competition })
	} catch (error: any) {
		return NextResponse.json({ error: error.message })
	}
	return NextResponse.json({ error: "HELLO" })
}