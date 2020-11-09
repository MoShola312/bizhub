

function starDisplay(rating, avgRating) {
    let starR = document.getElementById('starRating')
    for(let i = 0; i < 5; i++) {
        if (i < rating) { 
            //display a full star
            starR.document.createElement('i').classList.add('fas fa-star')
            // <i class="fas fa-star"></i>
        } else if((avgRating - i) > 0 && (avgRating - i) < 1) {
            // display a half star
            starR.document.createElement('i').classList.add('fas fa-star-half-alt')
            // <i class="fas fa-star-half-alt"></i>
            } else { 
                // display an empty star
                starR.document.createElement('i').classList.add('far fa-star')
                // <i class="far fa-star"></i>
                } 
     } 
 } 