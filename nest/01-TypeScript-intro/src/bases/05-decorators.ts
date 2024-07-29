// decorators are functions, that depending on where they are used expand the functionality of a class, a method or a property.

class NewPokemon {
  constructor(public readonly id: number, public name: string) {}

  scream() {
    console.log(`From decorator !!`);
  }

  speak() {
    console.log(`decorator, decorator`);
  }
}

const MyDecorator = () => {
  return (target: Function) => {
    // console.log(target);
    return NewPokemon;
  };
};

@MyDecorator()
export class Pokemon {
  constructor(public readonly id: number, public name: string) {}

  scream() {
    console.log(`${this.name.toUpperCase()}!!`);
  }

  speak() {
    console.log(`${this.name}, ${this.name}!`);
  }
}

export const charmander = new Pokemon(4, "Charmander");

charmander.scream();
charmander.speak();
