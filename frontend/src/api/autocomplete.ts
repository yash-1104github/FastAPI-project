export async function fetchAutocomplete(code: string, cursorPosition: number, language='python'){
  try{
    const res = await fetch('/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cursorPosition, language })
    })
    if(!res.ok) throw new Error('Some Error Occured')
    const data = await res.json()
    return data.suggestion
  }catch(err){
    return 'Some Newtwork error occured'
  }
}