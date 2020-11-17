module.exports = {
    formatArray:(arry)=>
    {
        if(arry.length === 0)
        {
            return `ARRAY[]::text[]`
        }
        let result = '';
        for(const element of arry)
        {
            result += `,'${element}'`
        }
        return `ARRAY[${result.substr(1)}]`;
    }
}