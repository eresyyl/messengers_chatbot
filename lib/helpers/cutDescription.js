module.exports = (string) => {
	return (string.length < 80) ? string : `${string.substring(0, 77)}...`;
}