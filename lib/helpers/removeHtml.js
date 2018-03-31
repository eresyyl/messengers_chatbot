module.exports = (string) => {
	if (!string) return false;
	return string.toString().replace(/<[^>]*>/g, '');
}