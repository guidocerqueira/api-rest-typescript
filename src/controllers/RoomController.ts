import { Request, Response } from 'express'
import { roomRepository } from '../repositories/roomRepository'
import { subjectRepository } from '../repositories/subjectRepository'
import { videoRepository } from '../repositories/videoRepository'

export class RoomController {
	async create(req: Request, res: Response) {
		const { name, description } = req.body

		try {
			const newRoom = roomRepository.create({ name, description })
			await roomRepository.save(newRoom)

			return res.status(201).json(newRoom)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Sever Error' })
		}
	}

	async createVideo(req: Request, res: Response) {
		const { title, url } = req.body
		const { idRoom } = req.params

		try {
			const room = await roomRepository.findOneBy({ id: Number(idRoom) })

			if (!room) {
				return res.status(404).json({ message: 'Aula não existe' })
			}

			const newVideo = videoRepository.create({
				title,
				url,
				room,
			})

			await videoRepository.save(newVideo)

			return res.status(201).json(newVideo)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Sever Error' })
		}
	}

	async roomSubject(req: Request, res: Response) {
		const { subject_id } = req.body
		const { idRoom } = req.params

		try {
			const room = await roomRepository.findOneBy({ id: Number(idRoom) })

			if (!room) {
				return res.status(404).json({ message: 'Aula não existe' })
			}

			const subject = await subjectRepository.findOneBy({
				id: Number(subject_id),
			})

			if (!subject) {
				return res.status(404).json({ message: 'Disciplina não existe' })
			}

			const roomUpdate = {
				...room,
				subjects: [subject],
			}

			await roomRepository.save(roomUpdate)

			return res.status(204).send()
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Sever Error' })
		}
	}

	async list(req: Request, res: Response) {
		try {
			const rooms = await roomRepository.find({
				relations: {
					subjects: true,
					videos: true,
				},
			})

			return res.json(rooms)
		} catch (error) {
			console.log(error)
			return res.status(500).json({ message: 'Internal Sever Error' })
		}
	}
}
