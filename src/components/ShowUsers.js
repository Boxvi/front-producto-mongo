import {useEffect, useState} from "react";
import axios from "axios";
import {ShowAlert} from "./Functions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function ShowUsers() {

    const api = "https://glorious-space-goldfish-v7vw9ppjg69c6ww-8080.app.github.dev/api/v2/productos";


    const [productos, setProductos] = useState([]);
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);

    useEffect(() => {
        getProductos();
    }, []);

    const getProductos = async () => {
        const response = await axios.get(api);
        setProductos(response.data);
    }

    const openModal = (op, id, nombre, fotoUrl, precio, stock) => {
        setId("");
        setNombre("")
        setFotoUrl("");
        setPrecio(0);
        setStock(0);
        setOperation(op);
        if (op === 1) {
            setTitle("Agregar Producto");
        } else {
            setTitle("Editar Producto");
            setId(id);
            setNombre(nombre);
            setFotoUrl(fotoUrl);
            setPrecio(precio);
            setStock(stock);
        }
        window.setTimeout(function () {
            document.getElementById("nombre").focus();
        }, 500);
    }

    const validate = () => {
        var parametro;
        var metodo;
        if (nombre.trim() === "") {
            ShowAlert('El nombre es requerido', 'error', 'nombre');
        } else if (fotoUrl.trim() === "") {
            ShowAlert('La imagen es requerida', 'error', 'fotoUrl');
        } else if (precio === 0) {
            ShowAlert('El precio es requerido', 'error', 'precio');
        } else if (stock === 0) {
            ShowAlert('El stock es requerido', 'error', 'stock');
        } else {
            if (operation === 1) {
                parametro = {
                    nombre: nombre,
                    fotoUrl: fotoUrl,
                    precio: precio,
                    stock: stock
                }



                metodo = 'post';
            } else if (operation === 2) {
                parametro = {
                    id: id,
                    nombre: nombre,
                    fotoUrl: fotoUrl,
                    precio: precio,
                    stock: stock
                }
                metodo = 'put';
            }
            save(metodo, parametro);
        }
    }

    const save = async (metodo, parametro) => {
        await axios({method: metodo, url: api, data: parametro}).then(function (respuesta) {

            var title = respuesta.data.title;
            var text = respuesta.data.text;
            var icon = respuesta.data.icon;
            ShowAlert(title, text, icon);
            if (icon === 'success') {
                document.getElementById('btn-close').click();
                getProductos();
            }
        })
            .catch(function (error) {
                ShowAlert("error", "hubo un problema al enviar solicitud", 'error');
                console.log(error);
            });
    }

    const deleteProducto = (id, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Estas seguro?',
            text: "No podras revertir esto!",
            showCancelButton: true, confirmButtonText: 'Si, eliminarlo!', cancelButtonText: 'No, cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(api + '/' + id).then(function (respuesta) {
                    var title = respuesta.data.title;
                    var text = respuesta.data.text;
                    var icon = respuesta.data.icon;
                    ShowAlert(title, text, icon);
                    if (icon === 'success') {
                        getProductos();
                    }
                }).catch(function (error) {
                    ShowAlert('Error', "hubo un problema al enviar solicitud", 'error');
                });
            } else {
                ShowAlert("No Eliminado", 'El producto no fue eliminado', 'error');
            }

        });

    }


    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal"
                                    data-bs-target="#modalUsers">
                                <i className="fa-solid fa-circle-plus"></i> Anadir
                            </button>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Imagen</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                {productos.map((producto) => (
                                    <tr key={producto._id}>
                                        <td>{producto._id}</td>
                                        <td>{producto.nombre}</td>
                                        <td><img src={producto.fotoUrl} width={50}/></td>
                                        <td>$ {producto.precio}</td>
                                        <td>$ {producto.stock}</td>
                                        <td>$ {producto.total}</td>
                                        <td>
                                            <button
                                                onClick={() => openModal(2, producto._id, producto.nombre, producto.fotoUrl, producto.precio, producto.stock)}
                                                className="btn btn-warning" data-bs-toggle={"modal"}
                                                data-bs-target={"#modalUsers"}>
                                                <i className="fa-solid fa-pencil"></i>
                                            </button>
                                            <button onClick={() => deleteProducto(producto._id, producto.nombre)}
                                                    className="btn btn-danger">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
            <div id={"modalUsers"} className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type="button" className="btn-close"  id={"btn-close"} data-bs-dismiss="modal"
                                    aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id"/>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-1"></i></span>
                                <input type="text" id="nombre" className="form-control" placeholder="Nombre"
                                       value={nombre}
                                       onChange={(e) => setNombre(e.target.value)}/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-2"></i></span>
                                <input type="text" id="fotoUrl" className="form-control" placeholder="Imagen URL"
                                       value={fotoUrl}
                                       onChange={(e) => setFotoUrl(e.target.value)}/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-3"></i></span>
                                <input type="number" id="age" className="form-control" placeholder="Precio"
                                       value={precio}
                                       onChange={(e) => setPrecio(e.target.value)}/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text"><i className="fa-solid fa-4"></i></span>
                                <input type="text" id="firstName" className="form-control" placeholder="Stock"
                                       value={stock}
                                       onChange={(e) => setStock(e.target.value)}/>
                            </div>

                            <div className={"d-grid col-6 mx-auto"}>
                                <button onClick={() => validate()} className={"btn btn-success"}>
                                    <i className="fa-solid fa-save"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className={"modal-footer"}>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowUsers;
