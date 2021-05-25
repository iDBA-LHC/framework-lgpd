import { CreatePasswordRequest } from "./../models/user/create-password-request";
import { UserUpdateRequest } from "./../models/user/user-update-request";
import { UserNewRequest } from "./../models/user/user-new-request";
import { UserDetailResponse } from "./../models/user/user-detail-response";
import { UserResponse } from "./../models/user/user-response";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

const API = environment.apiURL + "user/";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(active?: boolean) {
    const params = active
      ? new HttpParams().set("active", active.toString())
      : {};
    return this.http.get<UserResponse[]>(API, { params });
  }

  findById(userId: number) {
    return this.http.get<UserDetailResponse>(API + userId);
  }

  createUser(userNew: UserNewRequest) {
    return this.http.post<UserResponse>(API, userNew);
  }

  updateUser(userId: number, userUpdate: UserUpdateRequest) {
    return this.http.put<UserDetailResponse>(API + userId, userUpdate);
  }

  removeUser(userId: number) {
    return this.http.delete(API + userId);
  }

  createPassword(createPasswordRequest: CreatePasswordRequest, userId: number) {
    return this.http.put<UserResponse>(
      API + `${userId}/create-password`,
      createPasswordRequest
    );
  }

  activeUser(userId: number) {
    return this.http.put(API + `active/${userId}`, {});
  }
}
