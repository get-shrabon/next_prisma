import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
    try {
        const id = Number(req.query.id)
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }

        if (req.method === 'GET') {
            const user = await prisma.user.findUnique({ where: { id } })
            if (!user) return res.status(404).json({ error: 'Not found' })
            return res.status(200).json(user)
        }

        if (req.method === 'PUT') {
            const { name, email } = req.body
            console.log('Updating user:', { id, name, email })
            const user = await prisma.user.update({
                where: { id },
                data: { name, email }
            })
            console.log('User updated:', user)
            return res.status(200).json(user)
        }

        if (req.method === 'DELETE') {
            console.log('Deleting user:', { id })
            await prisma.user.delete({ where: { id } })
            console.log('User deleted:', { id })
            return res.status(204).end()
        }

        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    }
}
