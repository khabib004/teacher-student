const categoriesRow = document.querySelector( ".categories-row" );
const categorySearchInput = document.querySelector(
  ".category-search-input input"
);
const categoriesCount = document.querySelector( ".categories-count" );
const pagination = document.querySelector( ".pagination" );
const categoryForm = document.querySelector( ".category-form" );
const categoryModal = document.querySelector( "#category-modal" );
const addCategoryBtn = document.querySelector( ".add-category-btn" );
const addSaveCategoryBtn = document.querySelector( ".add-save-category-btn" );

let selectDropdown = document.querySelector( '#select-1' );
let search = "";
let activePage = 1;
let selected = null;
let filterValue = null;
let nameOrder = "";
// const LIMIT = 6;

function getCategoryCard( { firstname, avatar, email, groups, isMarrieds, phoneNumber, id } ) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-4 mt-3 mb-3">
      <div class="card card-teacher">
        <img src="${avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${firstname}</h5>
          <a href="#">${email}</a>
          <h1>Phone: ${phoneNumber}</h1>
          <h1>Groups: ${groups}</h1>
          <h1 class="info-box">Is Merried: <span>${isMarrieds ? "Merried" : "Single"}</span></h1>
          <div class="button-teacer">
            <button
              class="btn btn-primary edit-btn"data-bs-toggle="modal"data-bs-target="#category-modal"id="${id}">Edit</>
            <button class="btn btn-danger delete-btn" id="${id}">Delete</button>
            <a href="products.html?category=${id}" class="btn btn-success">See products</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function getCategories() {
  try {
    categoriesRow.innerHTML = "...loading";
    let params = { firstname: search };
    let paramsWithPagination = { firstname: search, limit: LIMIT };
    // all categories with search
    let { data } = await request.get( "/Teacher", { params } );
    // categories with pagination
    let { data: dataWithPagination } = await request.get( "/Teacher", {
      params: paramsWithPagination,
    } );

    // pagination
    let pages = Math.ceil( data.length / LIMIT );

    pagination.innerHTML = `<li class="page-item ${activePage === 1 ? "disabled" : ""
      }">
      <button page="-" class="page-link">Previous</button>
    </li>`;

    for ( let i = 1; i <= pages; i++ ) {
      pagination.innerHTML += `
        <li class="page-item ${i === activePage ? "active" : ""
        }"><button page="${i}" class="page-link">${i}</button></li>
      `;
    }

    pagination.innerHTML += `<li class="page-item ${activePage === pages ? "disabled" : ""
      }">
      <button page="+" class="page-link">Next</button>
    </li>`;

    categoriesCount.textContent = data.length;
    categoriesRow.innerHTML = "";

    dataWithPagination.map( ( Teacher ) => {
      categoriesRow.innerHTML += getCategoryCard( Teacher );
    } );
  } catch ( err ) {
  }
}

getCategories();

categorySearchInput.addEventListener( "keyup", function () {
  search = this.value;
  getCategories();
} );

pagination.addEventListener( "click", ( e ) => {
  let page = e.target.getAttribute( "page" );
  if ( page !== null ) {
    if ( page === "+" ) {
      activePage++;
    } else if ( page === "-" ) {
      activePage--;
    } else {
      activePage = +page;
    }
    getCategories();
  }
} );

categoryForm.addEventListener( "submit", async function ( e ) {
  e.preventDefault();
  let categoryData = {
    firstname: this.name.value,
    avatar: this.image.value,
    email: this.email.value,
    phonenumber: this.phoneNumber.value,
    groups: this.groups.value.split( "," ).map( ( item ) => item.trim().toLowerCase() ),
    isMarrieds: this.isMarrieds.checked,
  };
  if ( selected === null ) {
    await request.post( "/Teacher/", categoryData );
  } else {
    await request.put( `/Teacher/${selected}`, categoryData );
  }
  getCategories();
  bootstrap.Modal.getInstance( categoryModal ).hide();
} );

addCategoryBtn.addEventListener( "click", () => {
  selected = null;
  categoryForm.name.value = "";
  categoryForm.image.value = "";
  categoryForm.email.value = "";
  categoryForm.phoneNumber.value = "";
  categoryForm.groups.value = "";
  categoryForm.isMarrieds.checked = "";
  addSaveCategoryBtn.textContent = "Add Teacher";
} );

window.addEventListener( "click", async ( e ) => {
  let id = e.target.getAttribute( "id" );

  let checkEdit = e.target.classList.contains( "edit-btn" );
  if ( checkEdit ) {
    selected = id;
    let { data } = await request.get( `/Teacher/${id}` );
    categoryForm.name.value = data.firstname;
    categoryForm.image.value = data.avatar;
    categoryForm.email.value = data.email;
    categoryForm.phoneNumber.value = data.phoneNumber;
    categoryForm.groups.value = data.groups;
    categoryForm.isMarrieds.checked = data.isMarrieds;
    addSaveCategoryBtn.textContent = "Save Teacher";
    console.log( data );
  }

  let checkDelete = e.target.classList.contains( "delete-btn" );
  if ( checkDelete ) {
    let deleteConfirm = confirm( "Do you want to delete this Teacher?" );
    if ( deleteConfirm ) {
      await request.delete( `/Teacher/${id}` );
      getCategories();
    }
  }
} );



function getTeachersData( filterValue ) {
  const selectedOption = selectDropdown.value;
  filterValue = selectedOption === "false" ? false : selectedOption === "true" ? true : "";
  const queryParams = {
    firstname: search,
    sortBy: 'firstname',
    order: nameOrder,
  };



  if ( filterValue !== undefined ) {
    queryParams.isMarrieds = filterValue;
  }

  getTeachersData.get( `/Teacher/${id}`)
    .then( ( response ) => {
      let teachers = response.data;
      getTeachersData( `Teacher?firstname=${search}` ).then( ( res ) => {
        pagination()
      } );
      categoriesRow.innerHTML = "";
      teachers.map( ( el ) => {
        categoriesRow.innerHTML += getCategoryCard( el );
      } );
    } )
    .catch( ( error ) => {
      console.error( error );
    } );
} 

getTeachersData( filterValue );


getTeachersData();




selectDropdown.addEventListener( "change", function () {
  let filterValue = selectDropdown.value;
  console.log( filterValue );
  axiosInstance.get( `/Teacher`, {
    params: { isMarrieds: filterValue === "false" ? false : filterValue === "true" ? true : "", },
  } )

    .then( ( response ) => {
      const filteredStudents = response.data;
      categoriesRow.innerHTML = "";
      pagination()
      filteredStudents.map( ( el ) => {
        categoriesRow.innerHTML += getCategoryCard( el );
      } )
    } )
    .catch( ( error ) => {
      console.error( error );
    } );

} );
