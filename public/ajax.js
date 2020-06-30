$('#create-review-form').submit(function(e){
    e.preventDefault();
    let reviewItem = $(this).serialize();

    $.post('/posts/:id/reviews', reviewItem, function(data){

    })
})