module.exports = class vuid
{
    constructor(length = 8)
    {
        this.first = 97;
        this.last = 122;
        this.characters = this.generateCharacters();
        this.length = length;
    }
    generateCharacters()
    {
        let result = [], startChar = this.first, endChar = this.last;
        for(let i = startChar; i<=endChar; i++)
        {
            result.push(String.fromCharCode(i));
        }
        result.push(...[`0`,`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`]);
        return result;
    }
    grabRandomCharacter()
    {
        const index = Math.floor(Math.random()*this.characters.length);
        return this.characters[index];
    }
    v1(length = this.length)
    {
        let result = '';
        for(let i = 0; i<length; i++)
        {
            result += this.grabRandomCharacter();
        }
        return result;
    }
}