const getTitleElement = document.getElementById('title');
const getPriceElement = document.getElementById('price');
const getTaxesElement = document.getElementById('taxes');
const getTotalElement = document.getElementById('total');
const getQuantityElement = document.getElementById('quantity');
const getCategoryElement = document.getElementById('category');
const getsubmitProductElement = document.getElementById('submitProduct');
const getElementsToCountTotal = document.querySelectorAll('.total-element');
const getCategoryCreateElement = document.getElementById('categoryCreate');
const getTextElementsToValidate = document.querySelectorAll('.text-validations');
const getSubmitCategoryElement = document.getElementById('submitCategory');
const getCategoryElementToUpdateOrDelete = document.getElementById('chooseCategoryToAction');
const tableHead = document.getElementsByTagName('th');
const getUpdateCategoryButton = document.getElementById('updateCategory');
const getDeleteCategoryButton = document.getElementById('deleteCategory');


let errorMessage = document.createElement('p');
errorMessage.style.color = 'red';


//------------------------------------------------------------------------------
// -------------------------------- Validations --------------------------------
//------------------------------------------------------------------------------

const getCategoryToUpdateElement = document.getElementById('chooseCategoryToAction');
const getUpdateCategoryButtonElement = document.getElementById('updateCategory');

getUpdateCategoryButtonElement.addEventListener('click', function () {

    var x = document.createElement("INPUT");
    x.setAttribute("type", "text");
    x.setAttribute("value", getCategoryToUpdateElement.value);
    getCategoryToUpdateElement.insertAdjacentElement('afterend',x);
    
});



getUpdateCategoryButtonElement.addEventListener('click', function () {
   
    const selectedCategory = getCategoryToUpdateElement.value;

    const updatedCategory = getCategoryUpdateInputElement.value;


    if (ensureExistence(categories, updatedCategory)) {
        
        getCategoryUpdateInputElement.insertAdjacentElement('afterend', errorMessage);
        return;
    }

  
    updateCategoryName(selectedCategory, updatedCategory);

  
    readCategories();
    showData();


    getCategoryUpdateInputElement.style.display = 'none';
});


// function updateCategoryName(oldCategory, newCategory) {
//     const categories = JSON.parse(localStorage.getItem('categories'));

//     const index = categories.findIndex(category => category.title === oldCategory);

//     if (index !== -1) {
//         categories[index].title = newCategory;
//         localStorage.setItem('categories', JSON.stringify(categories));
//     }
// }








// ------------------------------------------
// Validations On Title + Category inputs----
// ------------------------------------------

