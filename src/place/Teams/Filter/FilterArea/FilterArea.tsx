import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

interface IFilterName {
	filling: string[]
}

export const FilterArea = ({ filling }: IFilterName) => <Autocomplete
	disablePortal
	id="filter-area"
	options={filling}
	sx={{ width: "100%", margin: '1rem' }}
	renderInput={(params) => <TextField {...params} label="Область" />}
/>
