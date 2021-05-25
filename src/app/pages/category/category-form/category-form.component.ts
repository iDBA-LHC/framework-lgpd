import { CategoryAppButtons } from "./../../../models/category/app-buttons/category-app-buttons";
import { CategoryNewRequest } from "./../../../models/category/category-new-request";
import { CategoryUpdateRequest } from "./../../../models/category/category-update-request";
import { Validators } from "@angular/forms";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CustomSnackBarService } from "src/app/shared/components/custom-snack-bar/custom-snack-bar.service";

@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.css"],
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  categoryId: number;

  categoryAppButtons = new CategoryAppButtons();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: CustomSnackBarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      if (data["id?"]) {
        this.categoryId = data["id?"];
        this.categoryService
          .findById(this.categoryId)
          .subscribe((categoryDetail) => {
            this.categoryForm.patchValue({
              description: categoryDetail.description,
              active: categoryDetail.active,
              appButtonShortcutId: categoryDetail.appButtonShortcutId,
            });
          });
      }
    });

    this.createForm();
  }

  private createForm() {
    this.categoryForm = this.formBuilder.group({
      description: ["", Validators.required],
      active: [false, Validators.required],
      appButtonShortcutId: [0, Validators.required],
    });
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      if (this.categoryId) {
        const categoryUpdate: CategoryUpdateRequest = this.categoryForm.getRawValue();
        this.categoryService
          .updateCategory(this.categoryId, categoryUpdate)
          .subscribe(
            (categoryDetail) => {
              this.showMessage(
                `A categoria ${categoryDetail.description} foi atualizada com sucesso!`
              );
              this.router.navigate(["/category"]);
            },
            (err) => {
              this.showMessage(err.error, "Error");
            }
          );
      } else {
        const categoryNew: CategoryNewRequest = this.categoryForm.getRawValue();
        this.categoryService.createCategory(categoryNew).subscribe(
          (categoryResponse) => {
            this.showMessage(
              `A categoria ${categoryResponse.description} foi criada com sucesso!`
            );
            this.router.navigate(["/category"]);
          },
          (err) => {
            this.showMessage(err.error, "Error");
          }
        );
      }
    } else {
      this.showMessage("Campos obrigatórios não foram preenchidos.", "Warn");
    }
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }
}
