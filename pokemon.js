class Pokemon {
  constructor(name, level){
    this.name = name;
    this.level = level;
  }
  show() {
    console.log(`Покемон ${this.name} ${this.level} уровня.`);
  }
  valueOf() {
    return this.level;
  }
}

class PokemonList extends Array {
  constructor(...pokemons) {
    let truePokemons = pokemons.filter((pokemon) => {
      return pokemon instanceof Pokemon;
    });

    super(...truePokemons);
  }
  add(name, level) {
    let childPokemon = new Pokemon(name, level);
    this.push(childPokemon);
  }
  show(){
      console.log(`Покемонов в списке ${this.length}.`);
      this.forEach((element) => {
        element.show();
      });
  }
  max(){
    let max = Math.max(...this);

    return this.find((element) => {
      if (element == max) return true;
      else return false;
    });
  }
}

module.exports = {
  pokemon: Pokemon,
  pokemonList: PokemonList
}
