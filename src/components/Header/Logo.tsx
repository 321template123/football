import { Stack, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

export const Logo = () => {
	return <Link href="/">
		<Stack direction={"row"} sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={"center"}>
			<Typography>Soccer Stat</Typography>
			<DirectionsRunIcon></DirectionsRunIcon>
			<SportsSoccerIcon></SportsSoccerIcon>
		</Stack>
		<Stack sx={{ display: { xs: 'flex', md: 'none' } }} alignItems={"center"}>
			<Stack direction={"row"} alignItems={"center"}>
				<Typography>S</Typography>
				<DirectionsRunIcon></DirectionsRunIcon>
			</Stack>
			<Stack direction={"row"} alignItems={"center"}>
				<SportsSoccerIcon></SportsSoccerIcon>
				<Typography>S</Typography>
			</Stack>
		</Stack>
	</Link>
}

