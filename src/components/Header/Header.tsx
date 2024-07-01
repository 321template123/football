"use client"

import { AppBar, Toolbar, Container, useScrollTrigger, Stack } from "@mui/material"
import { Logo } from "./Logo"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Header = () => {

	const path = usePathname()
	const trigger = useScrollTrigger()

	return <AppBar position="fixed" className={`transition-all ${trigger ? 'opacity-0' : ''}`}>
		<Container maxWidth="xl">
			<Toolbar disableGutters>
				<Logo></Logo>
				<Stack direction={"row"} alignItems={"center"}>
					<Link className={`m-2 p-2 ${path === "/" || path === "/competition" ? 'border-b-2' : ''}`} href={'/'}>Лиги</Link>
					<Link className={`m-2 p-2 ${path === "/teams" || path === "/team" ? 'border-b-2' : ''}`} href={'/teams'}>Команды</Link>
				</Stack>
			</Toolbar>
		</Container>
	</AppBar>
}
