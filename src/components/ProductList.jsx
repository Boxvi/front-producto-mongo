import React, {useContext, useState} from "react";
import {Panel} from "primereact/panel";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {ProductContext} from "../contexts/ProductContext";
import ProductForm from "./ProductForm";


const ProductList = () => {

    const {products, findProductById} = useContext(ProductContext)

    const [isVisible, setIsVisible] = useState(false);

    const saveProduct = (id) => {
        findProductById(id);
        setIsVisible(true);
    };

    const footer = (
        <div className="p-clearfix" style={{width: "100%"}}>
            <Button
                style={{float: "left"}}
                icon="pi pi-plus"
                label="Add"
                onClick={() => setIsVisible(true)}
            />
        </div>
    );

    const imageBodyTemplate = (rowData) => {
        return <img src={`${rowData.fotoUrl}`} className="product-image" width={"100px"} alt={rowData.name}/>;
    }

    const calcularTotal = (rowData) => {
        return rowData.precio * rowData.stock;
    }

    return (<div>
            <Panel header='LISTA DE PRODUCTOS CARNICERIA BORIS QUIZHPE' style={{textAlign: "center"}}>
                <DataTable
                    value={products}
                    selectionMode="single"
                    onSelectionChange={(e) => saveProduct(e.value.id)}
                    footer={footer}
                >
                    <Column field="id" header="Id"/>
                    <Column field="nombre" header="Nombre"/>
                    <Column field="precio" header="Precio"/>
                    <Column header="Foto Url" body={imageBodyTemplate}/>
                    <Column field="stock" header="Stock"/>
                    <Column header="Total" body={calcularTotal} />

                </DataTable>
            </Panel>
            <ProductForm isVisible={isVisible} setIsVisible={setIsVisible}/>
        </div>
    );
};

export default ProductList;
