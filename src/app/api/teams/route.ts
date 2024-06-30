import { loadTeams } from "@/server_services/teams";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request:NextRequest){

	try {
		console.log(request.nextUrl.searchParams.toString())
		const teams:any = await loadTeams()
		return NextResponse.json({teams:teams})
	} catch (error:any) {
		return NextResponse.json({error:error.message})
	}
	return NextResponse.json({competitions:"HELLO"})
}