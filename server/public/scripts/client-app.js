$(document).ready(function () {
  // getBooks();

  // // add a book
  // $('#book-submit').on('click', postBook);
  $('#owner_submit').on('click',postOwner);
  $('#pet_submit').on('click',postPet);
  getOwner();
  getPets();
  //loads drop down box

});

function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function (books) {
      console.log('GET /books returns:', books);
      books.forEach(function (book) {
        var $el = $('<li></li>');
        $el.append('<strong>' + book.title + '</strong>');
        $el.append(' <em>' + book.author + '</em');
        $el.append(' <time>' + book.published + '</time>');
        $('#book-list').append($el);
      });
    },

    error: function (response) {
      console.log('GET /books fail. No books could be retrieved!');
    },
  });
}
/**
 * Add a new book to the database and refresh the DOM
 */

function postOwner() {
  event.preventDefault();
  var ownerInfo = {};

  $.each($('#owner_form').serializeArray(), function (i, field) {
    ownerInfo[field.name] = field.value;
  });

  console.log('owners: ', ownerInfo);

  $.ajax({
    type: 'POST',
    url: '/owner',
    data: ownerInfo,
    success: function () {
      console.log('POST /owner works!');
      $('#pet_list').empty();
        getPets();
    },
    error: function (response) {
      console.log('POST /owner does not work...');
    },
  });
}
function postPet(){
  event.preventDefault();

  var petInfo = {};
  var owner_id = $("#selectOwners").val();

  console.log(owner_id);

  $.each($('#pets_form').serializeArray(), function (i, field) {
    petInfo[field.name] = field.value;
  });
  petInfo.owner_id = owner_id;
  console.log('pet: ', petInfo);

  $.ajax({
    type: 'POST',
    url: '/pets',
    data: petInfo,
    success: function () {
      console.log('POST /pet works!');
      $('#pet_list').empty();
      //getPets(); Add this later
    },
    error: function (response) {
      console.log('POST /pets does not work...');
    },
  });
};

//loads drop down names
function getOwner(){
  $.ajax({
    type: 'GET',
    url: '/owner',
    success: function(owners){
      $('#selectOwners').empty();
      console.log('GET /getOwnerList returns:', owners);
      owners.forEach(function(owners, i){
        var option = owners.first_name + " " +owners.last_name;
        var owner_id = owners.id;
        var $selectOption = $('<option value="' + owner_id+ '">' + option + '</option>');
        $('#selectOwners').append($selectOption);
      });
    },
    error: function(){
      console.log('GET /get owners failed');
    },
  });
}

function getPets() {
  $.ajax({
    type: 'GET',
    url: '/pets',
    success: function (pets) {
      console.log('GET /pets returns:', pets);
      pets.forEach(function (pets) {
        var $el = $('<tr></tr>');
        $el.append('<td>' + pets.first_name +' '+ pets.last_name + '</td>');
        $el.append('<td>'+ pets.name + '</td>');
        $el.append('<td>' + pets.breed + '</td>');
        $el.append('<td>' + pets.color + '</td>');
        $el.append('<td>' +'<button class ="update">Update</button>'+'</td>');
        $el.append('<td>' +'<button class ="delete">Delete</button>'+'</td>');
        $el.append('<td>' +'<button class ="checker">Check In/Out</button>'+'</td>');
        $('#pet_list').children().last().append($el);
      });
    },

    error: function (response) {
      console.log('GET /pets fail. No pets could be retrieved!');
    },
  });
}

//everytime toggle class is selected we will send a post request to
//document it on the visits

//liseners and function for delete, modify and toggle class mehthods
//within toggle class listener will fire off function that will
//post quest to server for appointments table and update the table (reword this)
