import { CustomSnackBarService } from '../components/custom-snack-bar/custom-snack-bar.service';

export class TrataExcessaoConexao {

    static TrataErroAutenticacao(err, snackBar: CustomSnackBarService, reconnectFunction)
    {
        if (reconnectFunction != null &&
            typeof reconnectFunction == "function") 
        {
            reconnectFunction();
        }
    }

    static TrataExcessao(err, snackBar: CustomSnackBarService)
    {
        if (err.status === 500 || err.hasOwnProperty("statusText"))
        {		
            if (err.error!=null)
            {
                snackBar.openSnackBar(err.error.msg, null, "Error");
            }	
            else 
            {
                snackBar.openSnackBar(err.statusText, null, "Error");
            }
            
        }
        else{
            snackBar.openSnackBar(err, null, "Error");
        }
    }
}