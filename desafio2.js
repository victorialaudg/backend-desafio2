const fs = require('fs')
const filename = './productsList.json'
let readContent = fs.readFileSync(filename, 'utf-8')

class ProductManager {
    #products 
    #path

    constructor(path) {
        this.#products = []
        this.path = path
    }

    #generateID = () => {
        let id
        if(this.#products.length === 0) id = 1
        else id = this.#products[this.#products.length - 1].id + 1
        return id
    }
    
    getProducts = () => {
        if(fs.existsSync(filename)){
            return readContent
        }else{
            console.log('El archivo no existe');
            return this.#products
        }
        
    }

    updateProduct(id, data) {
        const updateById = this.#products.find(product => product.id === id)
       console.log('\n Resultado de updateById para futuro update: \n', updateById )
       updateById.title = data
       fs.writeFileSync(filename, JSON.stringify(this.#products, null, '\t'))
    }

    //Buscar un producto por su id
    getProductById = (id) => {
        //let existingProduct = this.#products.find(product => product.id === id) VERSIÓN DEL DESAFÍO ANTERIOR
        let existingProduct = this.#products.find(product => product.id === id)

        if (!existingProduct) throw new Error(`NOT FOUND: No existe ningún producto con el id ingresado: ${id}`);
        console.log('\n Resultado de búsqueda por id: \n',existingProduct)
        return existingProduct;
    }
    //Verifica si el código está repetido
    getCode = (code) => {
        let repeatedCode= this.#products.some(product => product.code === code)
        return repeatedCode;
    }
    
    addProduct = (title, description, price, thumbnail, code, stock) => {
    
        let getCode = this.getCode(code)

        let id = this.#generateID()

        let newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //Valida que todos los argumentos sean obligatorios
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error('Completa todos los campos')
            return
        }else if(getCode){ //Valida que no ingrese el producto con código repetido
            console.error(`ERROR: El código ${code} ya fue ingresado en otro producto y está repetido.`)
        }else{
            this.#products.push(newProduct)

             fs.writeFileSync(filename, JSON.stringify(this.#products, null, '\t'))
            
        }
        
    }

    

    deleteProduct(id) {
        const deleteById = this.#products.find(product => product.id === id)
        console.log('deleteById: ', deleteById.id)
        console.log('Borrar: ', deleteById)

        if (deleteById !== -1) {
            this.#products.splice(deleteById, 1);
            fs.writeFileSync(filename, JSON.stringify(this.#products, null, '\t'))
       }
    }

}

const productManager = new ProductManager('./productsList.json')

productManager.addProduct('Colombia', 'Auténtico café tostado colombiano', 2680,'images/cafe_barista_colombia.png', 'code125', 50) //Pushea OK 
productManager.addProduct('Mundial', 'Un café que combina las mejores notas en un blend mundial', 3500,'images/cafe_barista_mundial.png', 'code126', 30) //Pushea OK
productManager.addProduct('Brasil', 'Todos los aromas brasileros en un mismo sabor', 3000,'images/cafe_barista_brasil.png', 'code125', 40) //No se pushea por código repetido
productManager.addProduct('Catuai', 'Una molienda brasilera, orgánica y saludable', 4000,'images/cafe_barista_catuai.png') //No se pushea por campos incompletos
productManager.addProduct('Mundial2', 'Un café de test', 5500,'images/cafe_barista_mundial.png', 'code127', 35) //test update
productManager.addProduct('Costa Rica', 'Originario del Valle Occidental, orgánico y de aires costarricenses', 7000,'images/cafe_barista_costarica.png', 'code128', 30) //Pushea OK


productManager.updateProduct(3,'Un Café Customizado')
productManager.deleteProduct(1); //borra el 1er objeto del array

console.log(productManager.getProducts())


try {
    productManager.getProductById(165) //No encuentra este Id
}
catch (error) {
    console.error(error.message);
}
try {
    productManager.getProductById(2) //ID encontrado, devuelve el resultado como objeto
}
catch (error) {
    console.error(error.message);
}

