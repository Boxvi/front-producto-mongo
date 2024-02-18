import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


export function ShowAlert(title,text, icono, foco="") {
    onfocus(foco)
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: title,
        text: text,
        icon: icono
    });
}

function onfocus(foco) {
    if (foco !== '' ) {
        document.getElementById(foco).focus();
    }
}
