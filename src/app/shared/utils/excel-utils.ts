

export class ExcelUtils {

    static autoWidth = (worksheet, minimalWidth = 10) => {
        worksheet.columns.forEach((column) => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                maxColumnLength = Math.max(
                    maxColumnLength,
                    minimalWidth,
                    cell.value ? cell.value.toString().length : 0
                );
            });
            column.width = maxColumnLength + 2;
        });
    };
    
    public static autoHeight = (worksheet) => {
        const lineHeight = 12 // height per line is roughly 12
        worksheet.eachRow((row) => {
            let maxLine = 1;
            row.eachCell((cell) => {
                maxLine = Math.max(cell.value.split('\n').length - 1, maxLine)
            })
            row.height = lineHeight * maxLine
        })
    }
}



