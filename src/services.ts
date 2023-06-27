/**
 * 根据 url 解析 json
 * @param url 
 * @returns 
 */
export const fetchJson = async (url: string) => {
  try {
    const response = await fetch(url)
    const json = response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}