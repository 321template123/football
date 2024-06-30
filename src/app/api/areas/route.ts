import { loadAreas } from "@/server_services/leagues";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request:NextRequest){

	try {
		const areas = await loadAreas()
		return NextResponse.json({areas:areas.areas})
	} catch (error:any) {
		return NextResponse.json({error:error.message})
	}

	return NextResponse.json({message:"HELLO"})
}