getTextElementsToValidate.forEach(function (element) {
    element.addEventListener('blur', () => {
        if (element.value.length >= 20) {
            errorMessage.innerHTML = 'Invalid Text.. Enter a text with at least 20 characters..';
            element.insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else if (element.value == '' && element == getTitleElement) {
            errorMessage.innerHTML = 'Field is Required';
            element.insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else {
            errorMessage.innerHTML = '';
        }
    })
})



// ---------------------------------------
// Validations On Price && Taxes inputs---
// ---------------------------------------

getElementsToCountTotal.forEach(function (element) {
    element.oninput = function () {
        element.value = element.value.replace(/[^0-9.]/g, '');
    };

    element.onblur = function () {
        if (element.value == '') {
            errorMessage.innerHTML = 'Field is Required..';
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        }
        else if (element == getPriceElement && element.value == 0) {
            errorMessage.innerHTML = `Don't Start With Zero..`;
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else if (/^0[0-9]/.test(element.value) || countOccurrences(element.value, '.') > 1) {
            errorMessage.innerHTML = 'Enter a VALID Input..';
            document.querySelector('.money').insertAdjacentElement('afterend', errorMessage);
            element.focus();
            element.select();
        } else {
            errorMessage.innerHTML = '';
        }
    }
});

function countOccurrences(str, charToCount) {
    let count = 0;

    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === charToCount) {
            count++;
        }
    }

    return count;
}

//----------------------------------
// Validations On Quantity inputs---
//----------------------------------

getQuantityElement.oninput = function () {
    getQuantityElement.value = getQuantityElement.value.replace(/[^0-9]/g, '');
};

getQuantityElement.onblur = function () {
    if (getQuantityElement.value == '') {
        errorMessage.innerHTML = 'Field is Required..';
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    }
    else if (getQuantityElement.value == 0) {
        errorMessage.innerHTML = `Don't Start With Zero..`;
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    } else if (/^0[0-9]/.test(getQuantityElement.value)) {
        errorMessage.innerHTML = 'Enter a VALID Input..';
        getQuantityElement.insertAdjacentElement('afterend', errorMessage);
        getQuantityElement.focus();
        getQuantityElement.select();
    } else {
        errorMessage.innerHTML = '';
    }
}



//------------------------------------------------------------------------------
// ----------------------------------- CRUDS -----------------------------------
//------------------------------------------------------------------------------


// ------------------------------
// GET total price---------------
// ------------------------------

getElementsToCountTotal.forEach(function (element) {
    element.addEventListener('keyup', () => {
        if (getPriceElement.value != '' && getPriceElement.value != 0 &&
            !(/^0[0-9]/.test(getTaxesElement.value)) && !(/^0[0-9]/.test(getPriceElement.value)) &&
            countOccurrences(element.value, '.') <= 1) {
            let totalPrice = Number(getPriceElement.value) + Number(getTaxesElement.value);
            getTotalElement.innerHTML = totalPrice;
            getTotalElement.style.background = '#040';
        } else {
            getTotalElement.innerHTML = '';
            getTotalElement.style.background = 'rgba(255, 17, 17, 0.655)';
        }
    });
});



// ------------------------------
// CREATE products---------------
// ------------------------------

let products;

if (localStorage.products) {
    products = JSON.parse(localStorage.products);
} else {
    products = [];
}

getsubmitProductElement.onclick = function () {
    if (getTitleElement.value != '' && getPriceElement.value != '' &&
        getTaxesElement.value != '' && getQuantityElement.value != '' &&
        getCategoryElement.value != '' && getCategoryElement.value !== 'Choose a Category') {

        if (ensureExistence(products, getTitleElement.value)) {
            errorMessage.innerHTML = 'This is already product with this name..';
            getsubmitProductElement.insertAdjacentElement('afterend', errorMessage);
            return;
        }

        let newProduct = {
            title: getTitleElement.value,
            price: getPriceElement.value,
            taxes: getTaxesElement.value,
            total: getTotalElement.innerHTML,
            quantity: getQuantityElement.value,
            category: getCategoryElement.value
        }
        products.unshift(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        clearInputs();
        getTotalElement.style.background = 'rgba(255, 17, 17, 0.655)';
    } else {
        errorMessage.innerHTML = 'Fill empty Boxes..';
        getsubmitProductElement.insertAdjacentElement('afterend', errorMessage);
    }
    showData();
    readCategories();
};



// ------------------------------
// CREATE Categories-------------
// ------------------------------

let categories;

if (localStorage.categories) {
    categories = JSON.parse(localStorage.categories);

} else {
    categories = [];
}

getSubmitCategoryElement.onclick = function () {
    if (getCategoryCreateElement.value != '') {
        categories = JSON.parse(localStorage.categories);
        if (ensureExistence(categories, getCategoryCreateElement.value)) {
            errorMessage.innerHTML = 'This is already category with this name..';
            getCategoryCreateElement.insertAdjacentElement('afterend', errorMessage);
            return;
        }
        let newCategory = {
            title: getCategoryCreateElement.value,
        }
        categories.unshift(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        getCategoryCreateElement.value = '';
        readCategories();
    } else {
        errorMessage.innerHTML = 'Write the Category Title..';
        getCategoryCreateElement.insertAdjacentElement('afterend', errorMessage);
    }
    showData();
};


function ensureExistence(arr, str) {
    if (arr.length == 0) return false;
    return arr.some(element => String(element.title.replace(/ /g, "")).toLowerCase().trim() === String(str.replace(/ /g, "")).toLowerCase().trim());
}

getDeleteCategoryButton.onblur = function () {
    errorMessage.innerHTML = '';
}
getSubmitCategoryElement.onblur = function () {
    errorMessage.innerHTML = '';
}

// ------------------------------
// CLEAR inputs------------------
// ------------------------------

function clearInputs() {
    getTitleElement.value = '';
    getPriceElement.value = '';
    getTaxesElement.value = '';
    getTotalElement.innerHTML = '';
    getQuantityElement.value = '';
    getCategoryElement.innerHTML = '<option disabled selected>Choose a Category</option>';
    getCategoryCreateElement.value = '';
}


// ------------------------------
// READ Data From LocalStorage---
// ------------------------------

function showData() {

    let createProductsTable = '';

    for (let i = 0; i < products.length; i++) {
        createProductsTable += `
        <tr>
        <td class='tableCell'>${i + 1}</td>
        <td class='tableCell'>${products[i].title}</td>
        <td class='tableCell'>${products[i].price}</td>
        <td class='tableCell'>${products[i].taxes}</td>
        <td class='tableCell'>${products[i].total}</td>
        <td class='tableCell'>${products[i].quantity}</td>
        <td class='tableCell'>${products[i].category}</td>

        <td class='tableCell ${i + 1}update' id='updateProduct' onclick()><i class="fas fa-edit" id="update-product" title="Update" style="color:yellow";></i></td>
        <td class='tableCell ${i + 1}delete' id='deleteProduct' onclick='deleteProduct()'><i class="fa-solid fa-trash" id="update-product" title="Delete" style="color:red;"></i></td>
        </tr>
        `;
    }

    document.getElementById('tableBody').innerHTML = createProductsTable;


    if (document.querySelector('.tableCell')) {
        for (let i = 0; i < tableHead.length; i++) {
            tableHead[i].style.color = 'green';
        }
    }
    else {
        for (let i = 0; i < tableHead.length; i++) {
            tableHead[i].style.color = '#fff';
        }
    }

}

showData();


function readCategories() {
    getCategoryElement.innerHTML = '<option disabled selected>Choose a Category</option>';
    getCategoryElementToUpdateOrDelete.innerHTML = '<option disabled selected>Choose Category to Update or Delete</option>';
    let getCategories = JSON.parse(localStorage.getItem('categories'));
    let categoriesList = ``;
    if (getCategories != null) {
        getCategories.forEach(function (element) {
            categoriesList += `<option>${element.title}</option>`;
        });
        getCategoryElement.innerHTML += categoriesList;
        getCategoryElementToUpdateOrDelete.innerHTML += categoriesList;
    }
}

readCategories();


// ------------------------------
// DELETE Categories-------------
// ------------------------------

getDeleteCategoryButton.onclick = function () {
    if (getCategoryElementToUpdateOrDelete.value !== 'Choose Category to Update or Delete') {
        for (let index = 0; index < products.length; index++) {
            if (products[index].category === getCategoryElementToUpdateOrDelete.value) {
                errorMessage.innerHTML = `This Category has products, please update these products' categories first..`;
                getCategoryElementToUpdateOrDelete.insertAdjacentElement('afterend', errorMessage);
                return;
            }
        }
        const categories = JSON.parse(localStorage.getItem('categories'));

        let pos;
        for (let index = 0; index < categories.length; index++) {
            if (categories[index].title == getCategoryElementToUpdateOrDelete.value) {
                pos = index;
                break;
            }
        }

        categories.splice(pos, 1);

        localStorage.removeItem('categories');
        localStorage.setItem('categories', JSON.stringify(categories));

        readCategories();
    }
}

getCategoryElementToUpdateOrDelete.onclick = () => {
    errorMessage.innerHTML = '';
}



// ------------------------------
// DELETE Products---------------
// ------------------------------
function deleteProduct() {
    const getProductId = document.getElementById("deleteProduct").className.split(' ')[1].slice(0, -6) - 1;


    products.splice(getProductId, 1);

    localStorage.removeItem('products');
    localStorage.setItem('products', JSON.stringify(products));

    showData();
}