import React, {useContext, useState, useEffect} from "react";
import {ProductContext} from "../contexts/ProductContext";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
const ProductForm = (props) => {

    const {isVisible, setIsVisible} = props;

    const {
        createProduct,
        deleteProduct,
        updateProduct,
        editProduct,
    } = useContext(ProductContext);

    const initialProductState = {
        id: 0,
        nombre: "",
        fotoUrl: "",
        precio: 0,
        stock: 0,
        total: 0,
    };

    const [productData, setProductData] = useState(initialProductState);

    useEffect(() => {
        if (editProduct) setProductData(editProduct);
    }, [editProduct]);


    const updateField = (data, field) => {

        setProductData({
            ...productData,
            [field]: data,
        });


    };

    const _deleteProduct = () => {
        if (editProduct) {
            deleteProduct(productData.id);
            setProductData(initialProductState);
        }
        setIsVisible(false);
    };

    const saveProduct = () => {
        if (!editProduct) {
            createProduct(productData);
        } else {
            updateProduct(productData);
            window.location.reload();
        }
        setProductData(initialProductState);
        setIsVisible(false);
    };

    const dialogFooter = (
        <div className="ui-dialog-buttonpane p-clearfix">
            <Button label="Delete" icon="pi pi-times" onClick={_deleteProduct}/>
            <Button label="Save" icon="pi pi-check" onClick={saveProduct}/>
        </div>
    );

    const clearSelected = () => {
        setIsVisible(false);
        setProductData(initialProductState);
    };

    return (
        <div>
            <Dialog
                visible={isVisible}
                modal={true}
                style={{width: "420px"}}
                contentStyle={{overflow: "visible"}}
                header="Detalles del Producto"
                onHide={() => clearSelected()}
                footer={dialogFooter}
            >
                <div className="p-grid p-fluid">
                    
                    <br/>
                    <div className="p-float-label">
                        <InputText
                            value={productData.nombre}
                            onChange={(e) => updateField(e.target.value, "nombre")}
                        />
                        <label>NOMBRE: </label>
                    </div>
                    <br/>
                    <div className="p-float-label">
                        <InputText
                            value={productData.fotoUrl}
                            onChange={(e) => updateField(e.target.value.trim(), "fotoUrl")}
                        />
                        <label>FOTO URL: </label>
                    </div>
                    <br/>
                    <div className="p-float-label">
                        <InputText
                            value={productData.precio}
                            onChange={(e) => updateField(e.target.value.trim(), "precio")}

                        />
                        <label>PRECIO: </label>
                    </div>
                    <br/>
                    <div className="p-float-label">
                        <InputNumber
                            value={productData.stock}
                            onChange={(e) => updateField(e.value, "stock")}

                        />
                        <label>STOCK: </label>
                    </div>
                    <br/>
                </div>
            </Dialog>
        </div>
    );
    /*


    */
};

export default ProductForm;

/*
<br/>
                    <div className="p-float-label">
                        <InputText
                            value={productData.id}
                            onChange={(e) => updateField(e.target.value.trim(), "id")}
                        />
                        <label>ID: </label>
                    </div>
*/
