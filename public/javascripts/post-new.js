
$('#addHours').on('click', function(){
    //reads the selected day/hours and converts it into texts

    const day = $('#day option:selected').val();
    const hourStart = $('#hourStart option:selected').val();
    const hourEnd = $('#hourEnd option:selected').val();
    //creates a div call and gives it a class of display-hours
    var div = $('<div/>').attr("class", "display-hours");
    //creates a span and assign it's text the variable day
    const remove = $('<span></span>').attr('class', 'remove-hours').text('REMOVE')
    var spanDay = $("<span> </span>").attr('class', 'day').text(day);
    var spanHourStart = $("<span> </span>").text(hourStart);
    var spanDash = $("<span> </span>").text("-");
    var spanHourEnd = $("<span> </span>").text(hourEnd);
    // let storeHours = {
    //     day: day,
    //     hourStart: hourStart,
    //     hourEnd: hourEnd
    // },
    
    var input = $('<input>').attr({
        type: 'hidden', 
        value: day + hourStart + hourEnd,
        // name: 'post[hours]'
        name: 'hours'
    }); 

    //appends hours/day div to #output
    $('#output').append(div);
    $(div).append(spanDay, spanHourStart, spanDash, spanHourEnd, remove, input);
    // removeDiv()
}); 
   
//binds to document
//attach function to .remove-hours(remove link)
//removes the parent div when press
function removeDiv(newClassName, bindID){
    $(document).on("click", '.remove-hours', function(){
    $(this).parent().remove(); 
    
    //looks at div w/ .categories (newClassName)
    //searches for divs w/ .form-group
    //displays #addCategory (bindID) link if there are less than 3 divs w/ .categories
    if($(newClassName).find('.form-group').length < 3){
        $(bindID).show();   
        } 
    });
};

////-------------------catgeroies input---------------------------//////

//calls above function to bind id and class
removeDiv('.categories', '#addCategory');

//when input for categories is on focus, asks the user to add more input fields
$('.categInput').one('focus', function(){
    createInputLink('addCategoryDiv', 'addCategory', 'Add another Category?', '.categories')
});

//creates the link that asks if more input fields are wanted
//appends the link in a new div after the first input field
function createInputLink (appendIDName, newHyperlinkID, btnText, newClassName){
    let divCat1 = $('<div/>').attr('id', appendIDName);
    let addLink = $("<span> </span>").attr({id: newHyperlinkID, class: 'hyperlink-btn'}).text(btnText)
    $(newClassName).after(divCat1);
    $(divCat1).append(addLink);
};

//when #addCategory (newHyperlinkID) link is pressed
//a div .form-group, input .form-control, and span remove .remove-hours is created
//div .form-group is appened to div .categories
//input .form-group and remove link is appended to div .form-group
//remove function is called 
//user will be able to add two more categories, after that "add cate" button disappears
$(document).on('click', '#addCategory', function(){
    //  inputLinkAction('Add another category', 'post[categories]', '.categories', '#addCategory')
     inputLinkAction('Add another category', 'categories', '.categories', '#addCategory')
});
//binds several attributes placeholder, name, and class
function  inputLinkAction (newPlaceholder, newName, newClassName, bindID){
    const remove = $('<span></span>').attr('class', 'remove-hours').text('REMOVE')
    let divCat2 = $('<div/>').attr('class', 'form-group')
    let inputCat = $('<input>').attr({
        placeholder: newPlaceholder,
        type: 'text',
        class: 'form-control', 
        name: newName
    });
   
    $(newClassName).append(divCat2)
    $(divCat2).append(inputCat, remove)
    checkNumOfInputs(newClassName, bindID)
}

//checks div newClassName
//searches if their are more than 3 input w/ class .form-group 
//hides bindID link if more than 3 input .form-group fields
function checkNumOfInputs(newClassName, bindID){
    if($(newClassName).find('.form-group').length > 2){
        $(bindID).hide();
        alert('You hit the maximun number of categories!');
    }
}

////-------------------crowd input---------------------------//////
//calls above remove function to bind id and class
removeDiv('.crowd', '#addCrowd');

//when input for crowd is on focus, asks the user to add more input fields
$('.crowdInput').one('focus', function(){
    createInputLink('addCrowdDiv', 'addCrowd', 'Add another crowd?', '.crowd')
  
});

//when #addCategory (newHyperlinkID) link is pressed
//a div .form-group, input .form-control, and span remove .remove-hours is created
//div .form-group is appened to div .categories
//input .form-group and remove link is appended to div .form-group
//remove function is called 
//user will be able to add two more categories, after that "add cate" button disappears
$(document).on('click', '#addCrowd', function(){
    // inputLinkAction('Add another crowd', 'post[crowd]', '.crowd', '#addCrowd')
    inputLinkAction('Add another crowd', 'crowd', '.crowd', '#addCrowd')
});

////-------------------music input---------------------------//////
//calls remove function to bind id and class
removeDiv('.music', '#addMusic');

//when input for music is on focus, asks the user to add more input fields
$('.musicInput').one('focus', function(){
    createInputLink('addMusicDiv', 'addMusic', 'Add another type of music?', '.music')
  
});

//when #addCategory (newHyperlinkID) link is pressed
//a div .form-group, input .form-control, and span remove .remove-hours is created
//div .form-group is appened to div .music
//input .form-group and remove link is appended to div .form-group
//remove function is called 
//user will be able to add two more categories, after that "add" button disappears
$(document).on('click', '#addMusic', function(){
    // inputLinkAction('What type of music', 'post[music]', '.music', '#addMusic')
    inputLinkAction('What type of music', 'music', '.music', '#addMusic')
});

// ------------------------------online and lounge only bizs-----------------------------------------------



$('.onlineOnly').on('click', function(){
    // const onlineBiz = $('input[name="post[onlineOnly]"]:checked').val();
    const onlineBiz = $('input[name="onlineOnly"]:checked').val();
    if (onlineBiz === 'yes'){
        $('.locationInput').prop('disabled', true);
        $('.companyHours').hide();
        $('.musicInput').prop('disabled', true)
        $('.crowdInput').prop('disabled', true)
        $('.coverInput').prop('disabled', true)
        $('.isSocial').prop('disabled', true)
    // console.log('onlineBiz ' + onlineBiz)
    } else {
        $('.locationInput').prop('disabled', false)
        $('.companyHours').show()
        $('.isSocial').prop('disabled', false)
    }
})

$('.isSocial').on('click', function(){
    //grabs the value of isSocial radio button
    // const userSocial = $('input[name="post[isSocial]"]:checked').val();
    const userSocial = $('input[name="isSocial"]:checked').val();
    // console.log('userSocial ' + userSocial)
    if (userSocial == 'no'){
        $('.musicInput').prop('disabled', true)
        $('.crowdInput').prop('disabled', true)
        $('.coverInput').prop('disabled', true)
    } else {
        $('.musicInput').prop('disabled', false)
        $('.crowdInput').prop('disabled', false)
        $('.coverInput').prop('disabled', false)

    }
})


