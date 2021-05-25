import { MatPaginatorIntl } from "@angular/material";

export class MatPaginatorIntlPTBR extends MatPaginatorIntl {
  itemsPerPageLabel = "Itens por página";
  nextPageLabel = "Próximo";
  previousPageLabel = "Anterior";

  getRangeLabel = function(page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return "0 de 0";
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " de " + length;
  };
}
