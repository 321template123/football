const API_TOKEN = `${process.env.API_TOKEN}`

export const loadData = async (url: string, error_message: string) => {
	let response;
	try {
		console.log(url)
		response = await fetch(url, { headers: { 'X-Auth-Token': API_TOKEN }, next: { revalidate: 3600 } });
	} catch (error: any) {
		throw new Error(`${error_message}. (${error.message})`);
	}

	if (response.status === 403) throw new Error(`${error_message}. Данные не доступны для вашего тарифного плана.`);
	if (response.status === 404) throw new Error(`${error_message}. Запрошенные данные отсутствуют на сервере.`);
	if (response.status === 429) throw new Error(`${error_message}. Превышен лимит количества запросов. Попробуйте обновить страницу позже.`);

	let json = await response.json();

	if (response.status === 400) throw new Error(`${error_message}. (${json.message}).`);
	if (!response.ok) throw new Error(`${error_message}. Код ошибки - ${response.status}`);

	return json;
}