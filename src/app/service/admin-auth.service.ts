import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { AdminCadastroRequest, AdminLoginRequest, AdminLoginResponse } from "../models/admin.model";
import { TokenService } from "./token.service";
import { enviroment } from "../../enviroments/enviroments";


@Injectable({ providedIn: 'root' })
export class AdminAuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private url = enviroment.apiKaraoke; // sua API

  async cadastrar(body: AdminCadastroRequest) {
  const token = this.tokenService.get();

  if (!token) {
    throw new Error("Token ausente. Faça login antes de cadastrar um administrador.");
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  const res = await firstValueFrom(
    this.http.post(this.url + "/admin", body, {
      headers,
      observe: "response"
    })
  );

  if (res.status !== 200 && res.status !== 201) {
    throw new Error("Falha ao cadastrar administrador");
  }
}

  async login(body: AdminLoginRequest): Promise<string> {
    const result = await firstValueFrom(
      this.http.post<AdminLoginResponse>(this.url + "/admin/login", body)
    );

    this.tokenService.set(result.token);
    return result.token;
  }
}
