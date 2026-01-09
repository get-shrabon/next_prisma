import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const users = await prisma.user.findMany()
            return res.status(200).json(users)
        }

        if (req.method === 'POST') {
            const { name, email } = req.body
            if (!name || !email) {
                return res.status(400).json({ error: 'name and email required' })
            }

            console.log('Creating user:', { name, email })
            const user = await prisma.user.create({
                data: { name, email }
            })
            console.log('User created:', user)
            return res.status(201).json(user)
        }

        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    }
}
