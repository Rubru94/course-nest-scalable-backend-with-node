import axios from "axios";

// Liskov substitution principle
export interface PokeApiHttpAdapter {
  get<T>(url: string): Promise<T>;

  // post(url: string, data: any): void;

  // patch(url: string, data: any): void;

  // delete<T>(url: string): Promise<T>;
}

export class PokeApiFetchAdapter implements PokeApiHttpAdapter {
  async get<T>(url: string): Promise<T> {
    console.log("Using fetch");
    const resp = await fetch(url);
    const data: T = await resp.json();

    return data;
  }
}

export class PokeApiAxiosAdapter implements PokeApiHttpAdapter {
  private readonly axios = axios;

  async get<T>(url: string): Promise<T> {
    console.log("Using axios");
    const { data } = await this.axios.get<T>(url);
    return data;
  }
}
