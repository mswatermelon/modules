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
    super(...pokemons);
  }
  add(name, level) {
    let childPokemon = new Pokemon(name, level);
    this.push(childPokemon);
  }
  show(){
      console.log(`Покемонов в списке ${this.length}.`);
      for (let pokemon of this){
        pokemon.show();
      }
  }
  max(){
    let max = Math.max(...this);

    if (!isNaN(max) && max >= 0) {
      for (let pokemon of this){
         if (pokemon == max) pokemon.show();
      }
    }
    else {
      console.log('Список пуст');
    }
  }
}

module.exports = {
  pokemon: Pokemon,
  pokemonList: PokemonList
}
