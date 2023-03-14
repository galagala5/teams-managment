module.exports = {
    getPhones:()=>{
        let _p = []
        for(let value of Object.values(phones)){
            _p.push(value)
        }
        return _p
    }
    
}