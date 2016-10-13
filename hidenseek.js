let fs = require("fs"),
    pokemon = require("./pokemon.js")

let getRandomInt =  (min, max) =>
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.hide = (path, pokemonList) => {
	let number = pokemonList.length>=3?3:pokemonList.length,
			keys = [],
			paths = [],
      returnedList = new pokemon.pokemonList(),
			file;
	console.log('number', number);
  for(let i = 0; i < number; i++){
		keys.push(getRandomInt(0, pokemonList.length-1));
		paths.push(getRandomInt(1, pokemonList.length));
	}
	console.log(keys, paths);

	fs.mkdirSync(path);
	for(let i = 1; i <= 10; i++ ){
		console.log(i);
		let newPath = path + (i==10?i.toString():'0'+i);
		fs.mkdirSync(newPath);
		for (let j=0; j<paths.length; j++){
			if(i == paths[j]){
				console.log('В папке', i, 'создаю файл');
				console.log('j', keys[j]);
				console.log(pokemonList[keys[j]]);
				console.log(`${pokemonList[keys[j]].name}|${pokemonList[keys[j]].level}`);
				file = fs.appendFileSync(
					`${newPath}\\pokemon.txt`,
					`${pokemonList[keys[j]].name}|${pokemonList[keys[j]].level}\n`
				);
        returnedList.push(pokemonList[keys[j]]);
			}
		}
	}

  return returnedList;
}

	module.exports.seek = (path) => {

}
