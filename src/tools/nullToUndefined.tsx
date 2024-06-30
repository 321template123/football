export const nullToUndefined = (field:any) => {
	if(field === null)
		return undefined
	return field
}
