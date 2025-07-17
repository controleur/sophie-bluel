module.exports = (req, res, next) => {
	try{
		const title = req.body.title?.trim();
		const categoryId = parseInt(req.body.category) || undefined;
		const userId = req.auth.userId || undefined;

		// Pas d'imageUrl ici : il sera défini APRES upload dans le contrôleur
		if(title &&
			title.length > 0 &&
			categoryId > 0 &&
			userId > 0 &&
			req.file && req.file.buffer){
			req.work = { title, categoryId, userId } // Plus besoin d'imageUrl ici
			next();
		}else{
			return res.status(400).json({error: new Error("Bad Request")})
		}
	}catch(e){
		return res.status(500).json({error: new Error("Something wrong occured")})
	}
}
