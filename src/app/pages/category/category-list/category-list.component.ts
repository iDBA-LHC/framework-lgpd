import { ExportPdfService } from "./../../../services/export-pdf.service";
import { ConfirmModalComponent } from "./../../../shared/components/confirm-modal/confirm-modal.component";
import { CategoryService } from "./../../../services/category.service";
import { CustomSnackBarService } from "../../../shared/components/custom-snack-bar/custom-snack-bar.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
} from "@angular/material";
import { Router } from "@angular/router";

const mockedCategories: any[] = [
  {
    id: 1,
    description: "Categoria 1",
  },
  {
    id: 2,
    description: "Categoria 3",
  },
  {
    id: 3,
    description: "Categoria 4",
  },
  {
    id: 4,
    description: "Categoria 5",
  },
];

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = ["id", "description", "actions"];

  private getOnlyActive = true;

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private categoryService: CategoryService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService
  ) {}

  ngOnInit() {
    this.loadCategories(this.getOnlyActive);
  }

  downloadPdf() {
    this.exportPdfService.download(
      this.displayedColumns.slice(0, this.displayedColumns.length - 1),
      mockedCategories
    );
  }

  openPdf() {
    this.exportPdfService.open(
      this.displayedColumns.slice(0, this.displayedColumns.length - 1),
      mockedCategories
    );
  }

  private loadCategories(active?: boolean) {
    //this.categoryService.getAll(active).subscribe((categoryResponseList) => {
    //this.dataSource = new MatTableDataSource(categoryResponseList);
    this.dataSource = new MatTableDataSource(mockedCategories);
    setTimeout(() => {
      this.dataSource.filterPredicate = (
        data: { description: string },
        filterValue: string
      ) => data.description.trim().toLowerCase().indexOf(filterValue) !== -1;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.isLoading = true;
    //});
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyValue(event) {
    this.getOnlyActive = !event.checked;
    this.loadCategories(this.getOnlyActive);
  }

  removeCategory(category) {
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar exclusão de categoria",
        msg: `Tem certeza que deseja prosseguir com a exclusão da categoria ${category.description}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.removeCategory(category.id).subscribe(
          () => {
            this.loadCategories(this.getOnlyActive);
            this.snackBar.openSnackBar(
              `${category.description} foi removido com sucesso.`,
              null
            );
          },
          (err) => this.snackBar.openSnackBar(err.error, null, "Error")
        );
      }
    });
  }
}
