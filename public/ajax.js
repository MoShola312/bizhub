// $('#likeForm').submit(function(e){
//     e.preventDefault();
//     console.log(e)
//     let reviewID = $(this).val();
//     console.log(`reviewID: ${reviewID}`);
//     let actionUrl = $(this).attr('action')
//     console.log(`url: ${actionUrl}`)

// $.ajax({ 
//     url: actionUrl, 
//     data: reviewID,
//     type: "POST",
    
//     success: function(data) {
//         console.log(`data: ${data}`)
        
        
//         // debugger
// 		$('#append-review').append()}
// 	})
// })








$('#create-review-form').submit(function(e){
    e.preventDefault();
    let reviewItem = $(this).serialize();
        let actionUrl = $(this).attr('action')
//    

$.ajax({ 
    url: actionUrl, 
    data: reviewItem,
    type: "POST",

    success: function(data) {
        console.log(`data: ${data}`)
        console.log(`url: ${actionUrl}`)
        debugger
        $('#append-review').append(`
    

  <div class="row">
	<div class="col-2"></div>
	<div class="col-1">
  <a href="/profile/${data.author.id}"><img src="${data}.author.image.secure_url " class="profile-show-image mr-2">
			${data.author.username }</a>
	</div>
	<div class="col-4">
		<p>
		{/* starDisplay(${data.rating}) ,  moment(${data.createdAt}).fromNow() */}
		</p>
		<p>Rating: ${data.rating } 
		<br>${data.body }</p>
		{/* like button */}
		<div style="padding-bottom: 10px;">
			<form action="${actionUrl}/${data.id }/like" method="POST">
				<div class="btn-group">
					if (currentUser && review.likes.some(function (like) { 
						return like.equals(currentUser._id)
					 })) { 
						<button class="btn btn-sm btn-primary">
							<i class="fas fa-thumbs-up"></i> Liked (${data.likes.length})
						</button>
					} else { 
						<button class="btn btn-secondary btn-sm">
							<i class="fas fa-thumbs-up"></i> Like (${data.likes.length})
						</button>
					 } 

				</div>
			</form>
		</div>


		<div>
			{/* reply form  */}
			{/* only reviewer and biz owner can reply */}
			if(currentUser && post.owner.equals(currentUser._id) || currentUser && currentUser.equals(review.author._id) || currentUser && currentUser.isAdmin) { 
				<p class="toggle-reply-form">REPLY</p>
				<form action="${actionUrl}/${data.id}/replies" method="POST" class="reply-form">
					<textarea name="reply[body]" required></textarea>
					<input class="btn btn-success mb-2" type="submit">
				</form>
				 {/* hide the reply button if there is a currentUser but is not the owner or the review author  */}
				 } else if (currentUser && !post.owner.equals(currentUser._id) || currentUser && !currentUser.equals(review.author._id))  { 
					<p> </p>
				 } else { 
				<p><a href="/login?returnTo=true" class="toggle-reply-form" >REPLY</a></p>
				} 
		</div>
	</div>
	// update a review 
	if(currentUser && review.author.equals(currentUser._id) || currentUser && currentUser.isAdmin) {
		<div class="form-group col-3">
			<button class="toggle-edit-form btn btn-primary mb-2">Edit</button>
			<form action="${actionUrl}/${data.id}_method=PUT" method="POST" class="edit-review-form">
				<textarea name="review[body]" required>${data.body}</textarea>
				<fieldset class="starability-basic">
				<legend>Rating:</legend>
				<button class="clear-rating" type="button">Clear Rating</button>
				<input type="radio" id="edit-rate0" class="input-no-rate" name="review[rating]" value="0" checked aria-label="No rating." />
				<input type="radio" id="edit-rate1" name="review[rating]" value="1" />
				<label for="edit-rate1" title="Terrible">1 star</label>
				<input type="radio" id="edit-rate2" name="review[rating]" value="2" />
				<label for="edit-rate2" title="Not good">2 stars</label>
				<input type="radio" id="edit-rate3" name="review[rating]" value="3" />
				<label for="edit-rate3" title="Average">3 stars</label>
				<input type="radio" id="edit-rate4" name="review[rating]" value="4" />
				<label for="edit-rate4" title="Very good">4 stars</label>
				<input type="radio" id="edit-rate5" name="review[rating]" value="5" />
				<label for="edit-rate5" title="Amazing">5 stars</label>
				</fieldset>
				<input class="btn btn-success" type="submit" value="Update">
			</form>
			<script>
				$('#edit-rate${data.rating}').prop('checked', true);
			</script>
			<form action="${actionUrl}/${data.id}?_method=DELETE" method="POST">
				<input class="btn btn-danger" type="submit" value="Delete">
			</form>
		</div>
		 } 
		<div class="col-2"></div>
	</div>
}

`
)}
  }); 
})