import { loadCompetitions } from "@/server_services/leagues";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request:NextRequest){

	try {
		console.log(request.nextUrl.searchParams.toString())
		const competitions:any = await loadCompetitions(request.nextUrl.searchParams.toString())

		return NextResponse.json({competitions:competitions})
	} catch (error:any) {
		return NextResponse.json({error:error.message})
	}
}