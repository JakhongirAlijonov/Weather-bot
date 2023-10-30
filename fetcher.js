
async function fetchApi(api){
    try{
        const res = await fetch(api)
        if(!res.ok == 200){
            throw new Error("Nimadir xato 200 emas")
        }
        const data = await res.json()
        return data;
    }catch(err){
        console.log(err.message);
    }
}


module.exports = fetchApi