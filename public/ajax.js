//like button
$('#likeForm').submit(function(e){
    e.preventDefault();
    let actionUrl = $(this).attr('action')
    console.log(`url: ${actionUrl}`)

$.ajax({ 
    url: actionUrl, 
    data:'',
    type: "POST",
    
    success: function(response) {
		
		// console.log(`response: ${response}`)
		// console.log(`review.like: ${response.review.likes.length}`)
		// console.log(`founduser: ${response.foundUserLike}`)
	   
		//if foundUserLike is "true", unlike the button, pull LIKE
     if (response.foundUserLike) { 
		$('.likedBtn1').attr('class', 'btn btn-sm btn-secondary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Like (${response.review.likes.length})`)
		
	 } else {
		//foundUserLike is "false" means user didn't LIKE it yet, like the button, add LIKE
		//change the class of the button
		//change the icon text of the font awesome
		$('.likedBtn1').attr('class', 'btn btn-sm btn-primary likedBtn1').html(`<i class="fas fa-thumbs-up"></i> Liked (${response.review.likes.length})`)

		 }
        
	}})
})

// like form
// <form action="/posts/<%= post.id %>/reviews/<%= review.id %>/like" method="POST" id="likeForm">
// 				<div class="btn-group" id="likesDiv">
// 					<% if (currentUser && review.likes.some(function (like) { 
// 						return like.equals(currentUser._id)
// 					 })) { %>
// 						<button class="btn btn-sm btn-primary likedBtn1">
// 							<i class="fas fa-thumbs-up likedBtn"></i> Liked (<%= review.likes.length %>)
// 						</button>
// 					<% } else { %>
// 						<button class="btn btn-secondary btn-sm ">
// 							<i class="fas fa-thumbs-up likeBtn"></i> Like (<%= review.likes.length %>)
// 						</button>
// 					<% } %>

// 				</div>
// 			</form>






// alert("ajax!")


// $('#create-review-form').submit(function(e){
//     e.preventDefault();
//     let reviewItem = $(this).serialize();
//         let actionUrl = $(this).attr('action')
// //    

// $.ajax({ 
//     url: actionUrl, 
//     data: reviewItem,
//     type: "POST",

//     success: function(response) {
//         console.log(`response: ${response}`)
//         console.log(`url: ${actionUrl}`)
//         debugger
//         $('#append-review').append(
//     //         `
// 	// <div class="row">
//     // <p>response.author.id: ${response.author._id}</p>
// 	// <br>response.author.username:  ${response.author.username }
// 	// <br>${response.rating}) ,  moment(${response.createdAt}).fromNow()
// 	// <br>response.body: ${response.body }
// 	// <br>${actionUrl}/ ${response._id }>
// 	//  				 (${response.likes.length})</p>	
// 	// `

// `
//   <div class="row">
// 	<div class="col-2"></div>
// 	<div class="col-1">
//   		<a href="/profile/${response.author.id}"><img src="${response.author.image.secure_url} " class="profile-show-image mr-2">
// 			${response.author.username }</a>
// 	</div>
// 	<div class="col-4">
// 		<p>Rating: ${response.rating } 
// 		<br>${response.body }</p>
// 		<div style="padding-bottom: 10px;">
// 			<form action="${actionUrl}/${response._id }/like" method="POST">
// 				<div class="btn-group">
// 						<button class="btn btn-sm btn-primary">
// 							<i class="fas fa-thumbs-up"></i> Liked (${response.likes.length})
// 						</button>
// 						<button class="btn btn-secondary btn-sm">
// 							<i class="fas fa-thumbs-up"></i> Like (${response.likes.length})
// 						</button>
// 				</div>
// 			</form>
// 		</div>


// 	<div>
		

// 				<p class="toggle-reply-form">REPLY</p>
// 				<form action="${actionUrl}/${response._id}/replies" method="POST" class="reply-form">
// 					<textarea name="reply[body]" required></textarea>
// 					<input class="btn btn-success mb-2" type="submit">
// 				</form>


				
// 				<p><a href="/login?returnTo=true" class="toggle-reply-form" >REPLY</a></p>
			
// 		</div>
// 	</div>


	



// 		<div class="form-group col-3">
// 			<button class="toggle-edit-form btn btn-primary mb-2">Edit</button>
// 			<form action="${actionUrl}/${response._id}_method=PUT" method="POST" class="edit-review-form">
// 				<textarea name="review[body]" required>${response.body}</textarea>
// 				<fieldset class="starability-basic">
// 				<legend>Rating:</legend>
// 				<button class="clear-rating" type="button">Clear Rating</button>
// 				<input type="radio" id="edit-rate0" class="input-no-rate" name="review[rating]" value="0" checked aria-label="No rating." />
// 				<input type="radio" id="edit-rate1" name="review[rating]" value="1" />
// 				<label for="edit-rate1" title="Terrible">1 star</label>
// 				<input type="radio" id="edit-rate2" name="review[rating]" value="2" />
// 				<label for="edit-rate2" title="Not good">2 stars</label>
// 				<input type="radio" id="edit-rate3" name="review[rating]" value="3" />
// 				<label for="edit-rate3" title="Average">3 stars</label>
// 				<input type="radio" id="edit-rate4" name="review[rating]" value="4" />
// 				<label for="edit-rate4" title="Very good">4 stars</label>
// 				<input type="radio" id="edit-rate5" name="review[rating]" value="5" />
// 				<label for="edit-rate5" title="Amazing">5 stars</label>
// 				</fieldset>
// 				<input class="btn btn-success" type="submit" value="Update">
// 			</form>


			
		



// 			<form action="${actionUrl}/${response.id}?_method=DELETE" method="POST">
// 				<input class="btn btn-danger" type="submit" value="Delete">
// 			</form>
// 		</div>
		 
// 		<div class="col-2"></div>
// 	</div>


// `

// )}

// })  }); 

