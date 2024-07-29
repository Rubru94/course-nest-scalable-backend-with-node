import "./style.css";
// import { name, templateString, age } from "./bases/01-types.ts";
// import { users } from "./bases/02-objects";
// import { charmander } from "./bases/03-classes";
// import { charmander } from "./bases/04-injections";
// import { charmander } from "./bases/05-decorators";
import { charmander } from "./bases/06-decorators-deprecated";

import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Hello ${charmander.name} ${charmander.id}</h1>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <!--<h2>Name: ${name}</h2>-->
    <div class="card">
    
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
