import fs from 'fs'
import formidable from 'formidable'
import { type NextApiRequest, type NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const videoId = req.query.videoId as string

    // Parse the incoming form data
    const form = formidable({})
    const [fields, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ message: 'No file provided' })
    }

    // Read the file as a buffer instead of a stream
    const fileBuffer = fs.readFileSync(file.filepath)

    // TODO: Figure out how to upload the file to Bunny.net stream
    // Upload to Bunny.net
    const response = await fetch(
      `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos/${videoId}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/octet-stream',
          AccessKey: process.env.BUNNY_API_KEY!,
        },
        body: fileBuffer, // Use buffer instead of stream
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Bunny.net API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Failed to upload video: ${response.statusText}`)
    }

    // Clean up the temporary file
    fs.unlinkSync(file.filepath)

    return res.status(200).json(await response.json())
  } catch (error) {
    console.error('Error in upload handler:', error)
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Failed to upload video',
    })
  }
}
