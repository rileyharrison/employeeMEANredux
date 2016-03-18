//initial function on page load complete



$(document).ready(function(){

    console.log("Hey here we are!");

    //on submit, prevent page refresh.
    $("#empForm").on("submit", function(event){

    event.preventDefault();

    //initialize variables
    var values = {};
    var empData = false;
    var strCheck = "";

    //fetch form values by stepping through the form object, storing each key value
    // pair in an object.
    $.each($("#empForm").serializeArray(), function(i, field){
      values[field.name] = field.value;
      //check to see if the data entry form was empty when submit happened
      strCheck = field.value;
      if (strCheck.length >0){
        empData = true;
      };
    });
    console.log("values = " + values);

    //if data was entered, push object to array
    if (empData){
      empArray.push(values);

      // post call
      $.ajax({
        type: 'POST',
        url: '/emps',
        data: values,
        success: function(response){

          console.log(response);
          listEmployees();

        }

      });

    };


    //clear out form values
    $("#empForm").find("input[type=text]").val("");

    //display employees
    // listEmployees();


  });


});


//  delete emplyee from array based on index stored in data for this employee form element
function delEmp(){

  console.log("in del emp");

  // fetch index from data attribute of parent of button, which should be the employee div

  var delIndex = $(this).parent().data("myIndex");

//  console.log("del index"+ delIndex);

  // remove the object from the array by index
  empArray.splice(delIndex,1);


  // display updated employees
  listEmployees();

};

// display the contents of the employee array
function listEmployees(){
  //total Salary
  var totalSalary = 0;
  var monthSalary = 0;
  var annualSalary = 0;


  // remove all existing from DOM and display fresh

  $('.employee').remove();

  // loop through employee array

  // I want to replace this with fetching an object
  var empRow = {};



  for (var i=0; i<empArray.length; i++){

    //create a empRow object and get from array

    empRow = empArray[i];


    // fetch annual salary. convert to number. only add if is actually a number.
    annualSalary=parseInt(empRow.empAnnualSalary);

    if (isNaN(annualSalary)){
      annualSalary =0;
    }

    totalSalary += parseInt(annualSalary);

    //totalSalary=formatCash(totalSalary);

    //format annual salary for display
    //annualSalary = formatCash(annualSalary);

    //console.log("total salary"+annualSalary);

     $('.empContainer').append('<div class="employee"></div>');
     var $el = $('.empContainer').children().last();


     // set the data attribute of the employee container with the current array index
     $el.data("myIndex", i);

     $el.append('<p>' + "First Name:  " + empRow.empFirstName + '</p>');
     $el.append('<p>' + "Last Name:  " + empRow.empLastName + '</p>');
     $el.append('<p class = "id">' + "ID number:  " + empRow.empIdNumber + '</p>');
     $el.append('<p>' + "Title:  " + empRow.empTitle + '</p>');
    //  $el.append('<p>' + "Annual Salary:  " + empRow.empAnnualSalary + '</p>');
     $el.append('<p>' + "Annual Salary:  " + formatCash(annualSalary) + '</p>');

     $el.append('<input class = "delEmp" val = "' + i + '" type = "submit"  value = "Delete" id="empDel' + i +'">');
  }

  //loop done
  //calc and display month salary
  monthSalary = Math.round(totalSalary / 12);

  if (isNaN(monthSalary)){
    monthSalary = 0;
  }

  //format month salary
  monthSalary = formatCash(monthSalary);

  // change display text of showsal <p> element
  $('#showSal').text(monthSalary);


  //  set onclick for delete buttons after created

  $( ".delEmp" ).on( "click", delEmp);

};

function formatCash(numCash){
    numCash = "$"+numCash;
    var len = numCash.length;
    if (len>4){
      numCash = numCash.substring(0, len-3)+ "," + numCash.substring(len-3,len);
    }
    len = numCash.length;

    if (len>8){
      numCash = numCash.substring(0, len-7)+ "," + numCash.substring(len-7,len);
    }
    console.log(numCash);
    return numCash;
}

// declare the one global variable


var empArray = [];
