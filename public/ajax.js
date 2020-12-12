
//like button
$('.likeForm').on('submit', function(e){
    e.preventDefault();
    let actionUrl = $(this).attr('action')
	console.log(`url: ${actionUrl}`)
	let likeBtn = $(this).find('.likedBtn1')

$.ajax({ 
	url: actionUrl,
	btn: likeBtn, 
    data:'',
    type: "POST",
    
    success: function(response) {
		
		//if user isn't logged in redirects them to login screen
		if(response.foundUserLike == undefined){
			
			window.location.href ="/login";
			
		}
		
	   
		//if foundUserLike is "true", unlike the button, pull LIKE
		else if (response.foundUserLike) { 
			// console.log(`founduser:  ${response.foundUserLike}`)
			// $("#" + response.review._id).attr('class', 'btn btn-sm btn-secondary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Like (${response.review.likes.length})`)
			$(likeBtn).attr('class', 'btn btn-sm btn-secondary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Like (${response.review.likes.length})`)
			$(likeBtn).blur()
			// debugger
		} else {
			// console.log(`else founduser:  ${response.foundUserLike}`)
			//foundUserLike is "false" means user didn't LIKE it yet, add LIKE
			//change the class of the button
			//change the icon text of the font awesome
			// $("#" + response.review._id).attr('class', 'btn btn-sm btn-primary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Liked (${response.review.likes.length})`)
			$(likeBtn).attr('class', 'btn btn-sm btn-primary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Liked (${response.review.likes.length})`)
			}	
	}
})
})

