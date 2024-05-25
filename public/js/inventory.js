'use strict';

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded event fired');

  // Get a list of items in inventory based on the classification_id
  let classificationList = document.querySelector("#classification_id");

  if (classificationList) {
    console.log('classificationList element found');
    classificationList.addEventListener("change", function() {
      let classification_id = classificationList.value;
      console.log(`classification_id is: ${classification_id}`);
      let classIdURL = "/inv/getInventory/" + classification_id;

      fetch(classIdURL)
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
          throw Error("Network response was not OK");
        })
        .then(function(data) {
          console.log('Data received from server:', data);
          if (Array.isArray(data)) {
            // If data is an array, use it directly
            buildInventoryList(data);
          } else {
            // If data is an object, check if it has a "vehicles" property
            if (data.vehicles && Array.isArray(data.vehicles)) {
              buildInventoryList(data.vehicles);
            } else {
              console.log("Invalid data format");
            }
          }
        })
        .catch(function(error) {
          console.log('There was a problem: ', error.message);
        });
    });
  } else {
    console.log("classificationList element not found");
  }
});

// Build inventory items into HTML table component and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");

  // Check if the inventoryDisplay element exists
  if (inventoryDisplay) {
    console.log('inventoryDisplay element found');
    // Clear the existing content
    inventoryDisplay.innerHTML = '';

    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';

    data.forEach(function(element) {
      console.log(element.inv_id + ", " + element.inv_model);
      dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
      dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
      dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });

    dataTable += '</tbody>';

    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
  } else {
    console.log("inventoryDisplay element not found");
  }
}