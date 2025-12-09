import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenService{
    private _token = signal<string | null>(null);

    set(token: string | null): void{
        this._token.set(token);
    }

    get(): string | null{
        return this._token();
    }
}
