module.exports = (rating) => {
	let star_rating = "";
	for(let j = 0; j < rating; j++)
		star_rating += "⭐";
	return star_rating;
}