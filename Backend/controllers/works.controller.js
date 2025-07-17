const db = require('./../models');
const Works = db.works
const { put } = require('@vercel/blob');

exports.findAll = async (req, res) =>  {
	const works = await Works.findAll({include: 'category'});
	return res.status(200).json(works);
}

exports.create = async (req, res) => {
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;

	try{
		const blob = await put(req.file.originalname, req.file.buffer, {
			access: 'public',
			addRandomSuffix: true
		});
		const imageUrl = blob.url;

		const work = await Works.create({
			title,
			imageUrl,
			categoryId,
			userId
		})
		return res.status(201).json(work)
	}catch (err) {
		console.error(err);
		return res.status(500).json({ error: new Error('Something went wrong') })
	}
}

exports.delete = async (req, res) => {
	try{
		await Works.destroy({where:{id: req.params.id}})
		return res.status(204).json({message: 'Work Deleted Successfully'})
	}catch(e){
		return res.status(500).json({error: new Error('Something went wrong')})
	}

}
