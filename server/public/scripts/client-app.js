$(document).ready(function () {
  // getBooks();

  // // add a book
  // $('#book-submit').on('click', postBook);
  $('#owner_submit').on('click',postOwner);
  $('#pet_submit').on('click',postPet);
  $("#pet_list").on('click',".update",updatePet);

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
      console.log('GET /pets returns:', pets)
      console.log(pets);
      pets.forEach(function (pets) {
        var $el = $('<tr></tr>');
        var petProperties = ["name","breed","color"];
        console.log(pets.id);
        $el.append('<td>' + pets.first_name +' '+ pets.last_name + '</td>');
        // $el.append('<td> <input type ="text"/>'+ pets.name + '</td>');

        petProperties.forEach(function(property){
          var $input = $('<input type="text" id="'+property+'"name="'+property +'"/>');
          $input.val(pets[property]);
          var $holder = $('<td></td>');
          $holder.append($input);
          $el.append($holder);
        });
        $el.append('<td>' +'<button class ="update" data-id = "'+pets.id+'">Update</button>'+'</td>');
        $el.append('<td>' +'<button class ="delete" data-id = "'+pets.id+'">Delete</button>'+'</td>');
        $el.append('<td>' +'<button class ="checker" data-id = "'+pets.id+'">Check In/Out</button>'+'</td>');
        $('#pet_list').children().last().append($el);
      });
    },
    error: function (response) {
      console.log('GET /pets fail. No pets could be retrieved!');
    },
  });
}

function updatePet(){
  var pet= {};
  // var inputs = $(this).parent().children().serializeArray();
  var inputs = $(this).parent().parent().children().children().serializeArray();
  // console.log($(this).parent().children());

  $.each(inputs,function(i,field){
    pet[field.name] = field.value;
    //taking all the values of the field
  });
    pet.id = $(this).data('id');
  console.log('pets we are putting',pet);

  var petId = $(this).data('id');
  //the button is this, parent is the div and we put .data on the div

  // updating a resource or the single book in this instance
  $.ajax({
    type: 'PUT',
    url:'/pets/'+petId,
    //appending the book id
    //url data is different by convention and appending our ID to it
    data: pet,
    //sending data over
    success: function(){
      $('#pet_list').empty();
      getPets();
      //repopulate the book on the dom
    },
    error:function(){
      console.log('Error PUT /pets/'+petId);
    },
  });
}
//everytime toggle class is selected we will send a post request to
//document it on the visits

//liseners and function for delete, modify and toggle class mehthods
//within toggle class listener will fire off function that will
//post quest to server for appointments table and update the table (reword this)
