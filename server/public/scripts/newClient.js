var empArray=[];

$(document).ready(function(){
    // do some setup
    initialize();
});

function initialize(){
    // set the listeners for buttons and submitPerson
    //call to db and display existing employees
    setListeners();
    displayEmployees();
}

function displayEmployees(){
    // get all emps from database and put in array.
    // loop through array and display.
    $.ajax({
      type: 'GET',
      url: '/emps',

      success: function(response){
        // console.log("in display people",response);
        // append employees to the dom
        appendEmployees(response);
      }
    });
}
function setListeners(){

    // set listeners for buttons, and default operation on form submit
    // on submit, revent default, call save employee to post and insert to the database
    $("#empForm").on("submit", function(event){
        event.preventDefault();
        saveEmployee();
    });

    // listener for toggle active
    // $('.empContainer').on('click','.toggle-active', toggleActive);
    $('.active-emps').on('click','.toggle-active', toggleActive);
    $('.inactive-emps').on('click','.toggle-active', toggleActive);
}
function toggleActive(){
    event.preventDefault();

        var empID = $(this).data('empid');
        var newStatus = $(this).data('newstatus');


        // var mathObject = { "valueA": valA, "valueB": valB }
        values = {'empID': empID, 'empStatus': newStatus};




        // do a put here
        $.ajax({
          type: 'PUT',
          url: '/emps',
          data: values,
          success: function(response){

            console.log(response);
            displayEmployees();

          }

        });





}

function appendEmployees(response){

    $('.empContainer').empty();
    $('.active-emps').empty();
    $('.inactive-emps').empty();

    var activeTarget = "";
    var empStyle = '';
    empArray=[];
    var totalMonthSalary = 0;
    response.forEach(function(employee){

        // push these into an array
    empArray.push(employee);
        });
        if (empArray.length==0){
            return;
        }

        var empRow;
        for (var i=0; i<empArray.length; i++){

            empRow = empArray[i];

            if (empRow.fldEmpActive==true){
                activeTarget = '.active-emps';
                empStyle = 'emp-active';
                totalMonthSalary = totalMonthSalary + (empRow.fldEmpSalary/12);
                totalMonthSalary = parseInt(totalMonthSalary);
            } else {
                activeTarget = '.inactive-emps';
                empStyle = 'emp-inactive';
            }

            //we have them in an array, loop through and do stuff.
            $(activeTarget).append('<div class = "emp-block ' + empStyle + '">List an employee here in a div</div>');
            var $el = $(activeTarget).children().last();


            $el.append('<p>Name:' + empRow.fldEmpLastName +' '+empRow.fldEmpFirstName+ '</p>');
            $el.append('<p>Number:' + empRow.fldEmpNumber + '</p>');
            $el.append('<p>Salary:' + empRow.fldEmpSalary + '</p>');
            $el.append('<p>Title:' + empRow.fldEmpTitle + '</p>');
            // $el.append('<p>Active:put a button here. On click do a post call: current value=' + empRow.fldEmpActive + '</p>');

            if (empRow.fldEmpActive==true){
              $el.append('<button data-empID = "' + empRow.fldEmpID + '" data-newStatus ="false" class="toggle-active">Make Inactive</button>');

            } else {
              $el.append('<button data-empID = "' + empRow.fldEmpID + '" data-newStatus ="true" class="toggle-active">Make Active</button>');

            }

      }

      // update totalMonthSalary
      console.log("total month salary =", totalMonthSalary);
      $('#showSal').text('$' + totalMonthSalary);

    //   $('.person-drop').append('<option value = "'+ person.person_id +'">' + person.first_name + ' '+ person.last_name +'</option>');



}

function saveEmployee(){

    console.log("I am in function save employee");

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
          displayEmployees();

        }

      });

    };


    //clear out form values
    $("#empForm").find("input[type=text]").val("");

    //display employees
    // listEmployees();

}
