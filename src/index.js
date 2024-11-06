// index.js

// Callbacks
const handleClick = ramen => {

  // store current ramen id as the class name for later reference
  document.querySelector("#ramen-detail").className = ramen.id;

  // show information for selected ramen in details section
  document.querySelector(".detail-image").src = ramen.image;
  document.querySelector(".name").textContent = ramen.name;
  document.querySelector(".restaurant").textContent = ramen.restaurant;
  document.querySelector("#rating-display").textContent = ramen.rating;
  document.querySelector("#comment-display").textContent = ramen.comment;

  // pre-populate selected ramen in edit section
  const editForm = document.querySelector("#edit-ramen");

  editForm["edit-rating"].value = ramen.rating;
  document.querySelector("#edit-comment").value = ramen.comment;
};

const addSubmitListener = () => {

  const ramenForm = document.querySelector("#new-ramen");

  ramenForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    const ramen = {};

    // put together ramen object for new menu item
    ramen.name = ramenForm.name.value;
    ramen.restaurant = ramenForm.restaurant.value;
    ramen.image = ramenForm.image.value;
    ramen.rating = ramenForm.rating.value;
    ramen.comment = document.querySelector("#new-comment").value;

    // display new ramen on page
    renderRamen(ramen)
    handleClick(ramen);

    // add new menu item to backend data
    fetch(`http://localhost:3000/ramens`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(ramen)
      })
      .then(res => res.json())
      .then(ramen => console.log("NEW", ramen))
  })
}

const renderRamen = ramen => {
  const menu = document.querySelector("#ramen-menu");

  const newItem = document.createElement("img");
  newItem.src = ramen.image;
  newItem.alt = "ramen";

  menu.append(newItem);

  newItem.addEventListener("click", () => handleClick(ramen));
}

const displayRamens = () => {

  // grab data from backend and populate photos on page
  fetch("http://localhost:3000/ramens")
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then(ramens => {
    const menu = document.querySelector("#ramen-menu");
    ramens.forEach(renderRamen);

    // show first menu item by default    
    handleClick(ramens[0]);    
  })
    .catch(e => console.error(e))
};

const createRamenObj = () => {

  // identify current ramen information
  return {
        id: document.querySelector("#ramen-detail").className,
        image: document.querySelector(".detail-image").src,
        name: document.querySelector(".name").textContent,
        restaurant: document.querySelector(".restaurant").textContent,
        rating: document.querySelector("#rating-display").textContent,
        comment: document.querySelector("#comment-display").textContent
        }
}

const addEditEvent = () => {

  const editForm = document.querySelector("#edit-ramen");

  editForm.addEventListener("submit", (e)=> {

    e.preventDefault();
    
    // identify current ramen information and create a copy of the object 
    const ramen = createRamenObj()
    const ramenEdited = { ...ramen };

    // update ramen object with the new information
    ramenEdited.rating = editForm["edit-rating"].value;
    ramenEdited.comment = document.querySelector("#edit-comment").value;

    // reflect updates in the detail section
    document.querySelector("#rating-display").textContent = ramenEdited.rating;
    document.querySelector("#comment-display").textContent = ramenEdited.comment;

    // update data in the backend
    fetch(`http://localhost:3000/ramens/${ramen.id}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(ramenEdited)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(ramen => console.log("EDITED", ramen))
    .catch(e => console.error(e))
  })
}

const addDeleteEvent = () => {

  const deleteBtn = document.querySelector("#delete");

  deleteBtn.addEventListener("click", ()=> {
    const ramenName = document.querySelector(".name").textContent;
    const userConfirm = confirm(`Are you sure you want to delete the ${ramenName}? It looks pretty tasty...`);

    if (userConfirm) {
      // find current item and remove
      const ramenImg = document.querySelector(".detail-image");
      const ramenMenu = document.querySelector("#ramen-menu");
      const ramenPreview = Array.from(ramenMenu.children).find(element => 
        element.src === ramenImg.src);

      ramenPreview.remove()

      // show first menu item by default    
      handleClick(ramens[0]);    

      // remove menu item in the backend
      const ramenDetail = document.querySelector("#ramen-detail");

      fetch(`http://localhost:3000/ramens/${ramenDetail.className}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(ramen => console.log("DELETED", ramen))
      .catch(e => console.error(e))}

    else {
      alert("That was a close one!")
    }

    })
}

const main = () => {

  // Invoke events
  displayRamens();
  addSubmitListener();
  addEditEvent();
  addDeleteEvent();
}

document.addEventListener("DOMContentLoaded", () => {main()})

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
