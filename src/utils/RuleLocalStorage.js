let key='rule'
let setRuleCache=(value)=>{
    localStorage.setItem(key,value)
}

let delRuleCache=()=>{
    localStorage.removeItem(key)
}

let getRuleCache=()=>{
    return localStorage.getItem(key)
}
export { delRuleCache, setRuleCache,getRuleCache }