import { CategoryUpdateRequest } from "./../models/category/category-update-request";
import { CategoryNewRequest } from "./../models/category/category-new-request";
import { CategoryDetailResponse } from "./../models/category/category-detail-response";
import { CategoryResponse } from "./../models/category/category-response";
import { HttpParams } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const API = environment.apiURL + "category/";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAll(active?: boolean) {
    const params = active
      ? new HttpParams().set("active", active.toString())
      : {};
    return this.http.get<CategoryResponse[]>(API, { params });
  }

  findById(categoryId: number) {
    return this.http.get<CategoryDetailResponse>(API + categoryId);
  }

  removeCategory(categoryId: number) {
    return this.http.delete(API + categoryId);
  }

  createCategory(categoryNew: CategoryNewRequest) {
    return this.http.post<CategoryResponse>(API, categoryNew);
  }

  updateCategory(categoryId: number, categoryUpdate: CategoryUpdateRequest) {
    return this.http.put<CategoryDetailResponse>(
      API + categoryId,
      categoryUpdate
    );
  }
}
